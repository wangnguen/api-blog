const sendSuccessResponse = (
	res,
	data = null,
	code = "success",
	message,
	status = 200,
) => {
	const response = { code, data, message };
	console.log(message, { data: data ? data : null });
	return res.status(status).json(response);
};

const sendErrorResponse = (
	res,
	code = "error",
	message = "Internal Server Error",
	status = 500,
) => {
	const response = {
		code,
		message,
	};
	console.log(message);
	return res.status(status).json(response);
};

module.exports = { sendSuccessResponse, sendErrorResponse };
