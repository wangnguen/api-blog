const { StatusCodes } = require("http-status-codes");

const { sendSuccessResponse } = require("../helpers/apiRespone");
const { registerService } = require("../services/auth.service");

const registerPost = async (req, res) => {
	const { username, password, email, fullName } = req.body;
	const newUser = await registerService({
		username,
		password,
		email,
		fullName,
	});

	sendSuccessResponse(
		res,
		newUser,
		"success",
		"Đăng ký thành công !",
		StatusCodes.CREATED,
	);
};

module.exports = {
	registerPost,
};
