const router = require("express").Router();

const catchAsync = require("../utils/catchAsync.js");

const authController = require("../controllers/auth.controller.js");

router.post("/register", catchAsync(authController.registerPost));

router.post("/login", catchAsync(authController.loginPost));

module.exports = router;
