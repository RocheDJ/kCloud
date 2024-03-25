#!/bin/python3
# --------------------------------------------------------------------------------------------------------------------
# Author: David Roche
# Date: January 2024
# Description : Control Code for Pasto
# -------------------------------------------------------------------------------------------------------------------
# ./inc/Control.py
# ------------------------------------------  Import Decelerations -------------------------------------------------
# Python Libs
# -------------------------------------------------------------------------------------------
from datetime import datetime

# -------------------------------------------------------------------------------------------
# -------------------------------------------------------------------------------------------
# how many minutes have we been running
# agitator runs one minute every 3 minutes
# so if the total minutes ran is devisable by 3 without a remainder
# run the agitator
def Calc_OneInThree(dStartTime):
    now = datetime.now()
    dtDiff = now - dStartTime
    iRuntime = dtDiff.total_seconds()
    minutes = divmod(iRuntime, 60)
    iRemainder = divmod(minutes[0], 3)  # 3*60
    if iRemainder[1] == 0.0:
        return True
    return False
# -------------------------------------------------------------------------------------------
def Control_Sequence(
    step,
    sdIn,
    dOut,
    aIn,
    dStartTime_StopTime,
    iHoldTime,
    iTempTarget,
    MaxMaxHeatTimeOut,
):
    # init
    if step.step == 0:
        # kill all outputs
        for i in dOut.value:
            i = False
        step.step += 1
    # Wait
    elif step.step == 1:
        # wait for triggers
        # Start the processes ?
        if sdIn.value[1]:  # Process Start Trigger
            step.step = 10
            sdIn.value[1] = False
        elif sdIn.value[3]:  # Agitator Start Trigger
            sdIn.value[3] = False
            dOut.value[0] = True  #  Agitator on
        elif sdIn.value[4]:  # Agitator Stop Trigger
            sdIn.value[4] = False
            dOut.value[0] = False  #  Agitator off

    # start the batch process
    elif step.step == 10:
        dOut.value[1] = True  #  Heater On
        dStartTime_StopTime.value[0] = datetime.utcnow()
        step.step = 20
        print("Starting Batch")
    # run the process ramp up to temp
    elif step.step == 20:
        xAgitator = Calc_OneInThree(dStartTime_StopTime.value[0])
        if xAgitator and dOut.value[0] == False:
            dOut.value[0] = True
            print("Activating Agitator")

        if xAgitator == False and dOut.value[0] == True:
            dOut.value[0] = False
            print("Stopping Agitator")

        dtDiff = datetime.utcnow() - dStartTime_StopTime.value[0]
        iRunTime = dtDiff.seconds
        if aIn.value[2] >= iTempTarget:
            dStartTime_StopTime.value[2] = datetime.utcnow()  # set the hold start time
            step.step = 30
        elif sdIn.value[2]:  # Stop the process
            dStartTime_StopTime.value[3] = datetime.utcnow()
            step.step = 990
        elif iRunTime > MaxMaxHeatTimeOut:  # Stop the process not heating
            dStartTime_StopTime.value[3] = datetime.utcnow()
            step.step = 991
    # hold the temp for time
    elif step.step == 30:
        dOut.value[2] = Calc_OneInThree(
            dStartTime_StopTime.value[2]
        )  # agitator on one in 3
        dtDiff = datetime.utcnow - dStartTime_StopTime.value[2]
        iRunTime = dtDiff.seconds
        if iRunTime > iHoldTime:
            dStartTime_StopTime.value[3] = datetime.utcnow()
            step.step == 40
        elif sdIn.value[2]:  # Stop the process
            step.step = 990
    elif step.step == 40:
        dOut.value[0] = False  #  Heater Off
        dOut.value[1] = False  #  Agitator off
        step = 0
    elif step.step == 990:

        dOut.value[0] = False  #  Heater Off
        dOut.value[1] = False  #  Agitator off
        print("Process Stopped by user")
        step.step = 0
    elif step.step == 991:
        dOut.value[0] = False  #  Heater Off
        dOut.value[1] = False  #  Agitator off
        print("Process Stopped heater not working")
        step.step = 0
