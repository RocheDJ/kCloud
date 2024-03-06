// routes/pvo-api.js
/**
 * @swagger
 * tags:
 *  name: P.V.O. 
 *  description: API endpoint for (Process Variable Object) 
 *
 */
const express = require("express");
const app = express();
const {writePVOData,readPVO,readPVO_Titles,readPVO_Single,readPVO_Specific} = require('../models/db')
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
 *     PVOTitleReturn:
 *      type: object
 *      properties:
 *          data:
 *                 type: string
 *                 description: Response Title.
 *                 example: Level
 *     PVOReturn:
 *      type: object
 *      properties:
 *          EventDate:
 *                type: string
 *                description: The Date of the Data
 *                example: 024-02-05 12:55:46
 *          Title:
 *                 type: string
 *                 description: .
 *                 example: Temperature    
 *          Value:
 *                 type: number
 *                 description: .
 *                 example: 15.4
 *          Unit:
 *                 type: string
 *                 description: .
 *                 example: 2024-02-05 12:55:46
 *       
 */           
//--------------------------------------------------------------------------------------------

//---------------------------------------------------- API Calls -----------------------------

//----------------------------------------------- PVO Write To DB -----------------------------
/**
 * @swagger
 * /pvo:
 *   post:
 *     tags:
 *      - P.V.O.
 *     summary: Add a Process Variable to the Database.
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


//----------------------------------------------- PVO read All PVO for ID -----------------------------
/**
 * @swagger
 * /pvo/{id}:
 *   get:
 *     tags:
 *      - P.V.O.
 *     summary: Read Latest PVOs for a given ID.
 *     parameters:
 *      - in: path
 *        name: id
 *        example: 1234
 *        required: true
 *        description: Numeric ID of the installation to retrieve.
 *        schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of PVO Data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                      $ref: '#/components/schemas/SQLReturn'
 */
app.get("/:id", async function (req, res) {
    //...
    const webReq = req;
    const InstallationId = webReq.params.id;
    try {
      await readPVO(InstallationId).then(
        (response) => {
          if (response.err) {
            response.data=[];
            res.status(200).send(response);
          } else {
            response.data=response;
            res.status(200).send(response);
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

//----------------------------------------------- PVO read title for Given ID -----------------------------
/**
 * @swagger
 * /pvo/title/{id}:
 *   get:
 *     tags:
 *      - P.V.O.
 *     summary: Read all PVO value types being uploaded for an installation.
 *     parameters:
 *      - in: path
 *        name: id
 *        example: 1234
 *        required: true
 *        description: Numeric ID of the installation to retrieve.
 *        schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of PVO Titles.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                      $ref: '#/components/schemas/PVOTitleReturn'
 */

 app.get("/title/:id", async function (req, res) {
    //...
    const webReq = req;
    const InstallationId = webReq.params.id;
    try {
      await readPVO_Titles(InstallationId).then(
        (response) => {
          if (response.err) {
            response.data=[];
            res.status(200).send(response);
          } else { 
            res.status(200).send(response);
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


//-------------------------------------- PVORead PVO Value given Title and ID -----------------------------
/**
 * @swagger
 * /pvo/{id}/{title}:
 *   get:
 *     tags:
 *      - P.V.O.
 *     summary: Read Latest PVO data for a given ID and title.
 *     parameters:
 *      - in: path
 *        name: id
 *        example: 1234
 *        required: true
 *        description: Numeric ID of the installation to retrieve.
 *        schema:
 *           type: integer
 *      - in: path
 *        name: title
 *        example: Temperature
 *        required: true
 *        description: Title of Data to read.
 *        schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of PVO Data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                      $ref: '#/components/schemas/PVOReturn'
 */
app.get("/:id/:title", async function (req, res) {
    //...
    const webReq = req;
    const InstallationId = webReq.params.id;
    const TitleId = webReq.params.title;
    try {
      await readPVO_Single(InstallationId,TitleId).then(
        (response) => {
          if (response.err) {
            response.data=[];
            res.status(200).send(response);
          } else {
            response.data=response[0];
            res.status(200).send(response);
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




//---------------------------------- PVO read values between dates title for Given ID and title  ----
/**
 * @swagger
 * /pvo/{id}/{title}/{start}/{stop}:
 *   get:
 *     tags:
 *      - P.V.O.
 *     summary: Read all PVO value types between dates for Given ID and title .
 *     parameters:
 *      - in: path
 *        name: id
 *        example: 1234
 *        required: true
 *        description: Numeric ID of the installation to retrieve.
 *        schema:
 *           type: integer
 *      - in: path
 *        name: title
 *        example: Temperature
 *        required: true
 *        description: Title of Data to read.
 *        schema:
 *           type: string
 *      - in: path
 *        name: start
 *        example: 2024-03-06 18:00:00
 *        required: true
 *        description: Start Date and time of desired data array.
 *        schema:
 *           type: string
 *      - in: path
 *        name: stop
 *        example: 2024-03-06 18:59:59
 *        required: true
 *        description: Stop Date and time of desired data array.
 *        schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of PVO data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                      $ref: '#/components/schemas/PVOReturn'
 */

 app.get("/:id/:title/:start/:stop", async function (req, res) {
  //...
  const webReq = req;
  const InstallationId = webReq.params.id;
  const TitleId = webReq.params.title;
  const dtStart = webReq.params.start;
  const dtStop  = webReq.params.stop;
  try {
    await readPVO_Specific(InstallationId,TitleId,dtStart,dtStop).then(
      (response) => {
        if (response.err) {
          response.data=[];
          res.status(200).send(response);
        } else { 
          res.status(200).send(response);
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


module.exports = app;