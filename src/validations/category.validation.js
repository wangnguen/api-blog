const Joi = require("joi");
const ErrorResponse = require("../helpers/errorRespone");
const { StatusCodes } = require("http-status-codes");

const createCategory = (req, res, next) => {
	const objectIdPattern = /^[0-9a-fA-F]{24}$/;

	const schema = Joi.object({
		name: Joi.string().required().messages({
			"string.empty": "Vui lòng nhập tên danh mục",
			"any.required": "Vui lòng nhập tên danh mục",
		}),
		parent: Joi.string().pattern(objectIdPattern).optional().messages({
			"string.pattern.base": "parent không hợp lệ",
		}),
		description: Joi.string().allow(""),
	});

	const { error } = schema.validate(req.body);

	if (error) {
		const errorMessage = error.details[0].message;
		throw new ErrorResponse(StatusCodes.BAD_REQUEST, errorMessage);
	}

	next();
};

module.exports = {
	createCategory,
};
