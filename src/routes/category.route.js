const router = require("express").Router();

const categoryController = require("../controllers/category.controller");
const { verifyToken } = require("../middlewares/verifyToken");

const catchAsync = require("../utils/catchAsync");

router.get("/", catchAsync(categoryController.list));

router.post("/", verifyToken, catchAsync(categoryController.createCategory));

router.get("/:slug", catchAsync(categoryController.getBySlug));

router.patch("/:id", verifyToken, catchAsync(categoryController.editCategory));

router.delete(
	"/:id",
	verifyToken,
	catchAsync(categoryController.deleteCategory),
);

module.exports = router;
