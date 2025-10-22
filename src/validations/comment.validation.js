const Joi = require("joi");
const { StatusCodes } = require("http-status-codes");
const ErrorResponse = require("../helpers/errorRespone");

module.exports.createComment = (req, res, next) => {
	const objectIdPattern = /^[0-9a-fA-F]{24}$/;

	const schema = Joi.object({
		content: Joi.string().trim().required().messages({
			"string.empty": "Vui lòng nhập nội dung bình luận",
			"any.required": "Vui lòng nhập nội dung bình luận",
		}),
		parentId: Joi.string().pattern(objectIdPattern).optional().messages({
			"string.pattern.base": "parentId không hợp lệ",
		}),
	});

	const { error } = schema.validate(req.body);

	if (error) {
		const errorMessage = error.details[0].message;
		throw new ErrorResponse(StatusCodes.BAD_REQUEST, errorMessage);
	}

	next();
};
