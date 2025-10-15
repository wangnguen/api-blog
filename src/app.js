const express = require("express");

const app = express();

const errorHandler = require("./middlewares/errorHandler");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

app.use(express.json());

app.use(morgan("dev"));
app.use(cookieParser());

app.get("/", (req, res) => {
	res.send("Homepage");
});

app.use(require("./routes/index.route"));

app.use(errorHandler);

module.exports = app;
