const slugify = require("slugify");
const Category = require("../models/category.model");
const ErrorRespone = require("../helpers/errorRespone");
const { StatusCodes } = require("http-status-codes");
const { generateSlug } = require("../utils/generate");

const getAllCategories = async () => {
	const categories = await Category.find({
		deleted: false,
	}).lean();
	return categories;
};

const createService = async ({ name, parent, description }) => {
	const existCategory = await Category.findOne({
		name,
	});

	if (existCategory) {
		throw new ErrorRespone(StatusCodes.CONFLICT, "Category đã tồn tại !");
	}

	const slug = generateSlug(name);

	const newCategory = new Category({
		name,
		slug,
		parent,
		description,
	});

	await newCategory.save();

	return newCategory;
};

const editService = async ({ id, updateData }) => {
	const existCategory = await Category.findOne({ _id: id, deleted: false });

	if (!existCategory) {
		throw new ErrorRespone(StatusCodes.NOT_FOUND, "Category không tồn tại");
	}

	if (updateData.name) {
		updateData.slug = generateSlug(updateData.name);
	}

	const updatedCategory = await Category.findOneAndUpdate(
		{ _id: id, deleted: false },
		updateData,
		{
			new: true,
		},
	);

	return updatedCategory;
};

const deleteService = async (id) => {
	const existCategory = await Category.findOne({
		_id: id,
		deleted: false,
	});

	if (!existCategory) {
		throw new ErrorRespone(StatusCodes.BAD_REQUEST, "Category không tồn tại");
	}

	existCategory.deleted = true;

	existCategory.save();

	await Category.updateMany({ parent: id }, { $set: { parent: "" } });

	return;
};

const getCategoryBySlug = async (slug) => {
	const existCategory = await Category.findOne({ slug, deleted: false }).lean();

	if (!existCategory) {
		throw new ErrorRespone(StatusCodes.BAD_REQUEST, "Category không tồn tại");
	}

	return existCategory;
};

module.exports = {
	getAllCategories,
	createService,
	editService,
	deleteService,
	getCategoryBySlug,
};
