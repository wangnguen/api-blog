const { createClient } = require("redis");

const {
	redis: { username, password, host, port },
} = require("./config");

const urlString = `redis://${username}:${password}@${host}:${port}`;

class RedisDatabase {
	constructor() {
		this.connect();
	}

	async connect() {
		if (this.client) return this.client;

		this.client = createClient({
			url: urlString,
			socket: {
				reconnectStrategy: (retries) => {
					if (retries > 10) {
						console.error("Redis: quá số lần thử kết nối, dừng lại");
						return new Error("Redis reconnect failed");
					}
					return Math.min(retries * 100, 3000);
				},
			},
		});

		this.client.on("connect", () => console.log("Redis: đang kết nối..."));
		this.client.on("ready", () => console.log("Redis: kết nối thành công!"));
		this.client.on("end", () => console.log("Redis: ngắt kết nối."));
		this.client.on("reconnecting", () =>
			console.log("Redis: đang thử kết nối lại..."),
		);
		this.client.on("error", (err) =>
			console.error("Redis Error:", err.message),
		);

		try {
			await this.client.connect();
			return this.client;
		} catch (err) {
			console.error("Redis: kết nối thất bại:", err);
		}
	}

	static getInstance() {
		if (!RedisDatabase.instance) {
			RedisDatabase.instance = new RedisDatabase();
		}
		return RedisDatabase.instance;
	}
}

const redisInstance = RedisDatabase.getInstance();

module.exports = redisInstance;
