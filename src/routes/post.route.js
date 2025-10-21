const router = require("express").Router();

const postController = require("../controllers/post.controller");

const { verifyToken, optionalAuth } = require("../middlewares/verifyToken");

const catchAsync = require("../utils/catchAsync");

router.get("/", catchAsync(postController.getAllPosts));

router.get("/top", catchAsync(postController.getTopPosts));

router.post("/", verifyToken, catchAsync(postController.createPost));

router.get("/:slug", optionalAuth, catchAsync(postController.getPostDetail));

router.patch("/:id", verifyToken, catchAsync(postController.updatePost));

router.delete("/:id", verifyToken, catchAsync(postController.deletePost));

router.post("/:id/like", verifyToken, catchAsync(postController.toggleLike));

router.get("/:id/likes", catchAsync(postController.getLikes));

module.exports = router;
