#!/bin/python3
# --------------------------------------------------------------------------------------------------------------------
# Author: David Roche
# Date: January 2024
# Description : Class  for handling all access to the data base
# -------------------------------------------------------------------------------------------------------------------
# ./inc/udt/dbClass.py
# ------------------------------------------  Import Decelerations -------------------------------------------------
# Python Libs
# -------------------------------------------------------------------------------------------


from contextlib import nullcontext
import sqlite3
import uuid
import settings
import datetime
import json

 # ----------------------------------------------------------------------------------------
class dbClass:
    """Class to interface to an SQlite Database"""
    # ----------------------------------------------------------------------------------------
    def __init__(self):
        self.dbPath = str(settings.BASE_DIR) + "/data/" + settings.SQLITE_DB
        self.db = sqlite3.connect(self.dbPath)
        self.errorString = "-"
        self.connectionOpen = False

    # ----------------------------------------------------------------------------------------
    def CloseConn(self):
        if self.connectionOpen == True:
            self.db.close()
            self.connectionOpen = False

    # ----------------------------------------------------------------------------------------
    def OpenConn(self):
        if self.connectionOpen == False:
            self.db = sqlite3.connect(self.dbPath)
            self.connectionOpen = True

    # -----------------------------------------------------------------------------------------
    def ClearOldData(self, days):
        try:
            # open db and connect
            self.OpenConn()

            c = self.db.cursor()
            # return a query to delete any data over the given days old
            # get current time less the number of days
            utcTimeLessX = datetime.datetime.now() - datetime.timedelta(days=days)
            utcTimeLessX = utcTimeLessX.strftime("%Y-%m-%d %H:%M:%S")  # string rep for

            myQuery = "Delete from  pvo WHERE EventDate < '" + str(utcTimeLessX) + "';"

            c.execute(myQuery)

            # Save (commit) the changes
            self.db.commit()

            myQuery = "Delete from  pdo WHERE EventDate < '" + str(utcTimeLessX) + "';"

            c.execute(myQuery)

            # Save (commit) the changes
            self.db.commit()

            # We can also close the connection if we are done with it.
            # Just be sure any changes have been committed or they will be lost.
            self.CloseConn()

        except Exception as error:
            self.errorString = "ClearOldData Error " + str(error)

    # -----------------------------------------------------------------------------------------
    def log_PDO_to_DB(self, dataJSON, report_type, report_version):
        try:
            # open db and connect
            self.OpenConn()
            c = self.db.cursor()
            # generate the insert query
            myUuid = uuid.uuid4()
            installationId = str(settings.INSTALLATION_ID)
            utcTime = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            # Convert the dictionary to a
            # JSON string with double quotes
            jData = json.dumps(dataJSON, ensure_ascii=False)

            #
            # if sValueType == '1':  # if the value in the PVO is string add quotes
            #   sqlJSON = "', jData = json_set(jData,'$.value','" +str(sValue) + "')"
            # else:
            #    sqlJSON = "', jData = json_set(jData,'$.value'," +str(sValue) + ")"

            myQuery = (
                "INSERT INTO pdo VALUES ('"
                + str(myUuid)
                + "','"
                + str(installationId)
                + "',"
                + str(report_type.value)
                + ","
                + str(report_version)
                + ",'"
                + str(utcTime)
                + "','"
                + jData
                + "')"
            )

            c.execute(myQuery)

            # Save (commit) the changes
            self.db.commit()

            # We can also close the connection if we are done with it.
            # Just be sure any changes have been committed or they will be lost.
            self.CloseConn()
        except Exception as error:
            self.errorString = "log_PDO_to_DB Error " + str(error)

    # -----------------------------------------------------------------------------------------
    def log_PVO_to_DB(self, dataJSON):
        try:
            # open db and connect
            self.OpenConn()
            c = self.db.cursor()
            # generate the insert query
            myUuid = uuid.uuid4()
            installationId = str(settings.INSTALLATION_ID)
            utcTime = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            error = dataJSON["error"]
            sTitle = dataJSON["data"][0]["title"]  # load from directory type
            sUnit = dataJSON["data"][0]["unit"]
            sValueType = dataJSON["data"][0]["valueType"]
            #   jData = dataJSON["data"][0]
            # Convert the dictionary to a
            # JSON string with double quotes
            jData = json.dumps(dataJSON["data"][0], ensure_ascii=False)
            sNodeId = dataJSON["node"]
            sPortId = dataJSON["port"]
            #
            # if sValueType == '1':  # if the value in the PVO is string add quotes
            #   sqlJSON = "', jData = json_set(jData,'$.value','" +str(sValue) + "')"
            # else:
            #    sqlJSON = "', jData = json_set(jData,'$.value'," +str(sValue) + ")"

            myQuery = (
                "INSERT INTO pvo VALUES ('"
                + str(myUuid)
                + "','"
                + str(installationId)
                + "',"
                + str(sNodeId)
                + ","
                + str(sPortId)
                + ",'"
                + str(utcTime)
                + "',0,'"
                + jData
                + "','"
                + str(error)
                + "')"
            )

            c.execute(myQuery)

            # Save (commit) the changes
            self.db.commit()

            # We can also close the connection if we are done with it.
            # Just be sure any changes have been committed or they will be lost.
            self.CloseConn()
        except Exception as error:
            self.errorString = "log_PVO_to_DB Error " + str(error)

    # -----------------------------------------------------------------------------------------
    def logStatus_Of_PVO_to_DB(self, id, postStatus):
        try:
            # open db and connect
            self.OpenConn()
            c = self.db.cursor()
            # generate the  query
            myQuery = (
                "UPDATE pvo set Status ='"
                + str(postStatus)
                + "' where _id ='"
                + str(id)
                + "';"
            )
            c.execute(myQuery)

            # Save (commit) the changes
            self.db.commit()

            # We can also close the connection if we are done with it.
            # Just be sure any changes have been committed or they will be lost.
            self.CloseConn()
        except Exception as error:
            self.errorString = "logStatus_Of_PVO_to_DB Error " + str(error)

    # -----------------------------------------------------------------------------------------
    def logStatus_Of_PDO_to_DB(self, id, postStatus):
        try:
            # open db and connect
            self.OpenConn()
            c = self.db.cursor()
            # generate the  query
            myQuery = (
                "UPDATE pdo set Status ='"
                + str(postStatus)
                + "' where _id ='"
                + str(id)
                + "';"
            )
            c.execute(myQuery)

            # Save (commit) the changes
            self.db.commit()

            # We can also close the connection if we are done with it.
            # Just be sure any changes have been committed or they will be lost.
            self.CloseConn()
        except Exception as error:
            self.errorString = "logStatus_Of_PDO_to_DB Error " + str(error)

    # ----------------------------------------------------------------------------------------------------------------------
    def read_outStanding_PVO(self):
        try:
            # af status 200 as is ok else need read to
            # open db and connect
            dbPath = str(settings.BASE_DIR) + "/data/" + settings.SQLITE_DB
            conn = sqlite3.connect(dbPath)
            c = conn.cursor()
            rows = c.execute("SELECT * FROM pvo WHERE Status <> '200'")
            rows = c.fetchall()
            count = len(rows)
            self.CloseConn()
            return rows
        except Exception as error:
            self.errorString = "read_outStanding_PVO Error " + str(error)
            return nullcontext

    # ----------------------------------------------------------------------------------------------------------------------
    def read_outStanding_PDO(self):
        try:
            # af status 200 as is ok else need read to
            # open db and connect
            dbPath = str(settings.BASE_DIR) + "/data/" + settings.SQLITE_DB
            conn = sqlite3.connect(dbPath)
            c = conn.cursor()
            rows = c.execute("SELECT * FROM pdo WHERE Status <> '200'")
            rows = c.fetchall()
            count = len(rows)
            self.CloseConn()
            return rows
        except Exception as error:
            self.errorString = "read_outStanding_PDO Error " + str(error)
            return nullcontext

    # ----------------------------------------------------------------------------------------------------------------------
    def create_PVO_Live(self, pvoIndexMax):
        try:
            # open db and connect
            self.OpenConn()
            c = self.db.cursor()
            # generate construct query
            myQuery = "DROP TABLE IF EXISTS 'pvo_live';"
            c.execute(myQuery)
            # Save (commit) the changes
            self.db.commit()
            myQuery = " CREATE TABLE IF NOT EXISTS 'pvo_live' ( `id` TEXT UNIQUE, `InstallationID` text, `EventDate` TEXT, `Status` INTEGER DEFAULT 0, `jData` JSON, `error` TEXT, PRIMARY KEY(`id`) );"
            c.execute(myQuery)
            # Save (commit) the changes
            self.db.commit()
            # add a row for each pvo
            for num in range(1, pvoIndexMax):
                myQuery = "INSERT INTO pvo_live ('id') VALUES ('" + str(num) + "');"
                c.execute(myQuery)
                # Save (commit) the changes
                self.db.commit()
                myQuery = (
                    'UPDATE pvo_live SET jData=\'{"title": "Blank Title", "unit": "-", "valueType": 5, "value": 0}\' WHERE  id=\''
                    + str(num)
                    + "';"
                )
                c.execute(myQuery)
                # Save (commit) the changes
                self.db.commit()

            # We can also close the connection if we are done with it.
            # Just be sure any changes have been committed or they will be lost.

            self.CloseConn()
        except Exception as error:
            self.errorString = "log_PVO_to_DB Error " + str(error)

    # ----------------------------------------------------------------------------------------------------------------------
    def update_PVO_Live(self, dataJSON, pvoIndex):
        try:
            # open db and connect
            self.OpenConn()
            c = self.db.cursor()
            # generate the insert query
            installationId = "LOCAL"
            utcTime = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            error = dataJSON["error"]
            sTitle = dataJSON["data"][0]["title"]  # load from directory type
            sUnit = dataJSON["data"][0]["unit"]
            sValueType = dataJSON["data"][0]["valueType"]
            sValue = dataJSON["data"][0]["value"]
            if sValueType == "1":  # string
                sqlJSON = "', jData = json_set(jData,'$.value','" + str(sValue) + "')"
            else:
                sqlJSON = "', jData = json_set(jData,'$.value'," + str(sValue) + ")"

            myQuery = (
                "UPDATE pvo_live set InstallationID ='"
                + str(installationId)
                + "', EventDate ='"
                + str(utcTime)
                + "',error ='"
                + str(error)
                + sqlJSON
                + " where id ='"
                + str(pvoIndex)
                + "';"
            )
            c.execute(myQuery)
            # Save (commit) the changes
            self.db.commit()

            # ToDo: move this to init table sequence
            sqlJSON = "jData = json_set(jData,'$.title','" + str(sTitle) + "')"
            myQuery = (
                "UPDATE pvo_live set " + sqlJSON + " where id ='" + str(pvoIndex) + "';"
            )
            c.execute(myQuery)
            # Save (commit) the changes
            self.db.commit()

            # ToDo: move this to init table sequence
            sqlJSON = "jData = json_set(jData,'$.unit','" + str(sUnit) + "')"
            myQuery = (
                "UPDATE pvo_live set " + sqlJSON + " where id ='" + str(pvoIndex) + "';"
            )
            c.execute(myQuery)
            # Save (commit) the changes
            self.db.commit()

            # We can also close the connection if we are done with it.
            # Just be sure any changes have been committed or they will be lost.
            self.CloseConn()
        except Exception as error:
            self.errorString = "log_PVO_to_DB Error " + str(error)

    # ------------------------------------------------------------------------------------------
    def read_pvo_live(self):
        try:
            # define the query
            myQuery = "select * from pvo_live where EventDate not null order by EventDate desc"
            # open db and connect
            self.OpenConn()
            self.db.row_factory = sqlite3.Row
            c = self.db.cursor()
            c.execute(myQuery)
            rows = c.fetchall()
            # We can also close the connection if we are done with it.
            self.CloseConn()
            return rows
        except Exception as error:
            self.errorString = "read_pvo_live Error " + str(error)

    # ------------------------------------------------------------------------------------------
    def read_pvo_live_JSON(self):
        try:
            # define the query
            myQuery = "select * from pvo_live where EventDate not null order by EventDate desc"
            # open db and connect
            self.OpenConn()
            self.db.row_factory = sqlite3.Row
            c = self.db.cursor()
            c.execute(myQuery)
            rows = c.fetchall()
            # modify to return Json
            # from https://www.askpython.com/python/examples/python-sql-data-to-json
            columns = [col[0] for col in c.description]
            data = [dict(zip(columns, row)) for row in rows]
            to_json = json.dumps(data, indent=2)
            # We can also close the connection if we are done with it.
            self.CloseConn()
            return to_json
        except Exception as error:
            self.errorString = "read_pvo_live JSON Error " + str(error)
            return 999

    # --------------------------------------------------------------------------------------------
    def update_status(
        self, iProcess, sStatus, fCycleTime
    ):  # update the local status table so user
        # can see what program doing.
        try:
            # open db and connect
            self.OpenConn()
            c = self.db.cursor()
            utcTime = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            myQuery = (
                "UPDATE status set EventDate ='"
                + str(utcTime)
                + "', EventDate ='"
                + str(utcTime)
                + "', CycleTime ="
                + str(fCycleTime)
                + ', Status = "'
                + str(sStatus)
                + "\" where Process ='"
                + str(iProcess)
                + "';"
            )

            c.execute(myQuery)

            # Save (commit) the changes
            self.db.commit()
            # We can also close the connection if we are done with it.
            # Just be sure any changes have been committed or they will be lost.
            self.CloseConn()
        except Exception as error:
            self.errorString = "update_status " + str(error)

    # --------------------------------------------------------------------------------------------
    def read_status(self):
        try:
            # define the query
            myQuery = (
                "select * from status where EventDate not null order by EventDate desc"
            )
            # open db and connect
            self.OpenConn()
            self.db.row_factory = sqlite3.Row
            c = self.db.cursor()
            c.execute(myQuery)
            rows = c.fetchall()
            # We can also close the connection if we are done with it.
            self.CloseConn()
            return rows
        except Exception as error:
            self.errorString = "read_status Error " + str(error)

    # ----------------------------------------------------------------------------------------------------------------------
    def read_PVO_specific(self, pdoVariableKey, dtStart, dtEnd):
        try:
            # open db and connect
            # construct the query
            # myQuery = ("SELECT * FROM pvo WHERE EventDate between '" +
            #            str(dtStart) + "' and '" + str(dtEnd)+"'")

            myQuery = (
                "SELECT json_extract(jData, '$.title') as Title,"
                + "json_extract(JData, '$.value') as Value,EventDate FROM pvo WHERE EventDate between '"
                + str(dtStart)
                + "' and '"
                + str(dtEnd)
                + "' and Title ='"
                + str(pdoVariableKey)
                + "';"
            )

            dbPath = str(settings.BASE_DIR) + "/data/" + settings.SQLITE_DB
            conn = sqlite3.connect(dbPath)
            c = conn.cursor()
            rows = c.execute(myQuery)
            rows = c.fetchall()
            # modify to return Json
            # from https://www.askpython.com/python/examples/python-sql-data-to-json
            columns = [col[0] for col in c.description]
            data = [dict(zip(columns, row)) for row in rows]
            to_json = json.dumps(data, indent=2)
            count = len(rows)
            self.CloseConn()
            return to_json
        except Exception as error:
            self.errorString = "read_PVO_specific Error " + str(error)
            return 999

    # --------------------------------------------------------------------------------------------
    def read_status(self):
        try:
            # define the query
            myQuery = (
                "select * from status where EventDate not null order by EventDate desc"
            )
            # open db and connect
            self.OpenConn()
            self.db.row_factory = sqlite3.Row
            c = self.db.cursor()
            c.execute(myQuery)
            rows = c.fetchall()
            # We can also close the connection if we are done with it.
            self.CloseConn()
            return rows
        except Exception as error:
            self.errorString = "read_status Error " + str(error)

    # --------------------------------------------------------------------------------------------
    # read the triggers table from the db and reset the values
    def read_reset_triggers(self):
        try:
            return_value = [False for i in range(8)]  # we will return up to 8 triggers
            # define the query
            myQuery = "select * from triggers desc"
            # open db and connect
            self.OpenConn()
            self.db.row_factory = sqlite3.Row
            c = self.db.cursor()
            c.execute(myQuery)
            rows = c.fetchall()
            # set the triggers on the return values
            for row in rows:
                if row[1] == 1:
                    return_value[row[0]] = True
            # We can also close the connection if we are done with it.
            myQuery = "UPDATE triggers SET trigger = 0;"
            c.execute(myQuery)
            # Save (commit) the changes
            self.db.commit()
            self.CloseConn()
            return return_value
        except Exception as error:
            self.errorString = "read_reset_triggers Error " + str(error)

    # --------------------------------------------------------------------------------------------
    # read the triggers table from the db and reset the values
    def set_triggers(self, index, value):
        try:
            self.OpenConn()
            c = self.db.cursor()
            myQuery = (
                "UPDATE triggers set trigger ="
                + str(value)
                + " where id ="
                + str(index)
                + ";"
            )
            c.execute(myQuery)
            # Save (commit) the changes
            self.db.commit()
            self.CloseConn()
        except Exception as error:
            self.errorString = "set_triggers Error " + str(error)
