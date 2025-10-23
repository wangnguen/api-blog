const router = require("express").Router();

const catchAsync = require("../utils/catchAsync.js");

const authController = require("../controllers/auth.controller.js");
const authValidation = require("../validations/auth.validation.js");

const {
	verifyRefreshToken,
	verifyToken,
} = require("../middlewares/verifyToken.js");
const { checkRole } = require("../middlewares/auth.js");

/**
 * @swagger
 * /auth/register:
 *  post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - username
 *               - password
 *               - email
 *             properties:
 *               fullName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: "Nguyen Van A"
 *               username:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 30
 *                 example: "nguyenvana"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 format: password
 *                 example: "Abc123!@#"
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     fullName:
 *                       type: string
 *                     username:
 *                       type: string
 *                 message:
 *                  type: string
 *                  example: "Đăng ký thành công !"
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       409:
 *         description: Email hoặc username đã tồn tại
 */
router.post(
	"/register",
	authValidation.registerPost,
	catchAsync(authController.registerPost),
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Đăng nhập
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "nguyenvana"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 format: password
 *                 example: "Abc123!@#"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                  type: string
 *                  enum: [success]
 *                  example: "success"
 *                 data:
 *                  type: object
 *                  properties:
 *                   accessToken:
 *                     type: string
 *                 message:
 *                  type: string
 *                  example: "Đăng nhập thành công !"
 *       401:
 *         description: Email hoặc mật khẩu không đúng
 */
router.post(
	"/login",
	authValidation.loginPost,
	catchAsync(authController.loginPost),
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Đăng xuất
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 *       401:
 *         description: Không có quyền truy cập
 */
router.post(
	"/logout",
	verifyToken,
	checkRole("user", "admin"),
	catchAsync(authController.logout),
);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Làm mới access token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token mới được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                  type: string
 *                  enum: [success]
 *                  example: "success"
 *                 data:
 *                  type: object
 *                  properties:
 *                    accessToken:
 *                     type: string
 *                 message:
 *                  type: string
 *                  example: Làm mới token thành công !
 *       401:
 *         description: Refresh token không hợp lệ hoặc đã hết hạn
 */
router.post(
	"/refresh",
	verifyRefreshToken,
	checkRole("user", "admin"),
	catchAsync(authController.refresh),
);

module.exports = router;
