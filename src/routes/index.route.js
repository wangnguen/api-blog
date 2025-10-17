const router = require("express").Router();

const { verifyToken } = require("../middlewares/verifyToken");
const authRoute = require("./auth.route");
const categoryRoute = require("./category.route");

router.use("/auth", authRoute);
router.use("/categories", verifyToken, categoryRoute);

router.use((req, res) => {
	res.status(404).json({
		code: "error",
		data: "404 NOT FOUND",
	});
});

module.exports = router;
