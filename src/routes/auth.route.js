const router = require("express").Router();

const catchAsync = require("../utils/catchAsync.js");

const authController = require("../controllers/auth.controller.js");
const { verifyRefreshToken } = require("../middlewares/verifyToken.js");

router.post("/register", catchAsync(authController.registerPost));

router.post("/login", catchAsync(authController.loginPost));

router.post("/logout", catchAsync(authController.logout));

router.post("/refresh", verifyRefreshToken, catchAsync(authController.refresh));

module.exports = router;
