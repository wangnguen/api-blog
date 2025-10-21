const { StatusCodes } = require("http-status-codes");
const { sendSuccessResponse } = require("../helpers/apiRespone");
const {
	getAllCategories,
	createService,
	editService,
	deleteService,
	getCategoryBySlug,
} = require("../services/category.service");

const list = async (req, res) => {
	const categories = await getAllCategories();

	return sendSuccessResponse(
		res,
		categories,
		"success",
		"Lấy categories thành công !",
		StatusCodes.OK,
	);
};

const getBySlug = async (req, res) => {
	const { slug } = req.params;

	const category = await getCategoryBySlug(slug);

	return sendSuccessResponse(
		res,
		category,
		"success",
		"Lấy thông tin category thành công!",
		StatusCodes.OK,
	);
};

const createCategory = async (req, res) => {
	const { name, parent, description } = req.body;

	const newCategory = await createService({ name, parent, description });

	return sendSuccessResponse(
		res,
		newCategory,
		"success",
		"Tạo category thành công !",
		StatusCodes.CREATED,
	);
};

const editCategory = async (req, res) => {
	const { id } = req.params;
	const updatedCategory = await editService({ id, updateData: req.body });

	return sendSuccessResponse(
		res,
		updatedCategory,
		"success",
		"Sửa category thành công !",
		StatusCodes.OK,
	);
};

const deleteCategory = async (req, res) => {
	const { id } = req.params;

	await deleteService(id);

	return sendSuccessResponse(
		res,
		null,
		"success",
		"Xóa category thành công !",
		StatusCodes.OK,
	);
};

module.exports = {
	list,
	createCategory,
	editCategory,
	deleteCategory,
	getBySlug,
};
