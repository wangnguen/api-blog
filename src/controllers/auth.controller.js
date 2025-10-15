const { StatusCodes } = require("http-status-codes");

const { sendSuccessResponse } = require("../helpers/apiRespone");
const { registerService, loginService } = require("../services/auth.service");

const registerPost = async (req, res) => {
	const { username, password, email, fullName } = req.body;
	const newUser = await registerService({
		username,
		password,
		email,
		fullName,
	});

	return sendSuccessResponse(
		res,
		newUser,
		"success",
		"Đăng ký thành công !",
		StatusCodes.CREATED,
	);
};

const loginPost = async (req, res) => {
	const { username, password } = req.body;
	await loginService({ username, password });
	const { accessToken, refreshToken } = await loginService({
		username,
		password,
	});

	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});

	return sendSuccessResponse(
		res,
		{ accessToken },
		"success",
		"Đăng nhập thành công !",
		StatusCodes.OK,
	);
};

module.exports = {
	registerPost,
	loginPost,
};
