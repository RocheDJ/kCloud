const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "kCloud API",
    version: "1.0.24088",
    description: "RESTful API for Kilderry kCloud",
    license: {
      name: "Licensed Under MIT",
      url: "https://opensource.org/license/mit",
    },
    contact: {
      name: "David Roche",
      url: "http://djroche.ie#kcloud",
    },
  },
  servers: [
    {
      url: "http://127.0.0.1:3000",
      description: "Local  Host",
    },
    {
      url: "http://34.240.177.253:3000",
      description: "Development server",
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.js"], // Path to the API routes in your Node.js application
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
