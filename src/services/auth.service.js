const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const ErrorRespone = require("../helpers/errorRespone");
const User = require("../models/user.model");
const RefreshToken = require("../models/refreshToken.model");

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

const loginService = async ({ username, password }) => {
	// check user
	const existingUser = await User.findOne({
		username,
	}).select("+password");
	if (!existingUser) {
		throw new ErrorRespone(StatusCodes.BAD_REQUEST, "Username không tồn tại !");
	}
	// check password
	const isMatch = await existingUser.comparePassword(password.toString());
	if (!isMatch) {
		throw new ErrorRespone(
			StatusCodes.UNAUTHORIZED,
			"Mật khẩu không chính xác !",
		);
	}

	// create access token + refresh token
	const payload = {
		id: existingUser._id,
		username: existingUser.username,
	};

	const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "15m",
	});

	const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: "7d",
	});

	// save in db
	const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

	await RefreshToken.findOneAndUpdate(
		{ userId: existingUser._id },
		{ token: refreshToken, expiresAt },
		{ upsert: true, new: true }, // tạo mới nếu chưa có
	);

	return { accessToken, refreshToken };
};

const logoutService = async (token) => {
	await RefreshToken.deleteOne({ token });
	return;
};

const refreshService = ({ id, username }) => {
	const newAccessToken = jwt.sign(
		{ id, username },
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: "15m",
		},
	);
	return newAccessToken;
};

module.exports = {
	registerService,
	loginService,
	logoutService,
	refreshService,
};
