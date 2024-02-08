#!/bin/python3
# --------------------------------------------------------------------------------------------------------------------
# Author: David Roche
# Date: January 2024
# Description : Core file for Edge Application for K Cloud RUT95x Teltonika Router
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
from inc.udt.types import MainStepType, reportType
from inc import IOLink
from inc.udt.classes import (
    PVO_ValueClass,
    SignalHandler,
    step_class,
    io_eight_class,
    dt_three_class,
    aio_eight_class,
)
from inc.udt.dbClass import dbClass
from inc.udt.status import status_class
from web_server import runWebServer
from inc.Control import Control_Sequence

# ------------------------------------------ Variables              -------------------------------------------------
sqliteDB = dbClass()
main_status = status_class("")
old_process_outputs = io_eight_class()
process_inputs = aio_eight_class()
process_times = dt_three_class()  # start,hold start,stop time for process
hold_temperature = 72
hold_seconds = 600
# ------------------------------------------ Methods                -------------------------------------------------


# --start the web interface to run as a separate process
def startWEBServer(iPort, sStatus):
    runWebServer(iPort, sStatus)


# --start the web interface to run as a separate process
def log_status():
    sqliteDB.update_status(1, main_status.status, main_status.cycle_time)
    sqliteDB.update_status(2, "ToDo: Web Server Status ", 999.9)


# --- Read IO link Data from Network -------------
def Read_Inputs_Physical(aInputs, aPvoList, xFirstRead):
    try:
        # temporally load only 5 data points
        # ToDo: make PVO points dynamic
        for x in range(settings.IOLINK_PVO_MAX):
            dataJSON = IOLink.IoLink_Read_PVO(x)
            sError = dataJSON["error"]
            if sError != "":
                main_status.status = "Main App  :  Input Error : " + str(sError)
            if (aInputs.value[x - 1] != dataJSON["data"][0]["value"]) or (xFirstRead):
                sqliteDB.update_PVO_Live(dataJSON, x)
                aPvoList[x] = dataJSON
                aInputs.value[x - 1] = dataJSON["data"][0]["value"]
    except Exception as error:
        if settings.DEBUG:
            main_status.status = "Main App  :  UpdateReading Error : " + str(error)


# --- Read IO link Data from Network -------------
def Read_Inputs_Software(oTriggers):
    try:
        triggers = sqliteDB.read_reset_triggers()
        for x in [0, 1, 2, 3, 4]:
            oTriggers.value[x] = triggers[x]

    except Exception as error:
        if settings.DEBUG:
            main_status.status = "Main App  :  Read_Inputs_Software Error : " + str(
                error
            )


# --- Write Outputs to Network -------------
def Write_Outputs_Physical(aOutputs):
    try:
        for x in range(8):
            if old_process_outputs.value[x] != aOutputs.value[x]:
                # ToDo: Add configurable reference table of outputs
                # we only have two here so map as out 0 to port 3 and out 1 to port 4
                iPort = x + 3
                IOLink.IoLink_Write_DQ(settings.IOLINK_NODE_1, iPort, aOutputs.value[x])
                old_process_outputs.value[x] = aOutputs.value[x]
    except Exception as error:
        if settings.DEBUG:
            main_status.status = "Main App  :  Write_Outputs_Physical Error : " + str(
                error
            )


# --- Write process report Object
def make_report(report_type, stepCode):  # start,hold start,stop time for process
    try:
        # batch start
        if report_type == reportType.batch_start:
            # make the report
            sJSONData = {
                "Batch_Start": str(process_times.value[0]),
                "Start_Temperature": str(process_inputs.value[1]),
                "Start_Volume": str(process_inputs.value[3]),
                "Hold_Temperature": str(hold_temperature),
                "Hold_Duration": str(hold_seconds),
            }
            return sJSONData
        # batch stop
        if report_type == reportType.batch_stop:
            # make the report
            batch_code = 3
            dtDiff = process_times.value[2] - process_times.value[0]
            Batch_Duration = dtDiff.seconds
            if stepCode.step == 990:  # stopped by user
                batch_code = 1
            if stepCode.step == 991:  # stopped by user
                batch_code = 2
            if stepCode.step == 40:  # stopped by user
                batch_code = 0
            sJSONData = {
                "Batch_Start": str(process_times.value[0]),
                "Hold_Start": str(process_times.value[1]),
                "Batch_Stop": str(process_times.value[2]),
                "Temperature": str(process_inputs.value[1]),
                "Stop_Volume": str(process_inputs.value[3]),
                "Batch_Duration": str(Batch_Duration),
                "Batch_Code": str(batch_code),
            }
            return sJSONData

    except Exception as error:
        if settings.DEBUG:
            main_status.status = "Main App  :  make_report Error : " + str(error)


