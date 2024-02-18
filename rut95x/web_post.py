#!/usr/bin/python3
# ------------------------------------------------------------------------------------------------------------------
# # Author: David Roche
# Date: January 2024
# Description : Control Code for Pasto
# ------------------------------------------------------------------------------------------------------------------
# ./web_post.py
# ------------------------------------------  Import Decelerations -------------------------------------------------
# Python Libs
# ------------------------------------------------------------------------------------------------------------------
import requests
import settings
import json
# -------------------------------------------------------------------------------------------
# local Libs
# -------------------------------------------------------------------------------------------
from inc.udt.status import status_class
from inc.udt.types import PostStepType
from inc.udt.dbClass import dbClass
# ------------------------------------------- Variables -------------------------------------------------------------
web_post_status = status_class("")
from time import sleep
xEnableProcess = False
sqliteDB = dbClass()
# ------------------------------------------------------------------------------------------------------------
# -------------------------------------------- Methods -------------------------------------------------------
def post_pvo(data_in):
    try:
        headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
        sApiUrl =settings.API_POST_ENDPOINT + "PVO"

        jData =  json.loads(data_in['jData']) 

        # Construct the JSON object
        dataJSON = {'InstallationID': data_in['InstallationID'],
                    'NodeID': "%i" % data_in['NodeID'],
                    'PortID':  "%i" % data_in['PortID'],
                    'EventDate':  data_in['EventDate'],
                    'jData': jData,
                    'error': data_in['error']
                    }
        jsonData = json.dumps(dataJSON, indent=2,ensure_ascii=False)
        response = requests.post(url=sApiUrl, data=jsonData,headers=headers)
        responseCode = response.status_code
        if (responseCode == 200):  # all good
            return 200
        else:
            web_post_status.status = "Post App  :  post_pvo response Error : %s" % responseCode
            return responseCode
    except Exception as error:
        if settings.DEBUG:
            web_post_status.status = "Post App  :  post_pvo Error : " + str(error)
            return 999
# ------------------------------------------------------------------------------------------------------------
def update_pvo_status(id,code):
    try:
       sqliteDB.logStatus_Of_PVO_to_DB(id,code)

    except Exception as error:
        if settings.DEBUG:
            web_post_status.status = "Post App  :  update_pvo_status Error : " + str(error)
# ------------------------------------------------------------------------------------------------------------
def post_pdo(data_in):
    try:

        headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
        sApiUrl =settings.API_POST_ENDPOINT + "PDO"
        jData =  json.loads(data_in['jData']) 
        # Construct the JSON object
        dataJSON = {'InstallationID':  "%s" % data_in['InstallationID'],
                    'EventDate':  data_in['EventDate'],
                    'StructureID': "%i" % data_in['Type'],
                    'Version':  "%f" % data_in['Version'],
                    'jData': jData
                    }
        jsonData = json.dumps(dataJSON, indent=2,ensure_ascii=False)
        response = requests.post(url=sApiUrl, data=jsonData,headers=headers)
        responseCode = response.status_code
        if (responseCode == 200):  # all good
            return 200
        else:
            web_post_status.status = "Post App  :  post_pdo response Error : %s" % responseCode
            return responseCode
    except Exception as error:
        if settings.DEBUG:
            web_post_status.status = "Post App  :  post_pdo Error : " + str(error)
            return 999
# ------------------------------------------------------------------------------------------------------------
def update_pdo_status(id,code):
    try:
       sqliteDB.logStatus_Of_PDO_to_DB(id,code)

    except Exception as error:
        if settings.DEBUG:
            web_post_status.status = "Post App  :  update_pdo_status Error : " + str(error)
                      
