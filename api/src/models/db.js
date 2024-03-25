const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const nodeDate = require("date-and-time");
const saltRounds = 10;
const CDO_Status = require("./inc/types");

const AppSettings = require("../middleware/settings");
Settings = AppSettings;
//--------------------------------------------------------------------------------------------
/*let dbConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER_NAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
*/

const ConnectionData = {
  host: Settings.AppSettings.DB_HOST(),
  user: Settings.AppSettings.DB_USER_NAME(),
  password: Settings.AppSettings.DB_PASSWORD(),
  database: Settings.AppSettings.DB_NAME(),
};

let dbConnection = mysql.createConnection(ConnectionData);

// ---------
// ref -----https://stackoverflow.com/questions/8834126/how-to-efficiently-check-if-variable-is-array-or-object-in-nodejs-v8
let isObject = function (a) {
  return !!a && a.constructor === Object;
};
//--------------------------------------------------------------------------------------------
async function writePVOData(InstillationID, Node, Port, EventDate, Data) {
  let ts = Date.now();
  console.log(
    "- " +
      ts +
      " Step 1:  Writing PVO Data for  " +
      InstillationID +
      " with  event date " +
      EventDate
  );
  return new Promise(async function (resolve, reject) {
    var disconnected = await new Promise((resolve) => {
      dbConnection.ping((err) => {
        resolve(err);
      });
    });
    if (disconnected) {
      dbConnection = mysql.createConnection(ConnectionData);
    }
    try {
      if (isObject(Data)) {
        // check if it an actual JSON object ie from Python etc
        pvo_JSON = JSON.stringify(Data);
      } else {
        // check if it a string e.g from PLC as it cant cope with nested JSON
        // Sanitize the data by replacing any ' with "
        sData = Data.replaceAll("'", '"');
        _JSON = JSON.parse(sData);
        pvo_JSON = JSON.stringify(_JSON);
      }

      var retVal = null;
      var myQuery =
        "INSERT pvo (InstallationID,NodeID,PortID,EventDate,jData) VALUES ( " +
        InstillationID +
        " ," +
        Node +
        ", " +
        Port +
        ", '" +
        EventDate +
        "', '" +
        pvo_JSON +
        "');";

      //console.log("- " + ts + " Step 2:  Query =  " + myQuery);

      await dbConnection.execute(myQuery, (err, result) => {
        if (err) {
          console.log("- " + ts + " Step 3:  error ");
          retVal = {
            err: retVal,
          };
          reject(err);
        } else if (result.affectedRows > 0) {
          retVal = {
            LastUpdate: result,
            Message: "Write ok",
          };
          // console.log(
          //"+" +
          //     ts +
          //     "  Data Written for  " +
          //     InstillationID +
          //     " with  event date " +
          //     EventDate
          //  );
          resolve(retVal);
        } else {
          retVal = {
            err: "Unknown ID",
          };
          resolve(retVal);
        }
      });
    } catch (error) {
      retVal = {
        err: error,
      };
    }
  });
}
//--------------------------------------------------------------------------------------------

async function writePDOData(InstillationID, EventDate, Type, Version, Data) {
  let ts = Date.now();

  console.log(
    "-" +
      ts +
      "  Writing PDO Data for  " +
      InstillationID +
      " with  event date " +
      EventDate
  );
  return new Promise(async function (resolve, reject) {
    var disconnected = await new Promise((resolve) => {
      dbConnection.ping((err) => {
        resolve(err);
      });
    });
    if (disconnected) {
      dbConnection = mysql.createConnection(ConnectionData);
    }

    //const kpi = JSON.parse("{"+dataValues+"}")
    pdo_JSON = JSON.stringify(Data);
    var retVal = null;

    var myQuery =
      "INSERT pdo (InstallationID,StructureID,Version,EventDate,jData) VALUES ( " +
      InstillationID +
      " ," +
      Type +
      " ," +
      Version +
      ", '" +
      EventDate +
      "', '" +
      pdo_JSON +
      "');";

    await dbConnection.execute(myQuery, (err, result) => {
      if (err) {
        retVal = {
          err: err,
        };
        reject(err);
      } else if (result.affectedRows > 0) {
        retVal = {
          LastUpdate: result,
          Message: "Write ok",
        };
        console.log(
          "+" +
            ts +
            "  Data Written for  " +
            InstillationID +
            " with  event date " +
            EventDate
        );
        resolve(retVal);
      } else {
        retVal = {
          err: "Unknown ID",
        };
        resolve(retVal);
      }
    });
  });
}

