const Joi = require("joi");
const ErrorRespone = require("../helpers/errorRespone");
const { StatusCodes } = require("http-status-codes");

const registerPost = (req, res, next) => {
	const schema = Joi.object({
		username: Joi.string().required().min(5).max(30).messages({
			"string.empty": "Vui lòng nhập tên đăng nhập",
			"string.min": "Tên đăng nhập phải có ít nhất 5 ký tự!",
			"string.max": "Tên đăng nhập không được vượt quá 30 ký tự!",
			"any.required": "Vui lòng nhập tên đăng nhập",
		}),
		fullName: Joi.string().required().min(5).max(50).messages({
			"string.empty": "Vui lòng nhập họ tên",
			"string.min": "Họ tên phải có ít nhất 5 ký tự!",
			"string.max": "Họ tên không được vượt quá 50 ký tự!",
			"any.required": "Vui lòng nhập họ tên",
		}),
		email: Joi.string().required().email().messages({
			"string.empty": "Vui lòng nhập email",
			"any.required": "Vui lòng nhập email",
			"string.email": "Email không đúng định dạng!",
		}),
		password: Joi.string()
			.required()
			.min(6)
			.custom((value, helpers) => {
				if (!/[A-Z]/.test(value)) {
					return helpers.error("password.uppercase");
				}
				if (!/[a-z]/.test(value)) {
					return helpers.error("password.lowercase");
				}
				if (!/\d/.test(value)) {
					return helpers.error("password.digit");
				}
				if (!/[@$!%*?&]/.test(value)) {
					return helpers.error("password.special");
				}
				return value;
			})
			.messages({
				"string.empty": "Vui lòng nhập mật khẩu",
				"string.min": "Mật khẩu phải chứa ít nhất 6 ký tự!",
				"password.uppercase": "Mật khẩu phải chứa ít nhất một chữ cái in hoa!",
				"password.lowercase": "Mật khẩu phải chứa ít nhất một chữ cái thường!",
				"password.digit": "Mật khẩu phải chứa ít nhất một chữ số!",
				"password.special": "Mật khẩu phải chứa ít nhất một ký tự đặc biệt!",
			}),
	});

	const { error } = schema.validate(req.body);

	if (error) {
		const errorMessage = error.details[0].message;
		throw new ErrorRespone(StatusCodes.BAD_REQUEST, errorMessage);
	}

	next();
};

const loginPost = (req, res, next) => {
	const schema = Joi.object({
		username: Joi.string().required().messages({
			"string.empty": "Vui lòng nhập tên đăng nhập",
			"any.required": "Vui lòng nhập tên đăng nhập",
		}),
		password: Joi.string().required().min(6).messages({
			"string.empty": "Vui lòng nhập mật khẩu",
			"any.required": "Vui lòng nhập mật khẩu",
			"string.min": "Mật khẩu phải chứa ít nhất 6 ký tự!",
		}),
	});

	const { error } = schema.validate(req.body);

	if (error) {
		const errorMessage = error.details[0].message;
		throw new ErrorRespone(StatusCodes.BAD_REQUEST, errorMessage);
	}

	next();
};

module.exports = {
	registerPost,
	loginPost,
};
