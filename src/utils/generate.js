const slugify = require("slugify");

const generateString = (length = 6) => {
	const characters = "abcdefghijklmnopqrstuvwxyz1234567890";
	let result = "";
	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		result += characters[randomIndex];
	}
	return result;
};

const generateSlug = (name) => {
	const newSlug = `${slugify(name, {
		lower: true,
		strict: true,
		locale: "vi",
	})}-${generateString(4)}`;
	return newSlug;
};

module.exports = {
	generateSlug,
	generateString,
};
