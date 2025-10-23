const router = require("express").Router();

const postController = require("../controllers/post.controller");
const postValidation = require("../validations/post.validation");
const { checkRole } = require("../middlewares/auth");

const { verifyToken, optionalAuth } = require("../middlewares/verifyToken");

const catchAsync = require("../utils/catchAsync");

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Lấy tất cả bài viết (lọc theo ID của tag, category)
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: "Số trang (mặc định là 1)"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: "Số bài viết mỗi trang (mặc định là 10)"
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           example: "-createdAt"
 *         description: "Trường để sắp xếp, thêm dấu '-' để sắp xếp giảm dần (VD: '-createdAt')"
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *           example: "68f49dd606efa60e17aabf59"
 *         description: "Danh sách ID của tag (phân tách bằng dấu phẩy nếu có nhiều tag)"
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           example: "68f60e013fe0b54e9f69a432"
 *         description: "ID của danh mục (category)"
 *     responses:
 *       200:
 *         description: "Danh sách bài viết được trả về thành công"
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
 *                     posts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                           description:
 *                             type: string
 *                           views:
 *                             type: integer
 *                           likesCount:
 *                             type: integer
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           slug:
 *                             type: string
 *                           author:
 *                             type: object
 *                             properties:
 *                               fullName:
 *                                 type: string
 *                     totalPage:
 *                       type: integer
 *                       example: 1
 *                 message:
 *                   type: string
 *                   example: "Lấy danh sách bài viết thành công !"
 *       500:
 *         description: "Lỗi server"
 */
router.get("/", catchAsync(postController.getAllPosts));

/**
 * @swagger
 * /posts/top:
 *   get:
 *     summary: Lấy danh sách bài viết nổi bật
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Danh sách bài viết nổi bật
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
 *                 message:
 *                   type: string
 *                   example: "Lấy danh sách bài viết nổi bật thành công !"
 */
router.get("/top", catchAsync(postController.getTopPosts));

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Tạo bài viết mới
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               description:
 *                 type: string
 *               categoryId:
 *                 type: string
 *                 example: "68f60e013fe0b54e9f69a432"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "68f49dd606efa60e17aabf59"
 *     responses:
 *       201:
 *         description: Tạo bài viết thành công
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
 *                 message:
 *                   type: string
 *                   example: "Tạo bài viết thành công !"
 *       401:
 *         description: Không có quyền truy cập
 */
router.post(
	"/",
	verifyToken,
	checkRole("user", "admin"),
	postValidation.createPost,
	catchAsync(postController.createPost),
);

/**
 * @swagger
 * /posts/{slug}:
 *   get:
 *     summary: Lấy chi tiết bài viết theo slug
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *           example: gioi-thieu-nodejs-pm8e
 *         description: Slug của bài viết
 *     responses:
 *       200:
 *         description: Chi tiết bài viết
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
 *                 message:
 *                   type: string
 *                   example: "Lấy chi tiết bài viết thành công !"
 *       404:
 *         description: Không tìm thấy bài viết
 */
router.get("/:slug", optionalAuth, catchAsync(postController.getPostDetail));

/**
 * @swagger
 * /posts/{id}:
 *   patch:
 *     summary: Cập nhật bài viết
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 68f614a85d79f4a137ad06f6
 *         description: ID của bài viết
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *                 example: 68f60e013fe0b54e9f69a432
 *               description:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: 68f613f71872ba1aa99b5455
 *     responses:
 *       200:
 *         description: Cập nhật bài viết thành công
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
 *                 message:
 *                   type: string
 *                   example: "Cập nhật bài viết thành công!"
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy bài viết
 */
router.patch(
	"/:id",
	verifyToken,
	checkRole("user", "admin"),
	postValidation.createPost,
	catchAsync(postController.updatePost),
);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Xóa bài viết
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 68f614a85d79f4a137ad06f6
 *         description: ID của bài viết
 *     responses:
 *       200:
 *         description: Xóa bài viết thành công
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
 *                   example: "Xóa bài viết thành công !"
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy bài viết
 */
router.delete(
	"/:id",
	verifyToken,
	checkRole("user", "admin"),
	catchAsync(postController.deletePost),
);

/**
 * @swagger
 * /posts/{id}/like:
 *   post:
 *     summary: Thích/Bỏ thích bài viết
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 68f614a85d79f4a137ad06f6
 *         description: ID của bài viết
 *     responses:
 *       200:
 *         description: Toggle like thành công
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
 *                     liked:
 *                       type: boolean
 *                       example: true
 *                     likesCount:
 *                       type: integer
 *                       example: 5
 *                 message:
 *                   type: string
 *                   example: "Thích bài viết thành công !"
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy bài viết
 */
router.post(
	"/:id/like",
	verifyToken,
	checkRole("user", "admin"),
	catchAsync(postController.toggleLike),
);

/**
 * @swagger
 * /posts/{id}/likes:
 *   get:
 *     summary: Lấy danh sách người dùng đã thích bài viết
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bài viết
 *     responses:
 *       200:
 *         description: Danh sách người dùng đã thích bài viết
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
 *                       fullName:
 *                         type: string
 *                       username:
 *                         type: string
 *                       avatar:
 *                         type: string
 *                 message:
 *                   type: string
 *                   example: "Lấy danh sách thích thành công !"
 *       404:
 *         description: Không tìm thấy bài viết
 */
router.get("/:id/likes", catchAsync(postController.getLikes));

module.exports = router;
