const { StatusCodes } = require("http-status-codes");
const Category = require("../models/category.model");
const Post = require("../models/post.model");
const Tag = require("../models/tag.model");
const { generateSlug } = require("../utils/generate");
const { paginate } = require("../utils/pagination");
const { delCache, getCache, setCache, remember } = require("./cache.service");

module.exports.getAllPostsService = async (query) => {
	const filter = { deleted: false };

	const { sort = "-createdAt", tag, category } = query;

	// Loc
	if (tag) filter.tags = tag;
	if (category) filter.category = category;

	// Phan trang
	const { skip, limit, totalPage } = await paginate(Post, filter, query);

	const posts = await Post.find(filter)
		.select("title description views likesCount createdAt slug")
		.populate("author", "fullName")
		.sort(sort)
		.limit(limit)
		.skip(skip);

	return { posts, totalPage };
};

module.exports.getTopFromCache = async () => {
	return remember("top_posts", 3600, async () => {
		return await Post.find({ deleted: false })
			.sort({ views: -1, likesCount: -1 })
			.limit(5)
			.select("title views likesCount createdAt slug")
			.populate("author", "fullName");
	});
};

module.exports.createPostService = async (userId, data) => {
	const { title, content, description, category, tags } = data;

	// check category
	const existingCategory = await Category.findOne({
		_id: category,
		deleted: false,
	});

	if (!existingCategory) {
		throw new ErrorResponse(StatusCodes.BAD_REQUEST, "Category không tồn tại");
	}

	// check tag khong co tag thi tao moi
	const tagIds = await Promise.all(
		tags.map(async (t) => {
			const slug = generateSlug(t);
			let tagDoc = await Tag.findOne({ name: t });
			if (!tagDoc) tagDoc = await Tag.create({ name: t, slug });
			return tagDoc._id;
		}),
	);

	// Tao moi
	const newPost = new Post({
		title,
		slug: generateSlug(title),
		description,
		content,
		category: existingCategory._id,
		tags: tagIds,
		author: userId,
	});

	await newPost.save();

	// Cap nhat postCount
	await Tag.updateMany({ _id: { $in: tagIds } }, { $inc: { postCount: 1 } });

	// xoa cache top_posts
	await delCache("top_posts");

	return newPost;
};

module.exports.getPostDetailService = async (slug, ipAddress, userId) => {
	const existingPost = await Post.findOne({ slug })
		.select(
			"title slug description content views likesCount author category createdAt",
		)
		.populate("author", "fullName avatar")
		.populate("category", "name slug")
		.lean();

	if (!existingPost)
		throw new ErrorResponse(StatusCodes.NOT_FOUND, "Bài viết không tồn tại!");

	// Cache key theo ip tranh view ao
	const cacheKey = `view:${slug}:${ipAddress}`;
	const alreadyViewed = await getCache(cacheKey);

	if (
		!alreadyViewed &&
		(!userId || userId.toString() !== existingPost.author._id.toString())
	) {
		await Post.findByIdAndUpdate(existingPost._id, { $inc: { views: 1 } });
		await setCache(cacheKey, true, 900);
	}

	return existingPost;
};

module.exports.updatePostService = async (id, data) => {
	const updatedPost = await Post.findOneAndUpdate(
		{ _id: id, deleted: false },
		data,
		{
			new: true,
		},
	);

	if (!updatedPost) {
		throw new ErrorRespone(StatusCodes.BAD_REQUEST, "Bài viết không tồn tại !");
	}

	return updatedPost;
};

module.exports.deletePostService = async (id, data) => {
	const updatedPost = await Post.findOne({ _id: id, deleted: false });

	if (!updatedPost) {
		throw new ErrorRespone(StatusCodes.BAD_REQUEST, "Bài viết không tồn tại !");
	}

	updatedPost.deleted = true;

	updatedPost.save();

	return updatedPost;
};
