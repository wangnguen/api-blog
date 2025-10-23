const multer = require("multer");
const router = require("express").Router();

const userController = require("../controllers/user.controller");
const userValidation = require("../validations/user.validation");
const { verifyToken } = require("../middlewares/verifyToken");
const catchAsync = require("../utils/catchAsync");
const { storageCloud } = require("../utils/cloudinary");
const { checkRole } = require("../middlewares/auth");

const upload = multer({ storage: storageCloud });

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Lấy thông tin người dùng hiện tại
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin người dùng được trả về thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   enum: [success]
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
 *                     avatar:
 *                       type: string
 *                     role:
 *                       type: string
 *                 message:
 *                   type: string
 *                   example: "Lấy thông tin người dùng thành công !"
 *       401:
 *         description: Không có quyền truy cập
 */
router.get(
	"/me",
	verifyToken,
	checkRole("user", "admin"),
	catchAsync(userController.getMe),
);

/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: Cập nhật thông tin cá nhân
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "Nguyễn Văn A"
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Cập nhật thông tin thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   enum: [success]
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     fullName:
 *                       type: string
 *                     avatar:
 *                       type: string
 *                 message:
 *                   type: string
 *                   example: "Cập nhật thông tin thành công !"
 *       401:
 *         description: Không có quyền truy cập
 */
router.patch(
	"/me",
	verifyToken,
	checkRole("user", "admin"),
	upload.single("avatar"),
	userValidation.updateProfile,
	catchAsync(userController.updateProfile),
);

/**
 * @swagger
 * /users/me/change-password:
 *   patch:
 *     summary: Đổi mật khẩu
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 format: password
 *                 example: "oldPassword123"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: "newPassword456"
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   enum: [success]
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Đổi mật khẩu thành công !"
 *       401:
 *         description: Mật khẩu hiện tại không đúng
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.patch(
	"/me/change-password",
	verifyToken,
	checkRole("user", "admin"),
	userValidation.changePassword,
	catchAsync(userController.changePassword),
);

/**
 * @swagger
 * /users/{username}:
 *   get:
 *     summary: Lấy thông tin người dùng khác theo username
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username của người dùng
 *         example: "levana"
 *     responses:
 *       200:
 *         description: Thông tin người dùng được trả về thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   enum: [success]
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     fullName:
 *                       type: string
 *                     username:
 *                       type: string
 *                     avatar:
 *                       type: string
 *                 message:
 *                   type: string
 *                   example: "Lấy thông tin người dùng thành công !"
 *       404:
 *         description: Không tìm thấy người dùng
 */
router.get("/:username", catchAsync(userController.getAnotherUser));

module.exports = router;
