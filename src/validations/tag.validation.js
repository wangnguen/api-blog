const Joi = require("joi");
const { StatusCodes } = require("http-status-codes");
const ErrorResponse = require("../helpers/errorRespone");

module.exports.createTag = (req, res, next) => {
	const schema = Joi.object({
		name: Joi.string().required().messages({
			"string.empty": "Vui lòng nhập tên tag",
			"any.required": "Vui lòng nhập tên tag",
		}),
	});

	const { error } = schema.validate(req.body);

	if (error) {
		const errorMessage = error.details[0].message;
		throw new ErrorResponse(StatusCodes.BAD_REQUEST, errorMessage);
	}

	next();
};
