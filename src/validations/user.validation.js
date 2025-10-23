const Joi = require("joi");
const ErrorRespone = require("../helpers/errorRespone");
const { StatusCodes } = require("http-status-codes");

const changePassword = (req, res, next) => {
	const schema = Joi.object({
		oldPassword: Joi.string().trim().min(6).required().messages({
			"string.empty": "Vui lòng nhập mật khẩu cũ",
			"string.min": "Mật khẩu cũ phải chứa ít nhất 6 ký tự",
			"any.required": "Vui lòng nhập mật khẩu cũ",
		}),
		newPassword: Joi.string()
			.trim()
			.min(6)
			.pattern(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
			)
			.required()
			.messages({
				"string.empty": "Vui lòng nhập mật khẩu mới",
				"string.min": "Mật khẩu mới phải chứa ít nhất 6 ký tự",
				"string.pattern.base":
					"Mật khẩu mới phải chứa ít nhất một chữ cái thường, một chữ cái in hoa, một chữ số và một ký tự đặc biệt (@$!%*?&)",
				"any.required": "Vui lòng nhập mật khẩu mới",
			}),
	});

	const { error } = schema.validate(req.body);

	if (error) {
		const errorMessage = error.details[0].message;
		throw new ErrorRespone(StatusCodes.BAD_REQUEST, errorMessage);
	}

	next();
};

const updateProfile = (req, res, next) => {
	const schema = Joi.object({
		fullName: Joi.string().min(5).max(50).optional().messages({
			"string.min": "Họ tên phải có ít nhất 5 ký tự!",
			"string.max": "Họ tên không được vượt quá 50 ký tự!",
			"string.empty": "Vui lòng nhập họ tên",
		}),
		email: Joi.string().allow("").email().optional().messages({
			"string.email": "Email không đúng định dạng!",
		}),
		bio: Joi.string().allow(""),
		avatar: Joi.string().allow(""),
	});

	const { error } = schema.validate(req.body);

	if (error) {
		const errorMessage = error.details[0].message;
		throw new ErrorRespone(StatusCodes.BAD_REQUEST, errorMessage);
	}

	next();
};

module.exports = {
	changePassword,
	updateProfile,
};
