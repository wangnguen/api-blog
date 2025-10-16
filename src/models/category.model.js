const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		parent: {
			type: String,
		},
		slug: String,
		deleted: {
			type: Boolean,
			default: false,
		},
		description: String,
	},
	{
		timestamps: true,
	},
);

// Indexes
categorySchema.index({ slug: 1 });
categorySchema.index({ name: 1 });

const Category = mongoose.model("Category", categorySchema, "categories");

module.exports = Category;
