const router = require("express").Router();

const categoryController = require("../controllers/category.controller");
const catchAsync = require("../utils/catchAsync");

router.get("/", catchAsync(categoryController.list));

router.get("/:slug", catchAsync(categoryController.getBySlug));

router.post("/", catchAsync(categoryController.createCategory));

router.patch("/:id", catchAsync(categoryController.editCategory));

router.delete("/:id", catchAsync(categoryController.deleteCategory));

module.exports = router;
