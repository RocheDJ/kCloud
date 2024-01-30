#!/usr/bin/python3
# -------------------------------------------------------------------------------------------------------------------
# ./PyIO.py
# -------------------------------------------------------------------------------------------------------------------
# ------------------------------------------  Import Decelerations -------------------------------------------------
# Python Libs
from flask import Flask, request, render_template  # use flash for rendering web pages
from flask_cors import CORS
from inc.udt import types
from inc.udt.dbClass import dbClass
from inc.udt.status import status_class
from multiprocessing.sharedctypes import Value
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
    myRows = webServerDB.read_status()
    return render_template("index.html",rows=myRows)

# -------------------------------------------------------------------------------------------------------------------
# local list page
# ToDo: add reference to https://pythonbasics.org/flask-sqlite/
@app.route("/list")
def list():
    myRows = webServerDB.read_pvo_live()
    myCount = 6
    return render_template("list.html", rows=myRows, count=myCount)

# -------------------------------------------------------------------------------------------------------------------
# local list page
@app.route("/trend")
def trend():
    return render_template("trend.html")


# ------------------------------------------ Web Server              -------------------------------------------------
def runWebServer(ServerPort, xDebugMode):
    try:
        webServerDB = dbClass()
        web_server_status.status ='Web Server  :  Running on port : '+ str(ServerPort)
        app.run(host="0.0.0.0", port=ServerPort)
       
    except Exception as error:
         web_server_status.status = "Web Server  :  runWebServer Error : " + str(error)
