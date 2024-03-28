#!/usr/bin/python3
# ------------------------------------------------------------------------------------------------------------------
# # Author: David Roche
# Date: February 2024
# Description : Web API Client
# ------------------------------------------------------------------------------------------------------------------
# ./web_client.py
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
from inc.udt.classes import SignalHandler

# ------------------------------------------- Variables -------------------------------------------------------------
web_post_status = status_class("")
from time import sleep

xEnableProcess = False
sqliteDB = dbClass()

# ------------------------------------------------------------------------------------------------------------
signal_handler = SignalHandler("kCloud_Client")


# -------------------------------------------- Methods -------------------------------------------------------
def post_pvo(data_in):
    try:

        headers = {'Content-type': 'application/json', 'Accept': 'text/plain', "Authorization": "Bearer " + sToken}
        sApiUrl = settings.API_POST_ENDPOINT + "PVO"

        jData = json.loads(data_in['jData'])

        # Construct the JSON object
        dataJSON = {'InstallationID': data_in['InstallationID'],
                    'NodeID': "%i" % data_in['NodeID'],
                    'PortID': "%i" % data_in['PortID'],
                    'EventDate': data_in['EventDate'],
                    'jData': jData,
                    'error': data_in['error']
                    }
        jsonData = json.dumps(dataJSON, indent=2, ensure_ascii=False)
        response = requests.post(url=sApiUrl, data=jsonData, headers=headers, timeout=10)
        responseCode = response.status_code
        if (responseCode == 200):  # all good
            web_post_status.status = "kCloud Client :  POST PVO OK"
            return 200
        else:
            web_post_status.status = "kCloud Client :  POST PVO CODE : %s" % responseCode
            return responseCode
    except Exception as error:
        if settings.DEBUG:
            web_post_status.status = "kCloud Client :  POST PVO: " + str(error)
            return 999


# ------------------------------------------------------------------------------------------------------------
def update_pvo_status(id, code):
    try:
        sqliteDB.logStatus_Of_PVO_to_DB(id, code)

    except Exception as error:
        if settings.DEBUG:
            web_post_status.status = "kCloud Client :  update_pvo_status Error : " + str(error)


# ------------------------------------------------------------------------------------------------------------
def post_pdo(data_in):
    try:

        headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
        sApiUrl = settings.API_POST_ENDPOINT + "PDO"
        jData = json.loads(data_in['jData'])
        # Construct the JSON object
        dataJSON = {'InstallationID': "%s" % data_in['InstallationID'],
                    'EventDate': data_in['EventDate'],
                    'StructureID': "%i" % data_in['Type'],
                    'Version': "%f" % data_in['Version'],
                    'jData': jData
                    }
        jsonData = json.dumps(dataJSON, indent=2, ensure_ascii=False)
        response = requests.post(url=sApiUrl, data=jsonData, headers=headers, timeout=10)
        responseCode = response.status_code
        if (responseCode == 200):  # all good
            web_post_status.status = "kCloud Client :  POST PDO OK"
            return 200
        else:
            web_post_status.status = "kCloud Client :  post_pdo response Error : %s" % responseCode
            return responseCode
    except Exception as error:
        if settings.DEBUG:
            web_post_status.status = "kCloud Client :  post_pdo Error : " + str(error)
            return 999


# ------------------------------------------------------------------------------------------------------------
def update_pdo_status(id, code):
    try:
        sqliteDB.logStatus_Of_PDO_to_DB(id, code)

    except Exception as error:
        if settings.DEBUG:
            web_post_status.status = "kCloud Client :   update_pdo_status Error : " + str(error)


# ------------------------------------------------------------------------------------------------------------
def get_cdo():
    try:

        headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
        sApiUrl = settings.API_POST_ENDPOINT + "CDO/" + settings.INSTALLATION_ID

        response = requests.get(url=sApiUrl, timeout=10)
        responseCode = response.status_code
        if (responseCode == 200):  # request received ok
            oJson = response.json()
            web_post_status.status = "kCloud Client : get_cdo OK"
            return oJson
        else:
            web_post_status.status = "kCloud Client :   post_pdo response Error : %s" % responseCode
            return []
    except Exception as error:
        if settings.DEBUG:
            web_post_status.status = "kCloud Client :  post_pdo Error : " + str(error)
            return []


