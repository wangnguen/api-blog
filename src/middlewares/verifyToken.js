// middleware/auth.middleware.js
const jwt = require("jsonwebtoken");
const { sendErrorResponse } = require("../helpers/apiRespone");
const { StatusCodes } = require("http-status-codes");
const RefreshToken = require("../models/refreshToken.model");

const verifyToken = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader)
		return sendErrorResponse(
			res,
			"error",
			"Token không hợp lệ !",
			StatusCodes.UNAUTHORIZED,
		);

	const parts = authHeader.split(" ");
	if (parts.length !== 2 || parts[0] !== "Bearer")
		return sendErrorResponse(
			res,
			"error",
			"Token không hơp lệ !",
			StatusCodes.UNAUTHORIZED,
		);

	const token = parts[1];
	try {
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		req.user = decoded;
		next();
	} catch (err) {
		return sendErrorResponse(res, "error");
	}
};

const verifyRefreshToken = async (req, res, next) => {
	try {
		const token = req.cookies?.refreshToken;
		if (!token) {
			return sendErrorResponse(
				res,
				"error",
				"Token không hợp lệ !",
				StatusCodes.UNAUTHORIZED,
			);
		}

		// so sanh voi trong db
		const isMatchToken = await RefreshToken.findOne({
			token,
		});

		if (!isMatchToken) {
			return sendErrorResponse(
				res,
				"error",
				"Token không hợp lệ  hoặc đã hết hạn !",
				StatusCodes.FORBIDDEN,
			);
		}

		// kiem tra het han
		if (isMatchToken.expiresAt < new Date()) {
			return sendErrorResponse(
				res,
				"error",
				"Token đã hết hạn !",
				StatusCodes.FORBIDDEN,
			);
		}

		const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
		req.user = decoded;
		next();
	} catch (error) {
		res.clearCookie("refreshToken", {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
		});
		return sendErrorResponse(res, "error");
	}
};

module.exports = { verifyToken, verifyRefreshToken };
