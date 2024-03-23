#!/usr/bin/python3
# -------------------------------------------------------------------------------------------------------------------
# # Author: David Roche
# Date: January 2024
# Description : Web Server code for local host
# -------------------------------------------------------------------------------------------------------------------
# ./web_server.py
# ------------------------------------------  Import Decelerations -------------------------------------------------
# Python Libs
from flask import Flask, request, render_template  # use flash for rendering web pages
from flask_cors import CORS
from multiprocessing import shared_memory
# -------------------------------------------------------------------------------------------
# local Libs
# -------------------------------------------------------------------------------------------
from inc.udt import types
from inc.udt.dbClass import dbClass
from inc.udt.status import status_class

# -------------------------------------------------------------------------------------------
app = Flask(__name__)

CORS(app)

webServerDB = dbClass()
# ------------------------------------------- Variables -------------------------------------------------------------
web_server_status = status_class("")


# ------------------------------------------ Methods                -------------------------------------------------
def testPVOValues():  # read the updates list of PVO values from the Database
    sJSONData = {
        "error": "Place holder routine for reading data",
        "data": [
            {
                "title": "Tank_Temperature",
                "unit": "C",
                "valueType": types.valueType.real,
                "value": 25.6,
            },
            {
                "title": "Tank_Volume",
                "unit": "L",
                "valueType": types.valueType.real,
                "value": 256.2,
            },
            {
                "title": "Agitator_Active",
                "unit": "DI",
                "valueType": types.valueType.bool,
                "value": 0,
            },
        ],
    }
    return sJSONData


# ------------------------------------------ Web Routes             -------------------------------------------------
# local index page
@app.route("/")
def home():
    sStatus = bytes(sm_main_status.buf[:150]).decode('utf-8')
    aStatus = sStatus.split(";")
    sEventDate = aStatus[0]
    sStatus = aStatus[1]
    sCycleTime = aStatus[2]
    return render_template("index.html", EventDate = sEventDate, Status = sStatus, CycleTime=sCycleTime)


# -------------------------------------------------------------------------------------------------------------------
# local list page
# ToDo: add reference to https://pythonbasics.org/flask-sqlite/
@app.route("/list")
def list():
    myRows = webServerDB.read_pvo_live()
    myCount = 6
    return render_template("list.html", rows=myRows, count=myCount)


# -------------------------------------------------------------------------------------------------------------------
# get value current live PVO's
@app.route("/list/read", methods=["GET"])
def list_read():
    jData = webServerDB.read_pvo_live_JSON()

    if jData == 999:
        return 400
    return jData, 200


# -------------------------------------------------------------------------------------------------------------------
# local trend page
@app.route("/trend")
def trend():
    return render_template("trend.html")


# -------------------------------------------------------------------------------------------------------------------
# get value of single variable between start date and stop date
@app.route("/data/read", methods=["GET"])
def data_read():
    pdoKey = request.args.get("pvoKey")
    StartDate = request.args.get("StartDate")
    StopDate = request.args.get("StopDate")

    jData = webServerDB.read_PVO_specific(pdoKey, StartDate, StopDate)

    if jData == 999:
        return 400
    return jData, 200


# -------------------------------------------------------------------------------------------------------------------
# set a trigger value on the db to start stop process/agitator
@app.route("/trigger/set", methods=["POST"])
def trigger_set():
    content_type = request.headers.get("Content-Type")
    setIndex = request.args.get("index")
    setValue = request.args.get("value")
    webServerDB.set_triggers(setIndex, setValue)
    sData = "Done"
    return sData, 200

# -----------------------------------------------------------------------------------------------------
# ------------------------------------------ Web Server              -------------------------------------------------
def runWebServer(ServerPort, smStatus): # smStatus is shared memory
    try: 
        global sm_main_status
        sm_main_status = smStatus
        web_server_status.status = "Web Server  :  Running on port : " + str(ServerPort)
        print("Web Server Start")
        app.run(host="0.0.0.0", port=ServerPort)
        smStatus.close()
        smStatus.unlink()
        print("Web Server Stop")
    except Exception as error:
        web_server_status.status = "Web Server  :  runWebServer Error : " + str(error)
# ------------------------------------------ Web Server              -------------------------------------------------

