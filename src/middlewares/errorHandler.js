const { sendErrorResponse } = require("../helpers/apiRespone");

// middleware/errorHandler
module.exports = (err, req, res, next) => {
	const status = err.status || 500;
	const message = err.message || "Internal Server Error";
	const code = "error";
	return sendErrorResponse(res, code, message, status);
};
