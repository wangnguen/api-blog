// middleware/auth.middleware.js
const jwt = require("jsonwebtoken");
const { sendErrorResponse } = require("../helpers/apiRespone");
const { StatusCodes } = require("http-status-codes");

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
		return sendErrorResponse(
			res,
			"error",
			"Token hết hạn hoặc không hợp lệ !",
			StatusCodes.UNAUTHORIZED,
		);
	}
};

const verifyRefreshToken = (req, res, next) => {
	try {
		const token = req.cookies?.refreshToken;
		if (!token) {
			return sendErrorResponse(
				res,
				"error",
				"Không tìm thấy refresh token",
				StatusCodes.UNAUTHORIZED,
			);
		}

		const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
		req.user = decoded;
		next();
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			res.clearCookie("refreshToken", {
				httpOnly: true,
				secure: true,
				sameSite: "strict",
			});
			return sendErrorResponse(
				res,
				"error",
				"Refresh token đã hết hạn. Vui lòng đăng nhập lại.",
				StatusCodes.UNAUTHORIZED,
			);
		}

		return sendErrorResponse(
			res,
			"error",
			"Refresh token không hợp lệ.",
			StatusCodes.UNAUTHORIZED,
		);
	}
};

module.exports = { verifyToken, verifyRefreshToken };
