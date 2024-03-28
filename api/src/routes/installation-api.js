// routes/installation-api.js
/**
 * @swagger
 * tags:
 *  name: Installation
 *  description: API endpoint for registering  installations.
 *
 */
const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const app = express();
const {
  writeInstallation,
  readInstallation,
  readInstallationByUser,
  updateInstallation,
} = require("../models/db");
//-----------------------------------Define the schemas for swagger ---------------------------
/**
 * @swagger
 * components:
 *   schemas:
 *     InstallationData:
 *      type: object
 *      properties:
 *          InstallationID:
 *                type: integer
 *                description: Installation ID.
 *                example: 1001
 *          UserID:
 *                type: integer
 *                description: Used Id number.
 *                example: 20
 *          GroupID:
 *                type: integer
 *                description: For future Use.
 *                example: 1
 *          Description:
 *                type: string
 *                description: Site name and or Description.
 *                example: Kilderry Test Site
 *          Type:
 *                type: string
 *                description: One word Description of Installation.
 *                example: Pasteurizer
 *     NewInstallation:
 *      type: object
 *      properties:
 *          UserID:
 *                type: integer
 *                description: Used Id number.
 *                example: 20
 *          GroupID:
 *                type: integer
 *                description: For future Use.
 *                example: 1
 *          Description:
 *                type: string
 *                description: Installation name and or Description.
 *                example: Kilderry Test Site
 *
 *     UpdatedInstallation:
 *      type: object
 *      properties:
 *          id:
 *                type: integer
 *                description: Installation ID Number.
 *                example: 20001
 *
 *          Description:
 *                type: string
 *                description: Installation name and or Description.
 *                example: Kilderry Test Site
 */

//---------------------------------------------------- API Calls -----------------------------
/**
 * @swagger
 * /Installation:
 *   post:
 *     tags:
 *      - Installation
 *     summary: Add a site to the Database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/NewInstallation'
 *     responses:
 *       200:
 *         description: Installation added
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *             example:
 *                "id":  1001
 */
app.post("/", async function (req, res) {
  const webReq = req;
  const data = webReq.body;
  try {
    await writeInstallation(data).then(
      (response) => {
        res.send(response);
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

//---------------------------------------------------- API Calls -----------------------------
/**
 * @swagger
 * /Installation:
 *   put:
 *     tags:
 *      - Installation
 *     summary: Update Site Description.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/UpdatedInstallation'
 *     responses:
 *       200:
 *         description: Installation Updated
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *             example:
 *                "id":  1001
 */
app.put("/", verifyToken, async function (req, res) {
  const webReq = req;
  const data = webReq.body;
  try {
    await updateInstallation(data).then(
      (response) => {
        res.send(response);
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
//---------------------------------------------------- API Calls -----------------------------
/**
 * @swagger
 * /Installation/{id}:
 *   get:
 *     tags:
 *      - Installation
 *     summary: READ the retails for an Installation.
 *     parameters:
 *       - in: path
 *         name: id
 *         example: 1001
 *         required: true
 *         description: ID of the installation.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *          description: Data Fro that instialtion
 *          content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/InstallationData'
 */
app.get("/:id", async function (req, res) {
  const webReq = req;
  const myId = req.params.id;
  try {
    await readInstallation(myId).then(
      (response) => {
        res.send(response);
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

//---------------------------------------------------- API Calls -----------------------------
/**
 * @swagger
 * /Installation/user/{id}:
 *   get:
 *     tags:
 *      - Installation
 *     summary: READ the details of all installations for given user.
 *     parameters:
 *       - in: path
 *         name: id
 *         example: 1001
 *         required: true
 *         description: ID of the User.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *          description: Most recent command for that installation
 *          content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/InstallationData'
 */
app.get("/user/:id", async function (req, res) {
  const webReq = req;
  const myId = req.params.id;
  try {
    await readInstallationByUser(myId).then(
      (response) => {
        res.send(response);
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

module.exports = app;
