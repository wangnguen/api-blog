const { StatusCodes } = require("http-status-codes");
const ErrorRespone = require("../helpers/errorRespone");
const User = require("../models/user.model");

const registerService = async ({ username, password, email, fullName }) => {
	// kiem tra username va email
	const existingUser = await User.findOne({
		$or: [{ username }, { email }],
	});

	if (existingUser) {
		throw new ErrorRespone(
			StatusCodes.CONFLICT,
			"Username hoặc email đã tồn tại !",
		);
	}

	const newUser = new User({
		username,
		password,
		email,
		fullName,
	});

	await newUser.save();

	return newUser;
};

module.exports = { registerService };
