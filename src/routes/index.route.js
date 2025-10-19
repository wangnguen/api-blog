const router = require("express").Router();

const { verifyToken } = require("../middlewares/verifyToken");

const authRoute = require("./auth.route");
const categoryRoute = require("./category.route");
const userRoute = require("./user.route");
const tagRoute = require("./tag.route");

router.use("/auth", authRoute);

router.use("/categories", verifyToken, categoryRoute);

router.use("/users", userRoute);

router.use("/tags", tagRoute);

router.use((req, res) => {
	res.status(404).json({
		code: "error",
		data: "404 NOT FOUND",
	});
});

module.exports = router;
