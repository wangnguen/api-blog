const { StatusCodes } = require("http-status-codes");
const { sendSuccessResponse } = require("../helpers/apiRespone");
const {
	getMeService,
	updateProfileService,
	getAnotherUserService,
	changePasswordService,
} = require("../services/user.service");

const getMe = async (req, res) => {
	const userId = req.user.id;

	const user = await getMeService(userId);

	return sendSuccessResponse(
		res,
		user,
		"success",
		"Lấy thành công !",
		StatusCodes.OK,
	);
};

const updateProfile = async (req, res) => {
	const { id } = req.user;

	if (req.file) {
		req.body.avatar = req.file.path;
	} else {
		delete req.body.avatar;
	}

	const updatedUser = await updateProfileService({ id, data: req.body });

	return sendSuccessResponse(
		res,
		updatedUser,
		"success",
		"Cập nhật thành công !",
		StatusCodes.OK,
	);
};

const getAnotherUser = async (req, res) => {
	const { username } = req.params;

	const user = await getAnotherUserService(username);

	return sendSuccessResponse(
		res,
		user,
		"success",
		"Lấy thành công !",
		StatusCodes.OK,
	);
};

const changePassword = async (req, res) => {
	const { id } = req.user;
	const { oldPassword, newPassword } = req.body;

	await changePasswordService(id, oldPassword, newPassword);

	return sendSuccessResponse(
		res,
		null,
		"success",
		"Đổi mật khẩu thành công !",
		StatusCodes.OK,
	);
};

module.exports = {
	getMe,
	updateProfile,
	getAnotherUser,
	changePassword,
};
