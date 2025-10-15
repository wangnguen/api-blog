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

module.exports = { verifyToken };
