const router = require("express").Router();

const categoryController = require("../controllers/category.controller");
const { checkRole } = require("../middlewares/auth");
const { verifyToken } = require("../middlewares/verifyToken");

const catchAsync = require("../utils/catchAsync");

router.get("/", catchAsync(categoryController.list));

router.post(
	"/",
	verifyToken,
	checkRole("admin"),
	catchAsync(categoryController.createCategory),
);

router.get("/:slug", catchAsync(categoryController.getBySlug));

router.patch(
	"/:id",
	verifyToken,
	checkRole("admin"),
	catchAsync(categoryController.editCategory),
);

router.delete(
	"/:id",
	verifyToken,
	checkRole("admin"),
	catchAsync(categoryController.deleteCategory),
);

module.exports = router;
