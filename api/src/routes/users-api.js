// routes/users.js
const express = require("express");
const app = express();
//reference https://dev.to/kabartolo/how-to-document-an-express-api-with-swagger-ui-and-jsdoc-50do


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users.
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The user ID.
 *                         example: 0
 *                       name:
 *                         type: string
 *                         description: The user's name.
 *                         example: John D Doe
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
 *      responses:
 *       200:
 *         description: A single user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The user ID.
 *                       example: 0
 *                     name:
 *                       type: string
 *                       description: The user's name.
 *                       example: John Doe
 */
 app.get("/:id", function (req, res) {
    //...
    try {
        const myId = req.params.id;
        if(myId ==1234){
            res.send(
            {
              id: 1234,
              name: "John J Doe",
            });
      } else{
        res.send(
            {
              id: Number(myId),
              name: "JD Test",
            });
      }
    } catch (error) {
      res.status(500).end(error);
    }
  });
  
  module.exports = app;








module.exports = app;