# ------------------------------------------ Main Control Sequence -------------------------------------------------
def main_sequence():

    udtMainStep = MainStepType(MainStepType.init)
    udtMainStepOld = udtMainStep
    xNewStep = 0
    xDebugOn = settings.DEBUG
    iMaxPVO = 6
    fStepInterval = 0.500  # 100 ms
    # start web server as separate process
    pWebServer = Process(target=startWEBServer, args=(8080, xDebugOn))
    # variables to calculate cycle time
    dtCycleStart = datetime.now()
    dtCycleStop = datetime.now()
    dtLastLog = datetime.now()
    # handles systemd calls in linux to allow for controlled shutdown
    signal_handler = SignalHandler()
    # control Sequence Variables
    max_heating_time = 300
    control_step = step_class()  #

    trigger_inputs = io_eight_class()
    process_outputs = io_eight_class()
    aPVO = [{} for x in range(settings.IOLINK_PVO_MAX)]  # List to hold JSONS ?

    xFirstRead = True
    # -----------------------------------------
    while signal_handler.can_run():
        # ----------------------   Step 0  ---------------------
        if udtMainStep == MainStepType.init:
            sqliteDB.create_PVO_Live(iMaxPVO)  # create the local tables
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

            Read_Inputs_Physical(process_inputs, aPVO, xFirstRead)
            Read_Inputs_Software(trigger_inputs)
            xFirstRead = False  # always log the first read
            udtMainStep = MainStepType.check_event_triggers

        # ----------------------   Step 5  ---------------------
        elif udtMainStep == MainStepType.check_event_triggers:
            if xNewStep:
                xWriteReport = False
                if control_step.step == 10:  # new batch starting step of control
                    my_report_type = reportType.batch_start
                    xWriteReport = True

                if (
                    (control_step.step == 40)
                    or (control_step.step == 990)
                    or (control_step.step == 991)
                ):  # batch stop
                    my_report_type = reportType.batch_stop
                    xWriteReport = True

                if xWriteReport:
                    sjData = make_report(my_report_type, control_step)
                    sqliteDB.log_PDO_to_DB(sjData, my_report_type, 1.00)

            udtMainStep = MainStepType.check_timed_triggers

        # ----------------------   Step 6  ---------------------
        elif udtMainStep == MainStepType.check_timed_triggers:
            # check log interval setting so we log data at set interval
            dtDiff = datetime.utcnow() - dtLastLog
            iTime = dtDiff.seconds
            if iTime >= settings.PVO_LOG_INTERVAL_IDLE:
                for x in range(settings.IOLINK_PVO_MAX):
                    sqliteDB.log_PVO_to_DB(aPVO[x])

                dtLastLog = datetime.utcnow()  # save last log time

            udtMainStep = MainStepType.control_logic
        # ----------------------   Step 7  ---------------------
        elif udtMainStep == MainStepType.control_logic:
            Control_Sequence(
                control_step,
                trigger_inputs,
                process_outputs,
                process_inputs,
                process_times,
                hold_seconds,
                hold_temperature,
                max_heating_time,
            )
            udtMainStep = MainStepType.write_outputs
        # ----------------------   Step 8  ---------------------
        elif udtMainStep == MainStepType.write_outputs:

            Write_Outputs_Physical(process_outputs)
            udtMainStep = MainStepType.wait
        # ----------------------   Step 9  ---------------------
        elif udtMainStep == MainStepType.wait:
            if xNewStep:
                dtCycleStop = datetime.now()
                delta_time = datetime.now() - dtCycleStart
                fSeconds = float(delta_time.total_seconds())
                dtCycleTime = fSeconds

            # Do we have any time left oer to sleep
            if fSeconds < fStepInterval:
                fSleep = fStepInterval - fSeconds
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
    print("Closing Local Web Server")
    pWebServer.terminate()  # stop the web server process
    pWebServer.join()  # Wait for it to stop
    print("Application Halted")


# ------------------------  Call main Sequence    -----------------------------------------------
if __name__ == "__main__":
    main_sequence()
