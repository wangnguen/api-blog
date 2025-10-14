const mongoose = require("mongoose");

const {
	db: { host, port, name },
} = require("./config");

const connectString = `mongodb+srv://${host}:${port}/${name}`;

class Database {
	constructor() {
		this.connect(); 
	}

	async connect() {
		try {
			await mongoose.connect(connectString);
			console.log("DB connection successful !");
		} catch (error) {
			console.log("DB connection failed !", error);
		}
	}
	static getInstance() {
		if (!Database.instance) {
			Database.instance = new Database();
		}
		return Database.instance;
	}
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
