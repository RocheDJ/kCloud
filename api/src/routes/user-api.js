// routes/users-api.js
/**
 * @swagger
 * tags:
 *  name: User
 *  description: User management and authorization 
 *
 */

const express = require("express");
const app = express();
const { addUser, getUserByEmail } = require("../models/db");
const bcrypt = require("bcrypt");
//const { createToken } = require( "../../node_modules/jwt-utils");
const jwt = require("jsonwebtoken");

//-------------------------------------------------------------------------------------------
//reference https://dev.to/kabartolo/how-to-document-an-express-api-with-swagger-ui-and-jsdoc-50do
//-----------------------------------Define the schemas -------------------------------------
/**
 * @swagger
 * components:
 *   schemas:
 *      UserCredentials:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: The user's email address.
 *           example: John@Doe.ie
 *         password:
 *           type: string
 *           description: The user's password.
 *           example: xxxxxxxxxxxx
 *      NewUser:
 *       allOf:
 *         - type: object
 *           properties:
 *             firstName:
 *               type: string
 *               description: The user's first name.
 *               example: John
 *             lastName:
 *               type: string
 *               description: The user's last name.
 *               example: Doe
 *             mobile:
 *               type: string
 *               description: The user's mobile number.
 *               example: +3538600000000
 *             role:
 *               type: integer
 *               description: The user's role.
 *               example: 0
 *             groupID:
 *               type: string
 *               description: Future Use.
 *               example: Unassigned
 *         - $ref: '#/components/schemas/UserCredentials'
 *      User:
 *       allOf:
 *         - type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: The user ID.
 *               example: 0
 *         - $ref: '#/components/schemas/UserCredentials'
 *
 *      securitySchemes:
 *        bearerAuth:            # arbitrary name for the security scheme
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT    # optional, arbitrary value for documentation purposes
 *
 *
 *      ValidUser:
 *       type: object
 *       properties:
 *        success:
 *           type: boolean
 *           description: true or false
 *        token:
 *           - $ref: '#/components/schemas/bearerAuth'
 *        id:
 *           type: integer
 *           description: The user ID.
 *
 *
 */
//--------------------------------------------------------------------------------------------

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *      - User
 *     summary: Retrieve a list of users.
 *     description: Retrieve a list of users.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                      $ref: '#/components/schemas/User'
 */
app.get("/", function (req, res) {
  //...
  try {
    res.send([
      {
        id: 1234,
        name: "John J Doe",
      },
      {
        id: 1234,
        name: "John J Doe",
      },
    ]);
  } catch (error) {
    res.status(500).end(error);
  }
});

//--------------------------------------------------------------------------------------------
/**
 * @swagger
 /users/{id}:
 *   get:
 *     tags:
 *      - User
 *     summary: Retrieve a single  user.
 *     description: Retrieve a single  user.
 *     parameters:
 *       - in: path
 *         name: id
 *         example: 1234
 *         required: true
 *         description: Numeric ID of the user to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single user.
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 */

app.get("/:id", function (req, res) {
  //...
  try {
    const myId = req.params.id;
    if (myId == 1234) {
      res.send({
        id: 1234,
        name: "John J Doe",
      });
    } else {
      res.send({
        id: Number(myId),
        name: "JD Test",
      });
    }
  } catch (error) {
    res.status(500).end(error);
  }
});

//--------------------------------------------------------------------------------------------
/**
 * @swagger
 * /user:
 *   post:
 *     tags:
 *      - User
 *     summary: Create a  user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/NewUser'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 */
app.post("/", async function (req, res) {
  const webReq = req;
  const data = webReq.body;
  try {
    await addUser(data).then(
      (response) => {
        const sMessage = response.Message;
        if (sMessage == "Write ok") {
          res.status(201).send(response);
        } else {
          res.send(response);
        }
      },
      (response) => {
        console.log(" Then Failure:" + response);
        res.send(response);
      }
    );
  } catch (error) {
    res.status(500).send(error);
  }
});

//--------------------------------------------------------------------------------------------
/**
 * @swagger
 * /user/authenticate:
 *   post:
 *     tags:
 *      - User
 *     summary: validate a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/UserCredentials'
 *     responses:
 *       201:
 *         description: Valid
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/ValidUser'
 */
app.post("/authenticate", async function (req, res) {
  const webReq = req;
  const UserCredentialsIn = webReq.body;
  try {
    await getUserByEmail(UserCredentialsIn.email).then(
      (response) => {
        const UserCredentials = response;
        bcrypt.compare(
          UserCredentialsIn.password,
          UserCredentials.password,
          (err, data) => {
            //if error than throw error
            if (err) throw err;

            if (data) {
              res.status(201).send({
                success: true,
                token: "this will be token",
                id: UserCredentials._id,
              });
            } else {
              res.status(401).send({
                success: false,
                token: "",
                id: 0,
              });
            }
          }
        );
      },
      (response) => {
        res.status(401).send({
          success: false,
          token: "",
          id: 0,
        });
      }
    );
  } catch (error) {
    res.status(500).send(error);
  }
});

//--------------------------------------------------------------------------------------------
/**
 * @swagger
 * /users:
 *   put:
 *     tags:
 *      - User
 *     summary: Update a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 */
app.put("/:id", function (req, res) {
  // ...
});

module.exports = app;
