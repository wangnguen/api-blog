const multer = require("multer");
const router = require("express").Router();

const userController = require("../controllers/user.controller");
const userValidation = require("../validations/user.validation");
const { verifyToken } = require("../middlewares/verifyToken");
const catchAsync = require("../utils/catchAsync");
const { storageCloud } = require("../utils/cloudinary");
const { checkRole } = require("../middlewares/auth");

const upload = multer({ storage: storageCloud });

router.get(
	"/me",
	verifyToken,
	checkRole("user", "admin"),
	catchAsync(userController.getMe),
);

router.patch(
	"/me",
	verifyToken,
	checkRole("user", "admin"),
	upload.single("avatar"),
	userValidation.updateProfile,
	catchAsync(userController.updateProfile),
);

router.patch(
	"/me/change-password",
	verifyToken,
	checkRole("user", "admin"),
	userValidation.changePassword,
	catchAsync(userController.changePassword),
);

router.get("/:username", catchAsync(userController.getAnotherUser));

module.exports = router;