# ------------------------------------------------------------------------------------------------------------
def put_cdo(sCommandID, iCode):
    try:

        headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
        sApiUrl = settings.API_POST_ENDPOINT + "CDO/" + str(sCommandID) + "/" + str(iCode)

        response = requests.put(url=sApiUrl, timeout=10)
        responseCode = response.status_code
        if (responseCode == 200):  # request received ok
            oJson = response.json()
            return oJson
        else:
            web_post_status.status = "kCloud Client :   post_pdo response Error : %s" % responseCode
            return []
    except Exception as error:
        if settings.DEBUG:
            web_post_status.status = "kCloud Client :   post_pdo Error : " + str(error)
            return []


# ------------------------------------------------------------------------------------------------------------
def call_set_trigger(iIndex, iValue):
    sqliteDB.set_triggers(iIndex, iValue)


# ------------------------------------------------------------------------------------------------------------
def update_status():
    sString = web_post_status.status


# ------------------------------------------------------------------------------------------------------------
def get_user_token(email, password):
    try:
        headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
        sApiUrl = settings.API_POST_ENDPOINT + "user/authenticate"
        # Construct the JSON object
        dataJSON = {'email': email,
                    'password': password
                    }
        jsonData = json.dumps(dataJSON, indent=2, ensure_ascii=False)

        response = requests.post(url=sApiUrl, data=jsonData, headers=headers, timeout=10)
        responseCode = response.status_code

        if (responseCode == 200):  # User OK
            oJson = response.json()

            if oJson['success']:
                token = oJson['token']
                global sToken
                sToken = token
                settings.set_token(sToken)

            return 200
        else:
            web_post_status.status = "kCloud Client :  POST PVO CODE : %s" % responseCode
            return responseCode
    except Exception as error:
        if settings.DEBUG:
            web_post_status.status = "kCloud Client :  POST PVO: " + str(error)
            return 999