# --------------------------------------------Main sequence --------------------------------------------------
def post_Sequence():
    udtPostStep = PostStepType(PostStepType.init)
    udtPostStepOld = udtPostStep
    xNewStep = 0
    fWaitInterval = 1.00  # 1 second
    fErrorInterval = 30.0
    xDebug =settings.DEBUG
    aDataRows = []
    iRowsToPost = 0
    iRowsPosted = 0
    iPostResponseCode = 0
    while True:
        try:
            # ----------------------   Step 0  ---------------------
            if udtPostStep == PostStepType.init:
                udtPostStep = udtPostStep.load_config
            # ----------------------   Step 1  ---------------------
            elif udtPostStep == PostStepType.load_config:
                udtPostStep = udtPostStep.login
            # ----------------------   Step 2  ---------------------
            elif udtPostStep == PostStepType.login:
                udtPostStep = udtPostStep.read_local_data_pvo
            # -----------   Read Data from DB  ---------------------
            elif udtPostStep == PostStepType.read_local_data_pvo:
                if xNewStep :
                    iRowsToPost = 0
                    iRowsPosted = 0 
                    aDataRows =[]
                    if xDebug :
                        web_post_status.status = "Post App  :  Reading Local pvo"
            
                aDataRows = sqliteDB.read_outStanding_PVO()
                iRowsToPost = len(aDataRows)     
                if (iRowsToPost >0):
                    udtPostStep = PostStepType.post_local_data_pvo
                else:
                    udtPostStep = PostStepType.read_local_data_pdo
            # ----------- POST DATA to API SERVER--------------------
            elif udtPostStep == PostStepType.post_local_data_pvo:
                if xNewStep :    
                    iPostResponseCode = post_pvo(aDataRows[iRowsPosted])
            
                udtPostStep = PostStepType.ack_local_data_pvo
            # ------------ Put API Response In DB--------------------
            elif udtPostStep == PostStepType.ack_local_data_pvo:
                if xNewStep :
                    update_pvo_status(aDataRows[iRowsPosted]['_id'],iPostResponseCode)
                    iRowsPosted = iRowsPosted +1  

                if iRowsPosted>= iRowsToPost :
                    udtPostStep = PostStepType.read_local_data_pdo
                else:
                    udtPostStep = PostStepType.post_local_data_pvo
            # ------------Read Data from DB  ---------------------
            elif udtPostStep == PostStepType.read_local_data_pdo:
                if xNewStep :
                    iRowsPosted = 0 
                    aDataRows =[]
                    if xDebug :
                        web_post_status.status = "Post App  :  Reading Local pdo"
            
                aDataRows = sqliteDB.read_outStanding_PDO()
                iRowsToPost = len(aDataRows)     
                if (iRowsToPost >0):
                    udtPostStep = PostStepType.post_local_data_pdo
                else:
                    udtPostStep = PostStepType.wait
            # ----------- POST DATA to API SERVER--------------------
            elif udtPostStep == PostStepType.post_local_data_pdo:
                if xNewStep :    
                    iPostResponseCode = post_pdo(aDataRows[iRowsPosted])
            
                udtPostStep = PostStepType.ack_local_data_pdo

             # ------------ Put API Response In DB--------------------
            elif udtPostStep == PostStepType.ack_local_data_pdo:
                if xNewStep :
                    update_pdo_status(aDataRows[iRowsPosted]['_id'],iPostResponseCode)
                    iRowsPosted = iRowsPosted +1  

                if iRowsPosted>= iRowsToPost :
                    udtPostStep = PostStepType.wait
                else:
                    udtPostStep = PostStepType.post_local_data_pdo
            # ------------ Idle and Wait ---------------------
            elif udtPostStep == PostStepType.wait:   
                sleep(fWaitInterval) 
                udtPostStep = udtPostStep.read_local_data_pvo
            # ----------------------   Step 999  ---------------------
            elif udtPostStep == PostStepType.error:
                sleep(fErrorInterval)  
                udtPostStep = udtPostStep.init

            # ----------------------   Catch All  -----------------
            else:
                udtPostStep = udtPostStep.init

            # ------  Check for step change  ---------------------
            if udtPostStep == udtPostStepOld:
                xNewStep = 0
            else:
                xNewStep = 1
                udtPostStepOld = udtPostStep

        except Exception as error:
            if settings.DEBUG:
                web_post_status.status = "Post App  :  post_Sequence Error : " + str(error)
            udtPostStep == PostStepType.error

    # end of while tidy up app


print("Closing POST Client")


# ------------------------------------------ POST Client     -------------------------------------------------
def runWebPost():
    try:
        post_Sequence()
    except Exception as error:
        web_post_status.status = "Post App  :  post_Sequence Error : " + str(error)
