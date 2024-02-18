require('dotenv').config();
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const nodeDate = require("date-and-time");
const saltRounds = 10;
const CDO_Status = require("./inc/types");
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
                else if (result.affectedRows > 0) {
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
                else if (result.affectedRows > 0) {
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
                else if (result.affectedRows > 0) {
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
                else if (result[0].email) { // we have a valid username    
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
async function writeCDO(requestData) {
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
        
        sRequestDate = nodeDate.format(new Date(), 'YYYY-MM-DD hh:mm:ss');
        iStatus = CDO_Status.CommandNew;
        cdo_JSON =JSON.stringify(requestData.jData)
        var myQuery = "INSERT cdo (InstallationID,RequestDate,requestType,Version,jData,userID,status) VALUES ( '"
            + requestData.InstallationID + "\' ,\'"  + sRequestDate + "\' ," + requestData.requestType + ", " + requestData.Version
            + ", \'" + cdo_JSON +"\',\'" + requestData.userID + "\'," + iStatus + ");"
       
        await dbConnection.execute(
            myQuery,
            (err, result) => {
                if (err) {
                    retVal = {
                        err: err
                    };
                    resolve(retVal);
                }
                else if (result.affectedRows > 0) {
                    retVal = {
                        id: result.insertId,
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
async function readCDO(sInstallationID,iStatus) {
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
        var myQuery = "SELECT * FROM cdo WHERE InstallationID='" + sInstallationID + "\' and status = " + iStatus +" order by RequestDate desc;"
  
        await dbConnection.execute(
            myQuery,
            (err, result) => {
                if (err) {
                    retVal = {
                        err: err
                    };
                    resolve(retVal);
                }
                else if (result.length > 0) {
                    retVal = result[0];
                    resolve(retVal);
                } else {
                    retVal = {
                        err: 'InstallationID ID Not found'
                    };
                    resolve(retVal);
                };
            }
        );
    })
}

//--------------------------------------------------------------------------------------------
async function updateCDO(sCommandID,cdoOK) {
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
        if (cdoOK==true) {
            iStatus = CDO_Status.CommandACK;
        }else{
            iStatus = CDO_Status.CommandErr;
        }

        var myQuery = "update cdo set status = " + iStatus + " WHERE id='" + sCommandID + "\';"
  
        await dbConnection.execute(
            myQuery,
            (err, result) => {
                if (err) {
                    retVal = {
                        err: err
                    };
                    resolve(retVal);
                }
                else if (result.affectedRows > 0) {
                    retVal = {
                        id: sCommandID,
                        row : result.affectedRows,
                    };
                    resolve(retVal);
                } else {
                    retVal = {
                        err: 'ID Not found'
                    };
                    resolve(retVal);
                };
            }
        );
    })
}

//--------------------------------------------------------------------------------------------
module.exports = {writePVOData,writePDOData,addUser,getUserByEmail,writeCDO,readCDO,updateCDO}
