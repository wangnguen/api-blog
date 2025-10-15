const express = require("express");

const app = express();

const errorHandler = require("./middlewares/errorHandler");
const morgan = require("morgan");

app.use(express.json());

app.use(morgan("dev"));

app.get("/", (req, res) => {
	res.send("Homepage");
});

app.use(require("./routes/index.route"));

app.use(errorHandler);

module.exports = app;
