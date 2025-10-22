const { StatusCodes } = require("http-status-codes");
const { sendSuccessResponse } = require("../helpers/apiRespone");
const {
	getAllPostsService,
	getTopFromCache,
	createPostService,
	getPostDetailService,
	updatePostService,
	deletePostService,
	toggleLikeService,
	getLikesService,
} = require("../services/post.service");

module.exports.getAllPosts = async (req, res) => {
	const { posts, totalPage } = await getAllPostsService(req.query);

	return sendSuccessResponse(
		res,
		{ posts, totalPage },
		"success",
		"Lấy danh sách bài viết thành công !",
		StatusCodes.OK,
	);
};

module.exports.getTopPosts = async (req, res) => {
	const topPosts = await getTopFromCache();

	return sendSuccessResponse(
		res,
		topPosts,
		"success",
		"Lấy danh sách top bài viết thành công !",
		StatusCodes.OK,
	);
};

module.exports.createPost = async (req, res) => {
	const topPosts = await createPostService(req.user.id, req.body);

	return sendSuccessResponse(
		res,
		topPosts,
		"success",
		"Tạo bài viết thành công !",
		StatusCodes.CREATED,
	);
};

module.exports.getPostDetail = async (req, res) => {
	const { slug } = req.params;
	const ipAddress = req.ip;
	const userId = req?.user?.id;
	const postDetail = await getPostDetailService(slug, ipAddress, userId);

	return sendSuccessResponse(
		res,
		postDetail,
		"success",
		"Lấy chi tiết bài viết thành công",
	);
};

module.exports.updatePost = async (req, res) => {
	const { id } = req.params;
	const role = req.user.role;
	const userId = req.user._id;

	const updatedPost = await updatePostService(id, role, userId, req.body);

	return sendSuccessResponse(
		res,
		updatedPost,
		"success",
		"Sửa bài viết thành công !",
		StatusCodes.OK,
	);
};

module.exports.deletePost = async (req, res) => {
	const { id } = req.params;
	const role = req.user.role;
	const userId = req.user._id;

	await deletePostService(id, role, userId);

	return sendSuccessResponse(
		res,
		null,
		"success",
		"Xoá bài viết thành công !",
		StatusCodes.OK,
	);
};

module.exports.toggleLike = async (req, res) => {
	const userId = req.user.id;
	const postId = req.params.id;

	const { liked, likesCount } = await toggleLikeService(userId, postId);

	return sendSuccessResponse(
		res,
		{ liked, likesCount },
		"success",
		"Like bài viết thành công !",
		StatusCodes.OK,
	);
};

module.exports.getLikes = async (req, res) => {
	const postId = req.params.id;
	console.log(postId);
	const likes = await getLikesService(postId);

	return sendSuccessResponse(
		res,
		likes,
		"success",
		"Lấy danh sách người đã thích thành công !",
		StatusCodes.OK,
	);
};
