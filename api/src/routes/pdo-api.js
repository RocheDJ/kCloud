// routes/pvo-api.js
/**
 * @swagger
 * tags:
 *  name: P.D.O.
 *  description: API endpoint for Process Data Objects
 *
 */
const express = require("express");
const app = express();
const {writePDOData} = require('../models/db')
//-----------------------------------Define the schemas for swagger ---------------------------
/**
 * @swagger
 * components:
 *   schemas:
 *     PDO:
 *      type: object
 *      properties:
 *          InstallationID:
 *                type: string
 *                description: The source id.
 *                example: Swagger1001
 *          EventDate:
 *                 type: string
 *                 description: UTC Date Time Stamp of Event.
 *                 example: 2024-02-05 12:55:46
 *          StructureID:
 *                 type: integer
 *                 description: Report Type alarm batch start,batch stop.
 *                 example: 1    
 *          Version:
 *                 type: float
 *                 description: Report version.
 *                 example: 1.01
 *         
 *          jData:
 *                 type: json
 *                 description: Report data as JSON.
 *                 example: {"Batch_Start": "2024-02-08 18:13:14.960776", "Hold_Start": "2024-02-08 18:13:03.201827", "Batch_Stop": "2024-02-08 18:13:03.201827", "Temperature": "23.6", "Stop_Volume": "1000", "Batch_Duration": "72", "Batch_Code": "1"}
 *
 *     SQLReturn:
 *      type: object
 *      properties:
 *          LastUpdate:
 *                type: object
 *                description: SQL return Info.
 *                properties:
 *                  fieldCount:
 *                      type: integer
 *                  affectedRows:
 *                      type: integer
 *                  insertId:
 *                      type: integer
 *                      description: ID of the inserted data.
 *                  info:
 *                      type: string
 *                  serverStatus:
 *                      type: integer
 *                  warningStatus:
 *                      type: integer
 *                  changedRows:
 *                      type: integer
 *          Message:
 *                 type: string
 *                 description: Response String.
 *                 example: Write OK
 */           
//--------------------------------------------------------------------------------------------

//---------------------------------------------------- API Calls -----------------------------
/**
 * @swagger
 * /PDO:
 *   post:
 *     tags:
 *      - P.D.O.
 *     summary: Add a Process Report to the Database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/PDO'
 *     responses:
 *       200:
 *          description: PDO ADDED
 *          content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SQLReturn'
 */
app.post("/", async function (req, res){
    const webReq = req;
    const data = webReq.body;
    try {
        await writePDOData(data.InstallationID,data.EventDate,data.StructureID,data.Version,data.jData).then(
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