const { StatusCodes } = require("http-status-codes");
const ErrorRespone = require("../helpers/errorRespone");

const checkRole = (...roles) => {
	return (req, res, next) => {
		const userRole = req.user.role;
		if (!roles.includes(userRole)) {
			throw new ErrorRespone(
				StatusCodes.FORBIDDEN,
				"Quyền truy cập bị từ chối !",
			);
		}
		next();
	};
};

module.exports = { checkRole };
