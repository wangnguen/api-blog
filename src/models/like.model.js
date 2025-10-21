const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
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
	},
	{
		timestamps: { createdAt: true, updatedAt: false },
	},
);

// 1 user / 1 like / 1 post
likeSchema.index({ postId: 1, userId: 1 }, { unique: true });

const Like = mongoose.model("Like", likeSchema, "likes");

module.exports = Like;
