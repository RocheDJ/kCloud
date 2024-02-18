// routes/pvo-api.js
/**
 * @swagger
 * tags:
 *  name: C.D.O.
 *  description: API endpoint for Control Data Objects
 *
 */
const express = require("express");
const app = express();
const { writeCDO, readCDO, updateCDO } = require("../models/db");
//-----------------------------------Define the schemas for swagger ---------------------------
/**
 * @swagger
 * components:
 *   schemas:
 *     CDOCommand:
 *      type: object
 *      properties:
 *          InstallationID:
 *                type: string
 *                description: Destination Installation ID.
 *                example: 1001a
 *          requestDate:
 *                type: string
 *                description: UTC Date Time Stamp of Event.
 *                example: 2024-02-05 12:55:46
 *          requestType:
 *                type: integer
 *                description: command request type.
 *                example: 1
 *          Version:
 *                type: float
 *                description: Command version.
 *                example: 1.01
 *          jData:
 *                type: json
 *                description: Command data as JSON.
 *                example: {"output": "trigger", "index": 1, "value": 1}
 *          userID:
 *                type: integer
 *                description: requesting user ID.
 *                example: 1001
 *     CDO:
 *          allOf:
 *                - type: object
 *                  properties:
 *                   status:
 *                      type: integer
 *                      description: Status of the command 0 =null, 101= waiting on read,202 = read by installation, 303=ack by installation.
 *                      example: 0
 *                - $ref: '#/components/schemas/CDOCommand'
 *
 */

//---------------------------------------------------- API Calls -----------------------------
/**
 * @swagger
 * /CDO:
 *   post:
 *     tags:
 *      - C.D.O.
 *     summary: Add a Command Request to the Database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/CDOCommand'
 *     responses:
 *       200:
 *         description: CDO ADDED
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
    await writeCDO(data).then(
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
 * /CDO/{id}:
 *   get:
 *     tags:
 *      - C.D.O.
 *     summary: READ command requests for given installation ID .
 *     parameters:
 *       - in: path
 *         name: id
 *         example: 1001a
 *         required: true
 *         description: ID of the installation.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *          description: Most recent command for that installation
 *          content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/CDO'
 */
app.get("/:id", async function (req, res) {
  const webReq = req;
  const myId = req.params.id;
  const iStatus = 101; // just get un-read ones
  try {
    await readCDO(myId, iStatus).then(
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
 * /CDO/{id}/{code}:
 *   put:
 *     tags:
 *      - C.D.O.
 *     summary: Update /Ack CDO received by Installation .
 *     parameters:
 *       - in: path
 *         name: id
 *         example: 6
 *         required: true
 *         description: UID of the command.
 *         schema:
 *           type: string
 *       - in: path
 *         name: code
 *         example: 202
 *         required: true
 *         description: 202 if command received ok.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *          description: id of command and rows 
 *          content:
 *           application/json:
 *             schema:
 *                type: object
 *             example:
 *                "id":  "1001"
 *                "row": 1
 *                
 */
app.put("/:id/:code", async function (req, res) {
  const webReq = req;
  const commandId = req.params.id;
  const commandCode = req.params.code;
  let commandOK = false;
  try {
    if (commandCode == 303) {
      commandOK = true;
    }
    await updateCDO(commandId, commandOK).then(
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
