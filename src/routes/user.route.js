const multer = require("multer");
const router = require("express").Router();

const userController = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/verifyToken");
const catchAsync = require("../utils/catchAsync");
const { storageCloud } = require("../utils/cloudinary");

const upload = multer({ storage: storageCloud });

router.get("/me", verifyToken, catchAsync(userController.getMe));

router.patch(
	"/me",
	verifyToken,
	upload.single("avatar"),
	catchAsync(userController.updateProfile),
);

router.patch(
	"/me/change-password",
	verifyToken,
	catchAsync(userController.changePassword),
);

router.get("/:username", catchAsync(userController.getAnotherUser));

module.exports = router;
