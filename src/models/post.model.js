const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
	{
		title: { type: String, required: true, trim: true },
		slug: { type: String, index: true },
		description: { type: String, trim: true },
		content: { type: String, required: true },
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
			required: true,
		},
		tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
		likesCount: { type: Number, default: 0 },
		views: { type: Number, default: 0 },
		deleted: { type: Boolean, default: false },
	},
	{
		timestamps: true,
	},
);

postSchema.index({ category: 1 });
postSchema.index({ tags: 1 });

const Post = mongoose.model("Post", postSchema, "posts");

module.exports = Post;