//--------------------------------------------------------------------------------------------
async function readPDO(sInstallationID, iStatus) {
  return new Promise(async function (resolve, reject) {
    var disconnected = await new Promise((resolve) => {
      dbConnection.ping((err) => {
        resolve(err);
      });
    });
    if (disconnected) {
      dbConnection = mysql.createConnection(ConnectionData);
    }
    var myQuery =
      "SELECT * FROM pdo WHERE InstallationID=" +
      sInstallationID +
      " order by EventDate desc;";

    await dbConnection.execute(myQuery, (err, result) => {
      if (err) {
        retVal = {
          err: err,
        };
        reject(err);
      } else if (result.length > 0) {
        retVal = result;
        resolve(retVal);
      } else {
        retVal = {
          err: "InstallationID ID Not found",
        };
        resolve(retVal);
      }
    });
  });
}


//--------------------------------------------------------------------------------------------

async function addUser(userData) {
  return new Promise(async function (resolve, reject) {
    var disconnected = await new Promise((resolve) => {
      dbConnection.ping((err) => {
        resolve(err);
      });
    });
    if (disconnected) {
      dbConnection = mysql.createConnection(ConnectionData);
    }
    const sGroupId = 0; //
    const iRole = 0; // normal user
    const hash = await bcrypt.hash(userData.password, saltRounds);
    var myQuery =
      "INSERT user (firstName,lastName,email,mobile,password,role,groupID) VALUES ( '" +
      userData.firstName +
      "' ,'" +
      userData.lastName +
      "' ,'" +
      userData.email +
      "', '" +
      userData.mobile +
      "', '" +
      hash +
      "'," +
      iRole +
      "," +
      sGroupId +
      ");";

    await dbConnection.execute(myQuery, (err, result) => {
      if (err) {
        retVal = {
          err: err,
        };
        reject(err);
      } else if (result.affectedRows > 0) {
        userData.id = result.insertId;
        retVal = {
          LastUpdate: result,
          Message: "Write ok",
          User: userData,
        };
        resolve(retVal);
      } else {
        retVal = {
          err: "Unknown ID",
        };
        resolve(retVal);
      }
    });
  });
}
async function deleteAllUsers() {
  return new Promise(async function (resolve, reject) {
    var disconnected = await new Promise((resolve) => {
      dbConnection.ping((err) => {
        resolve(err);
      });
    });
    if (disconnected) {
      dbConnection = mysql.createConnection(ConnectionData);
    }
    var myQuery = "delete from user;";

    await dbConnection.execute(myQuery, (err, result) => {
      if (err) {
        retVal = {
          err: err,
        };
        reject(err);
      } else if (result.affectedRows > 0) {
        retVal = {
          LastUpdate: result,
          Message: "Delete ok",
        };
        resolve(retVal);
      } else {
        retVal = {
          err: "Unknown",
        };
        resolve(retVal);
      }
    });
  });
}
//--------------------------------------------------------------------------------------------
async function getUserById(userId) {
  return new Promise(async function (resolve, reject) {
    var disconnected = await new Promise((resolve) => {
      dbConnection.ping((err) => {
        resolve(err);
      });
    });
    if (disconnected) {
      dbConnection = mysql.createConnection(ConnectionData);
    }
    var myQuery = "SELECT * FROM user WHERE id=" + userId + ";";
    await dbConnection.execute(myQuery, (err, result) => {
      if (err) {
        retVal = {
          err: err,
        };
        reject(err);
      } else if (result.length > 0) {
        // we have a valid username
        retVal = result[0];
        resolve(retVal);
      } else {
        retVal = {
          err: "Unknown Email",
        };
        resolve(retVal);
      }
    });
  });
}
//--------------------------------------------------------------------------------------------
async function getUserByEmail(userEmail) {
  return new Promise(async function (resolve, reject) {
    var disconnected = await new Promise((resolve) => {
      dbConnection.ping((err) => {
        resolve(err);
      });
    });
    if (disconnected) {
      dbConnection = mysql.createConnection(ConnectionData);
    }
    var myQuery = "SELECT * FROM user WHERE email='" + userEmail + "';";
    await dbConnection.execute(myQuery, (err, result) => {
      if (err) {
        retVal = {
          err: err,
        };
        reject(err);
      } else if (result.length > 0) {
        // we have a valid username
        retVal = result[0];
        resolve(retVal);
      } else {
        retVal = {
          err: "Unknown Email",
        };
        resolve(retVal);
      }
    });
  });
}
//--------------------------------------------------------------------------------------------
async function getUsers() {
  return new Promise(async function (resolve, reject) {
    var disconnected = await new Promise((resolve) => {
      dbConnection.ping((err) => {
        resolve(err);
      });
    });
    if (disconnected) {
      dbConnection = mysql.createConnection(ConnectionData);
    }
    var myQuery = "SELECT * FROM user;";
    await dbConnection.execute(myQuery, (err, result) => {
      if (err) {
        retVal = {
          err: err,
        };
        reject(err);
      } else if (result.length > 0) {
        retVal = result;
        resolve(retVal);
      } else {
        retVal = {
          err: "Unknown Email",
        };
        resolve(retVal);
      }
    });
  });
}
//--------------------------------------------------------------------------------------------
async function writeCDO(requestData) {
  return new Promise(async function (resolve, reject) {
    var disconnected = await new Promise((resolve) => {
      dbConnection.ping((err) => {
        resolve(err);
      });
    });
    if (disconnected) {
      dbConnection = mysql.createConnection(ConnectionData);
    }

    sRequestDate = nodeDate.format(new Date(), "YYYY-MM-DD hh:mm:ss");
    iStatus = CDO_Status.CommandNew;
    cdo_JSON = JSON.stringify(requestData.jData);
    var myQuery =
      "INSERT cdo (InstallationID,RequestDate,requestType,Version,jData,userID,status) VALUES ( " +
      requestData.InstallationID +
      " ,'" +
      sRequestDate +
      "' ," +
      requestData.requestType +
      ", " +
      requestData.Version +
      ", '" +
      cdo_JSON +
      "','" +
      requestData.userID +
      "'," +
      iStatus +
      ");";

    await dbConnection.execute(myQuery, (err, result) => {
      if (err) {
        retVal = {
          err: err,
        };
        reject(err);
      } else if (result.affectedRows > 0) {
        retVal = {
          id: result.insertId,
        };
        resolve(retVal);
      } else {
        retVal = {
          err: "Unknown ID",
        };
        resolve(retVal);
      }
    });
  });
}

