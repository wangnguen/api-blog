const paginate = async (model, find = {}, query = {}, limitDefault = 10) => {
	const limit =
		parseInt(query.limit) > 0 ? parseInt(query.limit) : limitDefault;
	let page = parseInt(query.page) > 0 ? parseInt(query.page) : 1;

	const totalRecord = await model.countDocuments(find);
	const totalPage = Math.max(Math.ceil(totalRecord / limit), 1);

	if (page > totalPage) page = totalPage;
	const skip = (page - 1) * limit;

	return {
		skip,
		limit,
		totalPage,
	};
};

module.exports = { paginate };
