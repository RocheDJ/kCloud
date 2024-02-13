// routes/users-api.js
const express = require("express");
const app = express();
//reference https://dev.to/kabartolo/how-to-document-an-express-api-with-swagger-ui-and-jsdoc-50do
//-----------------------------------Define the schemas -------------------------------------
/**
 * @swagger
 * components:
 *   schemas:
 *      NewUser:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The user's name.
 *           example: John Doe
 *      User:
 *       allOf:
 *         - type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: The user ID.
 *               example: 0
 *         - $ref: '#/components/schemas/NewUser'
 */
//--------------------------------------------------------------------------------------------

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users.
 *     tags:
 *       - USERS
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
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
 *     summary: Retrieve a single JSONPlaceholder user.
 *     tags:
 *       - USERS
 *     description: Retrieve a single JSONPlaceholder user. Can be used to populate a user profile when prototyping or testing an API.
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
 * /users:
 *   post:
 *     summary: Create a JSONPlaceholder user.
 *     tags:
 *       - USERS
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
app.post("/", function (req, res) {
  // ...
});

//--------------------------------------------------------------------------------------------
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user.
 *     tags:
 *       - USERS
 *     parameters:
 *       - in: path
 *         name: id
 *         example: 1234
 *         required: true
 *         description: Numeric ID of the user to delete.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/NewUser'
 *     responses:
 *       200:
 *         description: Deleted
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 */
 app.delete("/:id", function (req, res) {
  // ...
});

//--------------------------------------------------------------------------------------------
/**
 * @swagger
 * /users:
 *   put:
 *     summary: Update a user.
 *     tags:
 *       - USERS
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
