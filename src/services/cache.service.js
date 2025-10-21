const redisInstance = require("../config/redis");

const client = redisInstance.client;

// Lấy hoặc set cache (tự fetch nếu chưa có)
const getOrSetCache = async (key, ttlSeconds, fetchFunction) => {
	try {
		const cachedData = await client.get(key);
		if (cachedData) return JSON.parse(cachedData);

		const data = await fetchFunction();
		await client.setEx(key, ttlSeconds, JSON.stringify(data));
		return data;
	} catch (err) {
		console.error(`[Redis Error][getOrSetCache]:`, err.message);
		return fetchFunction(); // fallback khi cache lỗi
	}
};

// Set cache
const setCache = async (key, value, ttlSeconds) => {
	await client.setEx(key, ttlSeconds, JSON.stringify(value));
};

// Get cache
const getCache = async (key) => {
	const data = await client.get(key);
	return data ? JSON.parse(data) : null;
};

// Delete cache
const delCache = async (key) => {
	await client.del(key);
};

// Xóa theo pattern (vd: clearByPattern('view:*'))
const clearByPattern = async (pattern) => {
	const keys = await client.keys(pattern);
	if (keys.length > 0) await client.del(keys);
};

const remember = (key, ttl, fn) => getOrSetCache(key, ttl, fn);

module.exports = {
	getCache,
	setCache,
	delCache,
	getOrSetCache,
	clearByPattern,
	remember,
};
