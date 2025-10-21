const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
	{
		postId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
			required: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		content: { type: String, required: true, trim: true },
		parentId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment",
			default: null,
		},
		deleted: { type: Boolean, default: false },
	},
	{
		timestamps: true,
	},
);

commentSchema.index({ postId: 1 });
commentSchema.index({ userId: 1 });

const Comment = mongoose.model("Comment", commentSchema, "comments");

module.exports = Comment;
