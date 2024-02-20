const express = require('express');
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const cors = require("cors");
const user_api= require('./routes/user-api');
const pvo_api= require('./routes/pvo-api');
const pdo_api= require('./routes/pdo-api');
const cdo_api= require('./routes/cdo-api');
const installation_api= require('./routes/installation-api');
const app = express();
const bodyParser = require("body-parser");

// add parsing the body requests here or the body will be empty
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());


// Serve Swagger documentation
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

//api routes
app.use('/user',user_api);
app.use('/pvo',pvo_api);
app.use('/pdo',pdo_api);
app.use('/cdo',cdo_api);
app.use('/installation',installation_api);

app.use(
    cors()
    );

// error handling general
process.on('uncaughtException', error => console.error('Uncaught exception: ', error));//
process.on('unhandledRejection', error => console.error('Unhandled rejection: ', error));//
// start the server
app.listen(3000, () => {
console.log('Server is running on port 3000');
});