//--------------------------------------------------------------------------------------------
async function readCDO(sInstallationID, iStatus) {
  return new Promise(async function (resolve, reject) {
    var disconnected = await new Promise((resolve) => {
      dbConnection.ping((err) => {
        resolve(err);
      });
    });
    if (disconnected) {
      dbConnection = mysql.createConnection(ConnectionData);
    }
    var myQuery =
      "SELECT * FROM cdo WHERE InstallationID=" +
      sInstallationID +
      " and status = " +
      iStatus +
      " order by RequestDate desc;";

    await dbConnection.execute(myQuery, (err, result) => {
      if (err) {
        retVal = {
          err: err,
        };
        reject(err);
      } else if (result.length > 0) {
        retVal = result[0];
        resolve(retVal);
      } else {
        retVal = {
          err: "InstallationID ID Not found",
        };
        resolve(retVal);
      }
    });
  });
}

//--------------------------------------------------------------------------------------------
async function updateCDO(sCommandID, cdoOK) {
  return new Promise(async function (resolve, reject) {
    var disconnected = await new Promise((resolve) => {
      dbConnection.ping((err) => {
        resolve(err);
      });
    });
    if (disconnected) {
      dbConnection = mysql.createConnection(ConnectionData);
    }
    if (cdoOK == true) {
      iStatus = CDO_Status.CommandACK;
    } else {
      iStatus = CDO_Status.CommandErr;
    }

    var myQuery =
      "update cdo set status = " + iStatus + " WHERE id='" + sCommandID + "';";

    await dbConnection.execute(myQuery, (err, result) => {
      if (err) {
        retVal = {
          err: err,
        };
        reject(err);
      } else if (result.affectedRows > 0) {
        retVal = {
          id: sCommandID,
          row: result.affectedRows,
        };
        resolve(retVal);
      } else {
        retVal = {
          err: "ID Not found",
        };
        resolve(retVal);
      }
    });
  });
}

