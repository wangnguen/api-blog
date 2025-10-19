const { StatusCodes } = require("http-status-codes");
const ErrorRespone = require("../helpers/errorRespone");
const Tag = require("../models/tag.model");
const { generateSlug } = require("../utils/generate");

module.exports.getAllTags = async () => {
	const tags = await Tag.find({
		deleted: false,
	});

	return tags;
};

module.exports.createService = async (name) => {
	const existingTag = await Tag.findOne({
		name,
		deleted: false,
	});

	if (existingTag) {
		throw new ErrorRespone(StatusCodes.CONFLICT, "Tag đã tồn tại !");
	}
	const slug = generateSlug(name);
	const newTag = new Tag({
		name,
		slug,
	});

	await newTag.save();

	return newTag;
};

module.exports.getTagService = async (slug) => {
	const existingTag = await Tag.findOne({
		slug,
		deleted: false,
	});

	if (!existingTag) {
		throw new ErrorRespone(StatusCodes.BAD_REQUEST, "Tag không tồn tại !");
	}

	return existingTag;
};

module.exports.deleteService = async (id) => {
	const existingTag = await Tag.findOne({
		_id: id,
		deleted: false,
	});

	if (!existingTag) {
		throw new ErrorRespone(StatusCodes.BAD_REQUEST, "Tag không tồn tại");
	}

	existingTag.deleted = true;

	existingTag.save();

	return;
};
