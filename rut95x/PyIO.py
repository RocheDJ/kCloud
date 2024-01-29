#!/bin/python3
# --------------------------------------------------------------------------------------------------------------------
# Date: January 2024
# Description : Edge Application for K Cloud RUT95x Teltonika Router
# -------------------------------------------------------------------------------------------------------------------
# ./PyIO.py
# ------------------------------------------  Import Decelerations -------------------------------------------------
# Python Libs
from datetime import datetime
from os import kill
from time import sleep
from multiprocessing import Process
from multiprocessing.sharedctypes import Value, Array

# User Defined Libs
import settings
from inc.udt.types import MainStepType
from inc import IOLink
from inc.udt.classes import PVO_ValueClass , SignalHandler
from inc.udt.dbClass import dbClass
from inc.udt.status import status_class
from web_server import runWebServer

# ------------------------------------------ Variables              -------------------------------------------------
sqliteDB = dbClass()
main_status = status_class("")

# ------------------------------------------ Methods                -------------------------------------------------


def modify(sString):
    sString.value = sString.value.upper()


# --start the web interface to run as a separate process
def startWEBServer(iPort, sStatus):
    runWebServer(iPort, sStatus)


# --start the web interface to run as a separate process
def log_status():
    sqliteDB.update_status(1, main_status.status,main_status.cycle_time)
    sqliteDB.update_status(2, "Web Server Status ToDo:",999.9)


# --- Read IO link Data from Network -------------
def Inputs(aOldReadings):
    try:
        # temporally load only 5 data points
        # ToDo: make PVO points dynamic
        for x in (1, 2, 3, 4, 5):
            dataJSON = IOLink.IoLink_Read_PVO(x)
            sError = dataJSON["error"]
            if sError != "":
                main_status.status = "Main App  :  Input Error : " + str(sError)

            if (
                aOldReadings[x - 1].value != dataJSON["data"][0]["value"]
            ):  # if the data has changed then
                # save to the local DB
                sqliteDB.update_PVO_Live(dataJSON, x)
                aOldReadings[x - 1].value = dataJSON["data"][0]["value"]
               
            
    except Exception as error:
        if settings.DEBUG:
            main_status.status = "Main App  :  UpdateReading Error : " + str(error)

# ------------------------------------------ Main Control Sequence -------------------------------------------------
def main_sequence():
    udtMainStep = MainStepType(MainStepType.init)
    udtMainStepOld = udtMainStep
    xNewStep = 0
    xDebugOn = settings.DEBUG
    fStepInterval = 0.500  # 100 ms
    aPrevValues = []  # an array of previous values of inputs so we cna detect a change
    pWebServer = Process(
        target=startWEBServer, args=(8080, xDebugOn)
    )  # start beb server as seperate process
    dtCycleStart = datetime.now()
    dtCycleStop = datetime.now()
    # handles systemd calls in linux
    signal_handler = SignalHandler()
    
    while signal_handler.can_run():
        # ----------------------   Step 0  ---------------------
        if udtMainStep == MainStepType.init:
            for x in (1, 2, 3, 4, 5):
                # initialise the array of values by addling a pvo_value class object with an inital value of 0
                PVO_PreviousValue = PVO_ValueClass(0)
                aPrevValues.append(PVO_PreviousValue)
            if xDebugOn:
                main_status.status = "Main Sequence  :  Init: "
            udtMainStep = MainStepType.load_config
        # ----------------------   Step 1  ---------------------
        elif udtMainStep == MainStepType.load_config:
            if xDebugOn:
                main_status.status = "Main Sequence  :  Load Config: "
            udtMainStep = MainStepType.start_web_client
        # ----------------------   Step 2  ---------------------
        elif udtMainStep == MainStepType.start_web_client:
            if xDebugOn:
                main_status.status = "Main Sequence  :  Start Web Client: "
            udtMainStep = MainStepType.start_web_server
        # ----------------------   Step 3  ---------------------
        elif udtMainStep == MainStepType.start_web_server:
            if xDebugOn:
                main_status.status = "Main Sequence  :  Start Web Server: "
            pWebServer.start()
            udtMainStep = MainStepType.read_inputs
        # ----------------------   Step 4  ---------------------
        elif udtMainStep == MainStepType.read_inputs:
            if xNewStep:
                dtCycleStart = datetime.now()
                Inputs(aPrevValues)
            udtMainStep = MainStepType.check_event_triggers
        # ----------------------   Step 5  ---------------------
        elif udtMainStep == MainStepType.check_event_triggers:
            udtMainStep = MainStepType.check_timed_triggers
        # ----------------------   Step 6  ---------------------
        elif udtMainStep == MainStepType.check_timed_triggers:
            udtMainStep = MainStepType.control_logic
        # ----------------------   Step 7  ---------------------
        elif udtMainStep == MainStepType.control_logic:
            udtMainStep = MainStepType.write_outputs
        # ----------------------   Step 8  ---------------------
        elif udtMainStep == MainStepType.write_outputs:
            udtMainStep = MainStepType.wait
        # ----------------------   Step 9  ---------------------
        elif udtMainStep == MainStepType.wait:
            if xNewStep:
                dtCycleStop = datetime.now()
                delta_time= datetime.now() - dtCycleStart
                fSeconds = float(delta_time.total_seconds())
                dtCycleTime = fSeconds
               
            # Do we have any time left oer to sleep    
            if (fSeconds <  fStepInterval): 
                fSleep =fStepInterval -fSeconds
                sleep(fSleep)
                
            main_status.cycle_time = dtCycleTime
            log_status()  # log status to updates
            udtMainStep = MainStepType.read_inputs

        # ----------------------   Step 999  -------------------
        elif udtMainStep == MainStepType.error:
            if xDebugOn:
                main_status.status = "Main Sequence  :  ERROR : "

            log_status()
            sleep(fStepInterval)  # wait 100 ms
            udtMainStep = MainStepType.init

        # ----------------------   Catch All  -----------------
        else:
            udtMainStep = MainStepType.init

        # ------  Check for step change  ---------------------
        if udtMainStep == udtMainStepOld:
            xNewStep = 0
        else:
            xNewStep = 1
            udtMainStepOld = udtMainStep

    # end of while tidy up app
    print('Closing Local Web Server')
    pWebServer.terminate() # stop the web server process
    pWebServer.join() #Wait for it to stop
    print('Application Halted')
# ------------------------  Call main Sequence    -----------------------------------------------
if __name__ == "__main__":
    main_sequence()
