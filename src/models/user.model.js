const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			select: false,
		},
		fullName: {
			type: String,
		},
		avatar: {
			type: String,
		},
		bio: {
			type: String,
		},
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},
	},
	{
		timestamps: true,
	},
);

// Indexes
userSchema.index({ username: 1 });

// hash password
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, 12);
	next();
});

// compare password
userSchema.methods.comparePassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

// delete password from res.json()
userSchema.methods.toJSON = function () {
	const obj = this.toObject();
	delete obj.password;
	return obj;
};

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
