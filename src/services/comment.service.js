const Comment = require("../models/comment.model");
const ErrorRespone = require("../helpers/errorRespone");
const { StatusCodes } = require("http-status-codes");
const Post = require("../models/post.model");

module.exports.getCommentsByPostService = async (postId) => {
	const existingPost = await Post.findOne({
		_id: postId,
	});

	if (!existingPost) {
		throw new ErrorRespone(StatusCodes.NOT_FOUND, "Bài viết không tồn tại !");
	}

	const comments = await Comment.find({ postId: postId, deleted: false })
		.populate("userId", "username fullName avatar")
		.sort({ createdAt: -1 });

	return comments;
};

module.exports.createCommentService = async (
	postId,
	userId,
	content,
	parentId,
) => {
	const existingPost = await Post.findOne({
		_id: postId,
	});
	console.log(existingPost);
	if (!existingPost) {
		throw new ErrorRespone(StatusCodes.NOT_FOUND, "Bài viết không tồn tại !");
	}

	// Tao comment
	const comment = new Comment({
		postId,
		userId: userId,
		content: content.trim(),
		parentId: parentId || null,
	});

	await comment.save();

	return comment;
};

module.exports.deleteCommentService = async (id) => {
	const existingComment = await Comment.findOne({ _id: id });

	if (!existingComment) {
		throw new ErrorRespone(StatusCodes.NOT_FOUND, "Comment không tồn tại");
	}

	existingComment.deleted = true;
	await existingComment.save();
	return;
};
