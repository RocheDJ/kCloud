#!/usr/bin/python3
#-------------------------------------------------------------------------------------------------------------------
# ./PyIO.py
#-------------------------------------------------------------------------------------------------------------------
# ------------------------------------------  Import Decelerations -------------------------------------------------
# Python Libs
from flask import Flask, request, render_template # use flash for rendering web pages
from flask_cors import CORS
from inc.udt import types
from inc.udt.dbClass import dbClass
from apscheduler.schedulers.background import BackgroundScheduler

app = Flask(__name__)
CORS(app)

webServerDB = dbClass()

# ------------------------------------------ Methods                -------------------------------------------------
def testPVOValues():# read the updates list of PVO values from the Database
     sJSONData = {
            "error": "Place holder routine for reading data",
            "data": [
                {
                    "title": "Tank_Temperature",
                    "unit": "C",
                    "valueType": types.valueType.real,
                    "value":25.6,
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
                }
            ]
        }
     return sJSONData
    
# ------------------------------------------ Web Routes             -------------------------------------------------
# local index page
 
@app.route('/') 
def home():
    return render_template('index.html')
# local list page
# ToDo: add reference to https://pythonbasics.org/flask-sqlite/
@app.route('/list') 
def list():
    myRows = webServerDB.read_PVO_Live()
    myCount = 6
    return render_template('list.html', rows=myRows,count = myCount)
#------------------------------------------ Web Server              -------------------------------------------------
def runWebServer(ServerPort,xDebugMode):
    try:
        webServerDB = dbClass()
        app.run(host='0.0.0.0', port=ServerPort)
        if xDebugMode:
            print("Web Server  :  Running on port : " + str(ServerPort))
    except Exception as error:
        if xDebugMode:
            print("Web Server  :  runWebServer Error : " + str(error))