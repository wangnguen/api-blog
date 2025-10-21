const router = require("express").Router();

const commentController = require("../controllers/comment.controller");
const { verifyToken } = require("../middlewares/verifyToken");
const catchAsync = require("../utils/catchAsync");

router.get(
	"/posts/:postId/comments",
	catchAsync(commentController.getCommentsByPost),
);

router.post(
	"/posts/:postId/comments",
	verifyToken,
	catchAsync(commentController.createComment),
);

router.delete(
	"/comments/:id",
	verifyToken,
	catchAsync(commentController.deleteComment),
);

module.exports = router;
