const express = require("express");

const app = express();

const errorHandler = require("./middlewares/errorHandler");

app.get("/", (req, res) => {
	res.send("Homepage");
});

app.use(errorHandler);

module.exports = app;
