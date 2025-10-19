const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema(
	{
		token: {
			type: String,
			required: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		expiresAt: {
			type: Date,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

// tu dong xoa khi het han

refreshTokenSchema.index(
	{ expiresAt: 1 },
	{
		expireAfterSeconds: 0,
	},
);

const RefreshToken = mongoose.model(
	"RefreshToken",
	refreshTokenSchema,
	"refreshTokens",
);

module.exports = RefreshToken;
