const { StatusCodes } = require("http-status-codes");
const { sendSuccessResponse } = require("../helpers/apiRespone");
const {
	getCommentsByPostService,
	deleteCommentService,
	createCommentService,
} = require("../services/comment.service");

module.exports.getCommentsByPost = async (req, res) => {
	const { postId } = req.params;

	const comments = await getCommentsByPostService(postId);

	return sendSuccessResponse(
		res,
		comments,
		"success",
		"Lấy comment thành công !",
		StatusCodes.OK,
	);
};

module.exports.createComment = async (req, res) => {
	const { postId } = req.params;
	const userId = req.user.id;
	const { content, parentId } = req.body;

	const newComment = await createCommentService(
		postId,
		userId,
		content,
		parentId,
	);
	return sendSuccessResponse(
		res,
		newComment,
		"success",
		"Tạo comment thành công !",
		StatusCodes.CREATED,
	);
};

module.exports.deleteComment = async (req, res) => {
	const { id } = req.params;

	await deleteCommentService(id);

	return sendSuccessResponse(
		res,
		null,
		"success",
		"Xoá comment thành công !",
		StatusCodes.OK,
	);
};
