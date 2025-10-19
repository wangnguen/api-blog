const { StatusCodes } = require("http-status-codes");
const {
	createService,
	getTagService,
	getAllTags,
	deleteService,
} = require("../services/tag.service");
const { sendSuccessResponse } = require("../helpers/apiRespone");

module.exports.list = async (req, res) => {
	const tags = await getAllTags();

	return sendSuccessResponse(
		res,
		tags,
		"success",
		"Lấy danh sách tag thành công !",
		StatusCodes.OK,
	);
};

module.exports.create = async (req, res) => {
	const { name } = req.body;

	const newTag = await createService(name);

	return sendSuccessResponse(
		res,
		newTag,
		"success",
		"Tạo mới tag thành công !",
		StatusCodes.CREATED,
	);
};

module.exports.getTag = async (req, res) => {
	const { slug } = req.params;
	const existingTag = await getTagService(slug);

	return sendSuccessResponse(
		res,
		existingTag,
		"success",
		"Lấy tag thành công !",
		StatusCodes.OK,
	);
};

module.exports.delete = async (req, res) => {
	const { id } = req.params;
	await deleteService(id);

	return sendSuccessResponse(
		res,
		null,
		"success",
		"Xoá tag thành công !",
		StatusCodes.OK,
	);
};
