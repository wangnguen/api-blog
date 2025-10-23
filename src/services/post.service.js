const { StatusCodes } = require("http-status-codes");
const Category = require("../models/category.model");
const Post = require("../models/post.model");
const Tag = require("../models/tag.model");
const { generateSlug } = require("../utils/generate");
const { paginate } = require("../utils/pagination");
const { delCache, getCache, setCache, remember } = require("./cache.service");
const Like = require("../models/like.model");
const ErrorResponse = require("../helpers/errorRespone");

module.exports.getAllPostsService = async (query) => {
	const filter = { deleted: false };

	const { sort = "-createdAt", tag, category } = query;
	// Loc
	if (tag) {
		const tagIds = Array.isArray(tag) ? tag : tag.split(",");
		filter.tags = { $in: tagIds };
	}
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
		throw new ErrorResponse(StatusCodes.NOT_FOUND, "Category không tồn tại");
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

module.exports.updatePostService = async (id, role, userId, data) => {
	const existingPost = await Post.findOne({
		_id: id,
		deleted: false,
	});

	if (
		role !== "admin" &&
		existingPost.author.toString() !== userId.toString()
	) {
		throw new ErrorResponse(
			StatusCodes.FORBIDDEN,
			"Bạn không có quyền chỉnh sửa bài viết này !",
		);
	}

	data.slug = generateSlug(data.title);
	
	const updatedPost = await Post.findOneAndUpdate(
		{ _id: id, deleted: false },
		data,
		{
			new: true,
		},
	);

	if (!updatedPost) {
		throw new ErrorResponse(StatusCodes.NOT_FOUND, "Bài viết không tồn tại !");
	}

	return updatedPost;
};

module.exports.deletePostService = async (id, role, userId) => {
	const updatedPost = await Post.findOne({ _id: id, deleted: false });

	if (!updatedPost) {
		throw new ErrorResponse(StatusCodes.NOT_FOUND, "Bài viết không tồn tại !");
	}

	if (role !== "admin" && updatedPost.author.toString() !== userId.toString()) {
		throw new ErrorResponse(
			StatusCodes.FORBIDDEN,
			"Bạn không có quyền xóa bài viết này !",
		);
	}

	updatedPost.deleted = true;

	updatedPost.save();

	return updatedPost;
};

module.exports.toggleLikeService = async (userId, postId) => {
	const existingPost = await Post.findOne({ _id: postId, deleted: false });

	if (!existingPost)
		throw new ErrorResponse(StatusCodes.NOT_FOUND, "Bài viết không tồn tại");

	// Check user da like chua
	const existingLike = await Like.findOne({ postId, userId });

	let liked;
	if (existingLike) {
		// Da like → unlike
		await Promise.all([
			existingLike.deleteOne(),
			Post.findOneAndUpdate({ _id: postId }, { $inc: { likesCount: -1 } }),
		]);
		liked = false;
	} else {
		// chua like -> tao moi
		await Promise.all([
			Like.create({ postId, userId }),
			Post.findOneAndUpdate({ _id: postId }, { $inc: { likesCount: 1 } }),
		]);
		liked = true;
	}

	// Lay lai luot thich moi nhat
	const updatedPost = await Post.findOne({
		_id: postId,
		deleted: false,
	}).select("likesCount");

	return {
		liked,
		likesCount: updatedPost.likesCount,
	};
};

module.exports.getLikesService = async (postId) => {
	const existingPost = await Post.findOne({ _id: postId, deleted: false });

	if (!existingPost)
		throw new ErrorResponse(StatusCodes.NOT_FOUND, "Bài viết không tồn tại");

	const likes = await Like.find({ postId: postId })
		.populate("userId", "username fullName avatar")
		.sort({ createdAt: -1 });

	return likes;
};