//--------------------------------------------------------------------------------------------
async function writeInstallation(requestData) {
  return new Promise(async function (resolve, reject) {
    var disconnected = await new Promise((resolve) => {
      dbConnection.ping((err) => {
        resolve(err);
      });
    });
    if (disconnected) {
      dbConnection = mysql.createConnection(ConnectionData);
    }

    sRequestDate = nodeDate.format(new Date(), "YYYY-MM-DD hh:mm:ss");
    iStatus = CDO_Status.CommandNew;
    cdo_JSON = JSON.stringify(requestData.jData);
    var myQuery =
      "INSERT installation (UserID,GroupID,Description) VALUES ( " +
      requestData.UserID +
      " ," +
      requestData.GroupID +
      " ,'" +
      requestData.Description +
      "');";

    await dbConnection.execute(myQuery, (err, result) => {
      if (err) {
        retVal = {
          err: err,
        };
        reject(err);
      } else if (result.affectedRows > 0) {
        retVal = {
          id: result.insertId,
        };
        resolve(retVal);
      } else {
        retVal = {
          err: "Woops",
        };
        resolve(retVal);
      }
    });
  });
}

//--------------------------------------------------------------------------------------------
async function readInstallation(sInstallationID) {
  return new Promise(async function (resolve, reject) {
    var disconnected = await new Promise((resolve) => {
      dbConnection.ping((err) => {
        resolve(err);
      });
    });
    if (disconnected) {
      dbConnection = mysql.createConnection(ConnectionData);
    }
    var myQuery =
      "SELECT * FROM installation WHERE id=" +
      sInstallationID +
      " order by id desc;";

    await dbConnection.execute(myQuery, (err, result) => {
      if (err) {
        retVal = {
          err: err,
        };
        reject(err);
      } else if (result.length > 0) {
        retVal = result[0];
        resolve(retVal);
      } else {
        retVal = {
          err: "InstallationID ID Not found",
          data: [],
        };
        resolve(retVal);
      }
    });
  });
}

//--------------------------------------------------------------------------------------------
async function readInstallationByUser(iUserID) {
  return new Promise(async function (resolve, reject) {
    var disconnected = await new Promise((resolve) => {
      dbConnection.ping((err) => {
        resolve(err);
      });
    });
    if (disconnected) {
      dbConnection = mysql.createConnection(ConnectionData);
    }
    var myQuery =
      "SELECT * FROM installation WHERE UserID=" +
      iUserID +
      " order by Description desc;";

    await dbConnection.execute(myQuery, (err, result) => {
      if (err) {
        retVal = {
          err: err,
        };
        reject(err);
      } else if (result.length > 0) {
        retVal = result;
        resolve(retVal);
      } else {
        retVal = {
          err: "InstallationID ID Not found",
        };
        resolve(retVal);
      }
    });
  });
}

//-----------------------------------------------------------------------------------------------------
async function readPVO(sInstallationID) {
  return new Promise(async function (resolve, reject) {
    var disconnected = await new Promise((resolve) => {
      dbConnection.ping((err) => {
        resolve(err);
      });
    });
    if (disconnected) {
      dbConnection = mysql.createConnection(ConnectionData);
    }
    var myQuery =
      "SELECT * FROM pvo WHERE InstallationID=" +
      sInstallationID +
      " order by EventDate desc limit 20;";

    await dbConnection.execute(myQuery, (err, result) => {
      if (err) {
        retVal = {
          err: err,
        };
        reject(err);
      } else if (result.length > 0) {
        retVal = result;
        resolve(retVal);
      } else {
        retVal = {
          err: "InstallationID Not found",
        };
        resolve(retVal);
      }
    });
  });
}

//-----------------------------------------------------------------------------------------------------
async function readPVO_Titles(sInstallationID) {
  return new Promise(async function (resolve, reject) {
    var disconnected = await new Promise((resolve) => {
      dbConnection.ping((err) => {
        resolve(err);
      });
    });
    if (disconnected) {
      dbConnection = mysql.createConnection(ConnectionData);
    }
    var myQuery =
      "SELECT DISTINCT json_extract(jData, '$.title') AS Title FROM kcloud.pvo where InstallationID =" +
      sInstallationID +
      " order by Title desc;";

    await dbConnection.execute(myQuery, (err, result) => {
      if (err) {
        retVal = {
          err: err,
        };
        reject(err);
      } else if (result.length > 0) {
        retVal = result;
        resolve(retVal);
      } else {
        retVal = {
          data: [],
          err: "No titles found for this installation",
        };
        resolve(retVal);
      }
    });
  });
}

