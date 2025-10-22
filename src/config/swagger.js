const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Mini Blog API",
			description:
				"API endpoints for a mini blog services documented on swagger",
			version: "1.0.0",
		},
		servers: [
			{
				url: "http://localhost:8080/",
				description: "Local server",
			},
			{
				url: "<your live url here>",
				description: "Live server",
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
					name: "Authorization",
					in: "header",
					description:
						"Enter your bearer token in the format **Bearer &lt;token&gt;**",
				},

			},
		},
		security: {
			bearerAuth: [],
		},
	},
	// looks for configuration in specified directories
	apis: [path.join("./src/routes/*.js")],
};
const swaggerSpec = swaggerJsdoc(options);
function swaggerDocs(app, port) {
	// Swagger Page
	app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
	// Documentation in JSON format
	app.get("/docs.json", (req, res) => {
		res.setHeader("Content-Type", "application/json");
		res.send(swaggerSpec);
	});
}
module.exports = swaggerDocs;