# --------------------------------------------Main sequence --------------------------------------------------
def web_client_sequence():
    udtPostStep = PostStepType(PostStepType.init)
    udtPostStepOld = udtPostStep
    xNewStep = 0
    fWaitInterval = 1.00  # 1 second
    fErrorInterval = 30.0
    xDebug = settings.DEBUG
    aDataRows = []
    iRowsToPost = 0
    iRowsPosted = 0
    iPostResponseCode = 0
    aCommandReceived = []
    iRemoteCommandAckCode = 999
    iRemoteCommandID = 0
    while signal_handler.can_run():
        try:
            # ----------------------   Step 0  ---------------------
            if udtPostStep == PostStepType.init:
                udtPostStep = udtPostStep.load_config
            # ----------------------   Step 1  ---------------------
            elif udtPostStep == PostStepType.load_config:
                udtPostStep = udtPostStep.login
            # ----------------------   Step 2  ---------------------
            elif udtPostStep == PostStepType.login:
                if (get_user_token(settings.API_POST_USER, settings.API_POST_PASSWORD) == 200):
                    udtPostStep = udtPostStep.read_local_data_pvo
                else:
                    udtPostStep = udtPostStep.PostStepType.error

            # -----------   Read Data from DB  ---------------------
            elif udtPostStep == PostStepType.read_local_data_pvo:
                if xNewStep:
                    iRowsToPost = 0
                    iRowsPosted = 0
                    aDataRows = []
                    if xDebug:
                        web_post_status.status = "kCloud Client :   Reading Local pvo"

                aDataRows = sqliteDB.read_outStanding_PVO()
                iRowsToPost = len(aDataRows)
                if (iRowsToPost > 0):
                    udtPostStep = PostStepType.post_local_data_pvo
                else:
                    udtPostStep = PostStepType.read_local_data_pdo
            # ----------- POST DATA to API SERVER--------------------
            elif udtPostStep == PostStepType.post_local_data_pvo:
                if xNewStep:
                    iPostResponseCode = post_pvo(aDataRows[iRowsPosted])

                udtPostStep = PostStepType.ack_local_data_pvo
            # ------------ Put API Response In DB--------------------
            elif udtPostStep == PostStepType.ack_local_data_pvo:
                if xNewStep:
                    update_pvo_status(aDataRows[iRowsPosted]['_id'], iPostResponseCode)
                    iRowsPosted = iRowsPosted + 1

                if iRowsPosted >= iRowsToPost:
                    udtPostStep = PostStepType.read_local_data_pdo
                else:
                    udtPostStep = PostStepType.post_local_data_pvo
            # ------------Read Data from DB  ---------------------
            elif udtPostStep == PostStepType.read_local_data_pdo:
                if xNewStep:
                    iRowsPosted = 0
                    aDataRows = []
                    if xDebug:
                        web_post_status.status = "kCloud Client :   Reading Local pdo"

                aDataRows = sqliteDB.read_outStanding_PDO()
                iRowsToPost = len(aDataRows)
                if (iRowsToPost > 0):
                    udtPostStep = PostStepType.post_local_data_pdo
                else:
                    udtPostStep = PostStepType.read_remote_command
            # ----------- POST DATA to API SERVER--------------------
            elif udtPostStep == PostStepType.post_local_data_pdo:
                if xNewStep:
                    iPostResponseCode = post_pdo(aDataRows[iRowsPosted])

                udtPostStep = PostStepType.ack_local_data_pdo

            # ------------ Put API Response In DB--------------------
            elif udtPostStep == PostStepType.ack_local_data_pdo:
                if xNewStep:
                    update_pdo_status(aDataRows[iRowsPosted]['_id'], iPostResponseCode)
                    iRowsPosted = iRowsPosted + 1

                if iRowsPosted >= iRowsToPost:
                    udtPostStep = PostStepType.read_remote_command
                else:
                    udtPostStep = PostStepType.post_local_data_pdo
            # ------------ check web server for commands ------------
            elif udtPostStep == PostStepType.read_remote_command:
                if xNewStep:
                    aCommandReceived = []
                    aCommandReceived = get_cdo()
                if len(aCommandReceived) > 1:
                    udtPostStep = PostStepType.process_remote_command
                else:
                    udtPostStep = PostStepType.wait
            # ------------ Process the CDO              ------------
            elif udtPostStep == PostStepType.process_remote_command:
                if (aCommandReceived['jData']['output'] == 'trigger'):
                    iRemoteCommandID = aCommandReceived['id']
                    iIndex = aCommandReceived['jData']['index']
                    iValue = aCommandReceived['jData']['value']
                    call_set_trigger(iIndex, iValue)
                    iRemoteCommandAckCode = 303
                else:
                    iRemoteCommandAckCode = 999

                udtPostStep = PostStepType.ack_remote_command
            # ------------- post and ack command ------------------
            elif udtPostStep == PostStepType.ack_remote_command:
                put_cdo(iRemoteCommandID, iRemoteCommandAckCode)
                udtPostStep = PostStepType.wait
            # ------------ Idle and Wait ---------------------
            elif udtPostStep == PostStepType.wait:
                sleep(fWaitInterval)
                update_status();
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
                web_post_status.status = "kCloud Client :   post_Sequence Error : " + str(error)

            udtPostStep == PostStepType.error


# end of while tidy up app


# logging.info("ALI client sequence Exited")

# ------------------------------------------ POST Client     -------------------------------------------------
def run_web_client():
    try:
        print("API client sequence Start")
        web_client_sequence()
        print("API client sequence Stop")
    except Exception as error:
        web_post_status.status = "kCloud Client :   post_Sequence Error : " + str(error)