//-----------------------------------------------------------------------------------------------------
async function readPVO_Single(sInstallationID, sTitle) {
  return new Promise(async function (resolve, reject) {
    var disconnected = await new Promise((resolve) => {
      dbConnection.ping((err) => {
        resolve(err);
      });
    });
    if (disconnected) {
      dbConnection = mysql.createConnection(ConnectionData);
    }
    var myQuery =
      "SELECT  EventDate ,json_extract(jData, '$.title') AS Title, json_extract(jData, '$.value') AS Value ,json_extract(jData, '$.unit')  AS Unit " +
      "FROM kcloud.pvo where InstallationID =" +
      sInstallationID +
      " AND json_extract(jData, '$.title') ='" +
      sTitle +
      "' order by EventDate DESC LIMIT 1;";
    await dbConnection.execute(myQuery, (err, result) => {
      if (err) {
        retVal = {
          err: err,
        };
        reject(err);
      } else if (result.length > 0) {
        retVal = result;
        resolve(retVal);
      } else {
        retVal = {
          err: "Data Not found",
        };
        resolve(retVal);
      }
    });
  });
}
//-----------------------------------------------------------------------------------------------------
async function readPVO_Specific(
  sInstallationID,
  pdoVariableKey,
  dtStart,
  dtEnd,
  sInterval
) {
  return new Promise(async function (resolve, reject) {
    var disconnected = await new Promise((resolve) => {
      dbConnection.ping((err) => {
        resolve(err);
      });
    });
    if (disconnected) {
      dbConnection = mysql.createConnection(ConnectionData);
    }
    if (sInterval =='hourly'){
      var myQuery =
      "SELECT installationid,json_extract(jData, '$.title') as Title, hour(EventDate) as HH, day(EventDate) as DD, month(EventDate) as MM,json_extract(jData, '$.unit') as Unit, " 
      +"avg(json_extract(JData, '$.value')) as AvgVal,min(json_extract(JData, '$.value')) as MinVal,max(json_extract(JData, '$.value')) as MaxVal "
      + "FROM pvo WHERE (EventDate BETWEEN '" + dtStart +"' AND '" + dtEnd + "')"
      + " AND (json_extract(jData, '$.title') = '" + pdoVariableKey +"') AND (installationid = " + sInstallationID +
      ") group by MM,DD,HH ORDER  BY MM,DD,HH asc;";

    }else if (sInterval =='daily') {
      var myQuery =
      "SELECT installationid,json_extract(jData, '$.title') as Title, day(EventDate) as DD, month(EventDate) as MM,json_extract(jData, '$.unit') as Unit, " 
      +"avg(json_extract(JData, '$.value')) as AvgVal,min(json_extract(JData, '$.value')) as MinVal,max(json_extract(JData, '$.value')) as MaxVal "
      + "FROM pvo WHERE (EventDate BETWEEN '" + dtStart +"' AND '" + dtEnd + "')"
      + " AND (json_extract(jData, '$.title') = '" + pdoVariableKey +"') AND (installationid = " + sInstallationID +
      ") group by MM,DD ORDER  BY MM,DD asc;";
    } else {
      var myQuery =
      "SELECT installationid,json_extract(jData, '$.title') as Title,json_extract(jData, '$.unit') as Unit," 
      +"json_extract(JData, '$.value') as Value,EventDate "
      + "FROM pvo WHERE (EventDate BETWEEN '" + dtStart +"' AND '" + dtEnd + "')"
      + " AND (json_extract(jData, '$.title') = '" + pdoVariableKey +"') AND (installationid = " + sInstallationID +
      ");";
    }
    

    await dbConnection.execute(myQuery, (err, result) => {
      if (err) {
        retVal = {
          err: err,
        };
        reject(err);
      } else if (result.length > 0) {
        retVal = result;
        resolve(retVal);
      } else {
        retVal = {
          err: "Data Not found",
        };
        resolve(retVal);
      }
    });
  });
}


//--------------------------------------------------------------------------------------------
module.exports = {
  writePVOData,
  writePDOData,
  readPDO,
  addUser,
  getUserByEmail,
  writeCDO,
  readCDO,
  updateCDO,
  readInstallation,
  writeInstallation,
  getUsers,
  deleteAllUsers,
  getUserById,
  readPVO,
  readPVO_Titles,
  readInstallationByUser,
  readPVO_Single,
  readPVO_Specific,
};
