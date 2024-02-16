require('dotenv').config();
const mysql = require("mysql2");
const bcrypt = require("bcrypt")
const saltRounds = 10;

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
        
        pvo_JSON =JSON.stringify(Data)
        var retVal = null;  
        var myQuery = "INSERT pvo (InstallationID,NodeID,Port,EventDate,Data) VALUES ( '"
            + InstillationID + "\' ," + Node + ", " + Port + ", \'" + EventDate + "\', \'" + pvo_JSON +"\');"
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

async function writePDOData(InstillationID,EventDate,Type,Version,Data) {

    let ts = Date.now();

    console.log("-" + ts + "  Writing PDO Data for  " + InstillationID + " with  event date " + EventDate);
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

        //const kpi = JSON.parse("{"+dataValues+"}")
        pdo_JSON =JSON.stringify(Data)
        var retVal = null;
      
        var myQuery = "INSERT pdo (InstallationID,StructureID,Version,EventDate,jData) VALUES ( '"
            + InstillationID + "\' ,"  + Type + " ," + Version + ", \'" + EventDate + "\', \'" + pdo_JSON +"\');"
       
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

async function addUser(userData) {
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
        const sGroupId = 'Unassigned';//
        const iRole = 0 ;// normal user
        const hash = await bcrypt.hash(userData.password,saltRounds);
        var myQuery = "INSERT user (firstName,lastName,email,mobile,password,role,groupID) VALUES ( '"
            + userData.firstName + "\' ,\'"  + userData.lastName + "\' ,\'" + userData.email + "\', \'" + userData.mobile
            + "\', \'" + hash +"\'," + iRole + ",\'" + sGroupId + "\');"
       
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
async function getUserByEmail( userEmail) {
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
        var myQuery = "SELECT * FROM user WHERE email='" + userEmail + "\';"
        await dbConnection.execute(
            myQuery,
            (err, result) => {
                if (err) {
                    retVal = {
                        err: err
                    };
                }
                if (result[0].email) { // we have a valid username    
                    retVal = result[0];
                    resolve(retVal);
                } else {
                    retVal = {
                        err: 'Unknown Email'
                    };
                    resolve(retVal);
                };
            }
        );
    })
}
//--------------------------------------------------------------------------------------------
module.exports = {writePVOData,writePDOData,addUser,getUserByEmail}
