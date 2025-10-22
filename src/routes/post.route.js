const router = require("express").Router();

const postController = require("../controllers/post.controller");
const postValidation = require("../validations/post.validation");
const { checkRole } = require("../middlewares/auth");

const { verifyToken, optionalAuth } = require("../middlewares/verifyToken");

const catchAsync = require("../utils/catchAsync");

router.get("/", catchAsync(postController.getAllPosts));

router.get("/top", catchAsync(postController.getTopPosts));

router.post(
	"/",
	verifyToken,
	checkRole("user", "admin"),
	postValidation.createPost,
	catchAsync(postController.createPost),
);

router.get("/:slug", optionalAuth, catchAsync(postController.getPostDetail));

router.patch(
	"/:id",
	verifyToken,
	checkRole("user", "admin"),
	postValidation.createPost,
	catchAsync(postController.updatePost),
);

router.delete(
	"/:id",
	verifyToken,
	checkRole("user", "admin"),
	catchAsync(postController.deletePost),
);

router.post(
	"/:id/like",
	verifyToken,
	checkRole("user", "admin"),
	catchAsync(postController.toggleLike),
);

router.get("/:id/likes", catchAsync(postController.getLikes));

module.exports = router;
