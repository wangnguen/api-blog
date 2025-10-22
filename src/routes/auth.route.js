const router = require("express").Router();

const catchAsync = require("../utils/catchAsync.js");

const authController = require("../controllers/auth.controller.js");
const {
	verifyRefreshToken,
	verifyToken,
} = require("../middlewares/verifyToken.js");
const { checkRole } = require("../middlewares/auth.js");

router.post("/register", catchAsync(authController.registerPost));

router.post("/login", catchAsync(authController.loginPost));

router.post(
	"/logout",
	verifyToken,
	checkRole("user", "admin"),
	catchAsync(authController.logout),
);

router.post(
	"/refresh",
	verifyRefreshToken,
	checkRole("user", "admin"),
	catchAsync(authController.refresh),
);

module.exports = router;
