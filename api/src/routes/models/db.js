require('dotenv').config();
const mysql = require("mysql2");
//--------------------------------------------------------------------------------------------
let dbConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER_NAME ,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

//--------------------------------------------------------------------------------------------
async function writePVOData(InstillationID, Node, Port, EventDate,Data) {
    let ts = Date.now();
    console.log("-" + ts + "  Writing PVO Data for  " + InstillationID + " with  event date " + EventDate);
    return new Promise(async function (resolve, reject) {
        var disconnected = await new Promise(resolve => {
            dbConnection.ping(err => {
                resolve(err);
            });
        });
        if (disconnected) {
            dbConnection = mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER_NAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME
            });
        }
        
        kpi =JSON.stringify(Data)
        var retVal = null;  
        var myQuery = "INSERT kcloud.tblpvo (InstallationID,NodeID,Port,EventDate,Data) VALUES ( '"
            + InstillationID + "\' ," + Node + ", " + Port + ", \'" + EventDate + "\', \'" + kpi +"\');"
        myQuery = myQuery.replace("False", "false");
        console.log(myQuery);
        await dbConnection.execute(
            myQuery,
            (err, result) => {
                if (err) {
                    retVal = {
                        err: err
                    };
                }
                if (result.affectedRows > 0) {
                    retVal = {
                        LastUpdate: result,
                        Message: "Write ok"
                    };
                    console.log("+" + ts + "  Data Written for  " + InstillationID + " with  event date " + EventDate);
                    resolve(retVal);
                } else {
                    retVal = {
                        err: 'Unknown ID'
                    };
                    resolve(retVal);
                };
            }
        );
    })
  }
//--------------------------------------------------------------------------------------------
module.exports = {writePVOData}
