const router = require("express").Router();

const commentController = require("../controllers/comment.controller");
const commentValidation = require("../validations/comment.validation");
const { checkRole } = require("../middlewares/auth");
const { verifyToken } = require("../middlewares/verifyToken");
const catchAsync = require("../utils/catchAsync");

/**
 * @swagger
 * /posts/{postId}/comments:
 *   get:
 *     summary: Lấy danh sách bình luận của một bài viết
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *           example: 68f614a85d79f4a137ad06f6
 *         description: ID của bài viết
 *     responses:
 *       200:
 *         description: Danh sách bình luận được trả về thành công
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       content:
 *                         type: string
 *                       author:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           fullName:
 *                             type: string
 *                           username:
 *                             type: string
 *                           avatar:
 *                             type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 message:
 *                   type: string
 *                   example: "Lấy danh sách bình luận thành công !"
 *       404:
 *         description: Không tìm thấy bài viết
 */
router.get(
	"/posts/:postId/comments",
	catchAsync(commentController.getCommentsByPost),
);

/**
 * @swagger
 * /posts/{postId}/comments:
 *   post:
 *     summary: Tạo bình luận mới cho bài viết
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *           example: 68f614a85d79f4a137ad06f6
 *         description: ID của bài viết
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Bài viết rất hay!"
 *     responses:
 *       201:
 *         description: Bình luận được tạo thành công
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
 *                     content:
 *                       type: string
 *                     author:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         fullName:
 *                           type: string
 *                         username:
 *                           type: string
 *                         avatar:
 *                           type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                 message:
 *                   type: string
 *                   example: "Tạo comment thành công !"
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy bài viết
 */
router.post(
	"/posts/:postId/comments",
	verifyToken,
	checkRole("user", "admin"),
	commentValidation.createComment,
	catchAsync(commentController.createComment),
);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Xóa bình luận
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 68fa62e7c37216979e8ca72a
 *         description: ID của bình luận
 *     responses:
 *       200:
 *         description: Xóa bình luận thành công
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
 *                   nullable: true
 *                 message:
 *                   type: string
 *                   example: "Xóa bình luận thành công !"
 *       401:
 *         description: Không có quyền truy cập hoặc không phải người tạo bình luận
 *       404:
 *         description: Không tìm thấy bình luận
 */
router.delete(
	"/comments/:id",
	verifyToken,
	checkRole("user", "admin"),
	catchAsync(commentController.deleteComment),
);

module.exports = router;
