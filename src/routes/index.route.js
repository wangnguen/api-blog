const router = require("express").Router();

const { verifyToken } = require("../middlewares/verifyToken");

const authRoute = require("./auth.route");
const categoryRoute = require("./category.route");
const userRoute = require("./user.route");
const tagRoute = require("./tag.route");
const postRoute = require("./post.route");
const commentRoute = require("./comment.route");

router.use("/auth", authRoute);

router.use("/categories", categoryRoute);

router.use("/users", userRoute);

router.use("/tags", tagRoute);

router.use("/posts", postRoute);

router.use("/", commentRoute);

router.use((req, res) => {
	res.status(404).json({
		code: "error",
		data: "404 NOT FOUND",
	});
});

module.exports = router;
