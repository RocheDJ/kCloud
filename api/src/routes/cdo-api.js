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
const {writeCDOData} = require('../models/db')
//-----------------------------------Define the schemas for swagger ---------------------------
/** 
 * @swagger
 * components:
 *   schemas:
 *     CDO:
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
 *              $ref: '#/components/schemas/CDO'
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
app.post("/", async function (req, res){
    const webReq = req;
    const data = webReq.body;
    try {
        await writeCDOData(data.jData).then(
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
 *         example: 1234
 *         required: true
 *         description: Numeric ID of the installation.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *          description: Most recent command for that installation
 *          content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/CDO'  
*/
 app.get("/", async function (req, res){
    const webReq = req;
    const data = webReq.body;
    try {
        await writeCDOData(data.jData).then(
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