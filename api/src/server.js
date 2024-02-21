// kCloud Node Js Express API server

// -----------------------           Include Files           -----------------------------
const express = require("express");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const user_api = require("./routes/user-api");
const pvo_api = require("./routes/pvo-api");
const pdo_api = require("./routes/pdo-api");
const cdo_api = require("./routes/cdo-api");
const installation_api = require("./routes/installation-api");
const bodyParser = require("body-parser");

// error handling general
process.on("uncaughtException", (error) =>
  console.error("Uncaught exception: ", error)
); //
process.on("unhandledRejection", (error) =>
  console.error("Unhandled rejection: ", error)
); //

// -----------------------Function to Initialize the Server -----------------------------
async function init() {
  const api_Server = express();

  // add parsing the body requests here or the body will be empty
  api_Server.use(bodyParser.urlencoded());
  api_Server.use(bodyParser.json());

  // Serve Swagger documentation
  api_Server.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

  //api routes
  api_Server.use("/user", user_api);
  api_Server.use("/pvo", pvo_api);
  api_Server.use("/pdo", pdo_api);
  api_Server.use("/cdo", cdo_api);
  api_Server.use("/installation", installation_api);

  api_Server.use(cors());
  // start the server
  api_Server.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
}

// ----------------------- Call the server function --------------------------------------
init();
