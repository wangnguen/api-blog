require("dotenv").config();

const app = require("./src/app");
const {
	app: { port },
} = require("./src/config/config");

require("./src/config/database");

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
