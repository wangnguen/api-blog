const Joi = require("joi");
const { StatusCodes } = require("http-status-codes");
const ErrorResponse = require("../helpers/errorRespone");

module.exports.createPost = (req, res, next) => {
	const objectIdPattern = /^[0-9a-fA-F]{24}$/;

	const schema = Joi.object({
		title: Joi.string().required().messages({
			"string.empty": "Vui lòng nhập tiêu đề bài viết",
			"any.required": "Vui lòng nhập tiêu đề bài viết",
		}),

		content: Joi.string().required().messages({
			"string.empty": "Vui lòng nhập nội dung bài viết",
			"any.required": "Vui lòng nhập nội dung bài viết",
		}),

		category: Joi.string().pattern(objectIdPattern).required().messages({
			"string.empty": "Vui lòng chọn danh mục",
			"any.required": "Vui lòng chọn danh mục",
			"string.pattern.base": "categoryId không hợp lệ",
		}),

		tags: Joi.array().items(Joi.string().trim()).required().messages({
			"any.required": "Vui lòng nhập tags",
			"array.base": "tags phải là một mảng",
			"string.base": "mỗi tag phải là chuỗi hợp lệ",
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
