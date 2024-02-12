const express = require('express');
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const cors = require("cors");
const user_api= require('./routes/users-api')
const app = express();
const bodyParser = require("body-parser");

// Serve Swagger documentation
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

//api routes


app.use(
    '/users',
    user_api,
    cors(),
    express.json(),
    bodyParser.urlencoded({ extended: true }));
app.listen(3000, () => {
console.log('Server is running on port 3000');
});