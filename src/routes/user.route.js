const router = require("express").Router();

const userController = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/verifyToken");
const catchAsync = require("../utils/catchAsync");

router.get("/me", verifyToken, catchAsync(userController.getMe));

router.patch("/me", verifyToken, catchAsync(userController.updateProfile));

router.patch(
	"/me/change-password",
	verifyToken,
	catchAsync(userController.changePassword),
);

router.get("/:username", catchAsync(userController.getAnotherUser));

module.exports = router;
