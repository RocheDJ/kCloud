// routes/pvo-api.js
const express = require("express");
const app = express();
const {writePVOData} = require('./models/db')
//-----------------------------------Define the schemas for swagger ---------------------------
/**
 * @swagger
 * components:
 *   schemas:
 *     PVO:
 *      type: object
 *      properties:
 *          InstallationID:
 *                type: string
 *                description: The source id.
 *                example: Swagger1001
 *          NodeID:
 *                 type: integer
 *                 description: IO link Node number.
 *                 example: 106    
 *          PortID:
 *                 type: integer
 *                 description: IO link Port number.
 *                 example: 1
 *          EventDate:
 *                 type: string
 *                 description: IO link Port number.
 *                 example: 2024-02-05 12:55:46
 *          jData:
 *                 type: json
 *                 description: Process Variable Object Data.
 *                 example: {"title": "Temperature", "unit": "C", "valueType": 5, "value": 22.4}
 *          error:
 *                 type: string
 *                 description: Error Description.
 *                 example: No errors
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
 * /pvo:
 *   post:
 *     summary: Add a Process Variable to the Database.
 *     tags:
 *       - PVO
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/PVO'
 *     responses:
 *       200:
 *          description: PVO ADDED
 *          content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SQLReturn'
 */
app.post("/", async function (req, res){
    const webReq = req;
    const data = webReq.body;
    try {
        await writePVOData(data.InstallationID, data.NodeID, data.PortID, data.EventDate, data.jData).then(
            (response) => {
                //  console.log(" Then Success: Logged" + data.DataValues);
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