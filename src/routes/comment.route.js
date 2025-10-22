const router = require("express").Router();

const commentController = require("../controllers/comment.controller");
const { checkRole } = require("../middlewares/auth");
const { verifyToken } = require("../middlewares/verifyToken");
const catchAsync = require("../utils/catchAsync");

router.get(
	"/posts/:postId/comments",
	catchAsync(commentController.getCommentsByPost),
);

router.post(
	"/posts/:postId/comments",
	verifyToken,
	checkRole("user", "admin"),
	catchAsync(commentController.createComment),
);

router.delete(
	"/comments/:id",
	verifyToken,
	checkRole("user", "admin"),
	catchAsync(commentController.deleteComment),
);

module.exports = router;
