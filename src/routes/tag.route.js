const router = require("express").Router();

const tagController = require("../controllers/tag.controller");
const { checkRole } = require("../middlewares/auth");
const { verifyToken } = require("../middlewares/verifyToken");
const catchAsync = require("../utils/catchAsync");

/**
 * @swagger
 * /tags:
 *   get:
 *     summary: Lấy danh sách tất cả các tag
 *     tags: [Tags]
 *     responses:
 *       200:
 *         description: Danh sách tag được trả về thành công
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
 *                 message:
 *                   type: string
 *                   example: "Lấy danh sách tag thành công !"
 *       500:
 *         description: Lỗi server
 */
router.get("/", catchAsync(tagController.list));
const tagValidation = require("../validations/tag.validation");

/**
 * @swagger
 * /tags:
 *   post:
 *     summary: Tạo tag mới
 *     tags: [Tags]
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
 *                 example: "JavaScript"
 *     responses:
 *       201:
 *         description: Tag được tạo thành công
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
 *                 message:
 *                   type: string
 *                   example: "Tạo tag thành công !"
 *       401:
 *         description: Không có quyền truy cập
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post(
	"/",
	verifyToken,
	checkRole("user", "admin"),
	tagValidation.createTag,
	catchAsync(tagController.create),
);

/**
 * @swagger
 * /tags/{slug}:
 *   get:
 *     summary: Lấy thông tin tag theo slug
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *           example: javascript-zc3h
 *         description: Slug của tag
 *     responses:
 *       200:
 *         description: Thông tin tag được trả về thành công
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
 *                 message:
 *                   type: string
 *                   example: "Lấy thông tin tag thành công !"
 *       404:
 *         description: Không tìm thấy tag
 */
router.get("/:slug", catchAsync(tagController.getTag));

/**
 * @swagger
 * /tags/{id}:
 *   delete:
 *     summary: Xóa tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 68f49dd606efa60e17aabf59
 *         description: ID của tag
 *     responses:
 *       200:
 *         description: Xóa tag thành công
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
 *                   example: "Xóa tag thành công !"
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy tag
 */
router.delete(
	"/:id",
	verifyToken,
	checkRole("user", "admin"),
	catchAsync(tagController.delete),
);

module.exports = router;
