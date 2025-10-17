const { StatusCodes } = require("http-status-codes");
const ErrorRespone = require("../helpers/errorRespone");
const User = require("../models/user.model");

const getMeService = async (userId) => {
	const existUser = await User.findOne({ _id: userId });

	if (!existUser) {
		throw new ErrorRespone(StatusCodes.BAD_REQUEST, "User không tồn tại !");
	}

	return existUser;
};

const updateProfileService = async ({ id, data }) => {
	const updatedUser = await User.findOneAndUpdate({ _id: id }, data, {
		new: true,
	});

	if (!updatedUser) {
		throw new ErrorRespone(StatusCodes.BAD_REQUEST, "User không tồn tại !");
	}

	return updatedUser;
};

const getAnotherUserService = async (username) => {
	const existUser = await User.findOne({ username }).select(
		"username fullName avatar bio",
	);

	if (!existUser) {
		throw new ErrorRespone(StatusCodes.BAD_REQUEST, "User không tồn tại !");
	}

	return existUser;
};

const changePasswordService = async (id, oldPassword, newPassword) => {
	// ktra id
	const existUser = await User.findOne({ _id: id }).select("+password");
	if (!existUser) {
		throw new ErrorRespone(StatusCodes.BAD_REQUEST, "User không tồn tại !");
	}

	// ktra mat khau
	const isMatch = await existUser.comparePassword(oldPassword);
	if (!isMatch) {
		throw new ErrorRespone(
			StatusCodes.UNAUTHORIZED,
			"Mật khẩu hiện tại không đúng !",
		);
	}

	existUser.password = newPassword;
	await existUser.save();

	return;
};

module.exports = {
	getMeService,
	updateProfileService,
	getAnotherUserService,
	changePasswordService,
};
