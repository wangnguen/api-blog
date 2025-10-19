const router = require("express").Router();

const tagController = require("../controllers/tag.controller");
const { verifyToken } = require("../middlewares/verifyToken");
const catchAsync = require("../utils/catchAsync");

router.get("/", catchAsync(tagController.list));

router.post("/", verifyToken, catchAsync(tagController.create));

router.get("/:slug", catchAsync(tagController.getTag));

router.delete("/:id", verifyToken, catchAsync(tagController.delete));

module.exports = router;
