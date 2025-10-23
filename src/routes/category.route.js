const router = require("express").Router();

const categoryController = require("../controllers/category.controller");
const categoryValidation = require("../validations/category.validation");
const { checkRole } = require("../middlewares/auth");
const { verifyToken } = require("../middlewares/verifyToken");
const catchAsync = require("../utils/catchAsync");

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Lấy danh sách tất cả danh mục
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Danh sách danh mục được trả về thành công
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
 *                       name:
 *                         type: string
 *                       slug:
 *                         type: string
 *                       description:
 *                         type: string
 *                 message:
 *                   type: string
 *                   example: "Lấy danh sách danh mục thành công !"
 *       500:
 *         description: Lỗi server
 */
router.get("/", catchAsync(categoryController.list));

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Tạo danh mục mới (Yêu cầu quyền admin)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Công nghệ"
 *               description:
 *                 type: string
 *                 example: "Chuyên mục về công nghệ"
 *     responses:
 *       201:
 *         description: Danh mục được tạo thành công
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
 *                     name:
 *                       type: string
 *                     slug:
 *                       type: string
 *                     description:
 *                       type: string
 *                 message:
 *                   type: string
 *                   example: "Tạo danh mục thành công !"
 *       401:
 *         description: Không có quyền truy cập
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post(
	"/",
	verifyToken,
	checkRole("admin"),
	categoryValidation.createCategory,
	catchAsync(categoryController.createCategory),
);

/**
 * @swagger
 * /categories/{slug}:
 *   get:
 *     summary: Lấy thông tin danh mục theo slug
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *           example: backend-development-tc4m
 *         description: Slug của danh mục
 *     responses:
 *       200:
 *         description: Thông tin danh mục được trả về thành công
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
 *                     name:
 *                       type: string
 *                     slug:
 *                       type: string
 *                     description:
 *                       type: string
 *                 message:
 *                   type: string
 *                   example: "Lấy thông tin danh mục thành công !"
 *       404:
 *         description: Không tìm thấy danh mục
 */
router.get("/:slug", catchAsync(categoryController.getBySlug));
/**
 * @swagger
 * /categories/{id}:
 *   patch:
 *     summary: Cập nhật thông tin danh mục (Yêu cầu quyền admin)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 68f60e013fe0b54e9f69a432
 *         description: ID của danh mục
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Backend Development test
 *     responses:
 *       200:
 *         description: Cập nhật thành công
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
 *                     name:
 *                       type: string
 *                     slug:
 *                       type: string
 *                     description:
 *                       type: string
 *                 message:
 *                   type: string
 *                   example: "Cập nhật danh mục thành công !"
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy danh mục
 */
router.patch(
	"/:id",
	verifyToken,
	checkRole("admin"),
	categoryValidation.createCategory,
	catchAsync(categoryController.editCategory),
);
/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Xóa danh mục (Yêu cầu quyền admin)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 68f60e013fe0b54e9f69a432
 *         description: ID của danh mục
 *     responses:
 *       200:
 *         description: Xóa danh mục thành công
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
 *                   example: "Xóa danh mục thành công !"
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy danh mục
 */
router.delete(
	"/:id",
	verifyToken,
	checkRole("admin"),
	catchAsync(categoryController.deleteCategory),
);

module.exports = router;
