const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		slug: {
			type: String,
			required: true,
		},
		postCount: {
			type: Number,
			default: 0,
		},
		deleted: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	},
);

const Tag = mongoose.model("tag", tagSchema, "tags");

module.exports = Tag;
