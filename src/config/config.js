const dev = {
	app: {
		port: process.env.DEV_APP_PORT || 8080,
	},
	db: {
		host: process.env.DEV_DB_HOST || "localhost",
		port: process.env.DEV_DB_PORT || 27017,
		name: process.env.DEV_DB_NAME || "nodeblog",
	},
	redis: {
		username: process.env.DEV_REDIS_USERNAME || "default",
		password: process.env.DEV_REDIS_PASSWORD || "",
		host: process.env.DEV_REDIS_HOST || "localhost",
		port: process.env.DEV_REDIS_PORT || 6379,
	},
};

const pro = {
	app: {
		port: process.env.PRO_APP_PORT || 3052,
	},
	db: {
		host: process.env.PRO_DB_HOST || "localhost",
		port: process.env.PRO_DB_PORT || 27017,
		name: process.env.PRO_D_NAME || "nodeblog",
	},
};

const config = { dev, pro };
const env = process.NODE_ENV || "dev";

module.exports = config[env];
