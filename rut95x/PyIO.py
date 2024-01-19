#!/bin/python3
#--------------------------------------------------------------------------------------------------------------------
# Date: January 2024
# Description : Edge Application for K Cloud RUT95x teltonika Router 
#-------------------------------------------------------------------------------------------------------------------
# ./PyIO.py
# ------------------------------------------  Import Decelerations -------------------------------------------------
# Python Libs
from datetime import datetime
from time import sleep

# User Defined Libs
import settings
from inc.udt.types import MainStepType
from inc import IOLink
from inc.udt.classes import PVO_ValueClass
from inc.udt.dbClass import dbClass


# ------------------------------------------ Variables              -------------------------------------------------
sqliteDB = dbClass()

# ------------------------------------------ Methods                -------------------------------------------------

# ------------------------------------------ Read IO link Data from Network -----------------------------------------
def Inputs(aOldReadings):
    try:
       # tempeorrylu load only 5 data points
       # ToDo: make PVO points dynamic 
       for x in(1,2,3,4,5):
        dataJSON=IOLink.IoLink_Read_PVO(x)
        if (aOldReadings[x-1].value != dataJSON["data"][0]["value"]): # if the data has changed then
         # save to the local DB
          sqliteDB.update_PVO_Live(dataJSON,x)
          aOldReadings[x-1].value = dataJSON["data"][0]["value"]
          print("Main App  :  Input  : " + str(x) + " value ="+ str(dataJSON["data"][0]["value"]))
    except Exception as error:
        if settings.DEBUG:
            print("Main App  :  UpdateReading Error : " + str(error))



# ------------------------------------------ Main Control Sequence -------------------------------------------------
def mainsequence():
    udtMainStep = MainStepType(MainStepType.init)
    udtMainStepOld = udtMainStep
    xNewStep = 0
    xDebugOn = settings.DEBUG
    fStepInterval = 0.1 # 100 ms
    aPrevValues = [] # an array of previous values of inputs so we cna detect a change
    while True:
        # ----------------------   Step 0  ---------------------
        if udtMainStep == MainStepType.init:
            for x in(1,2,3,4,5):
              #initalise the array of values by addaing a pvo_value class object with an inital value of 0
              PVO_PreviousValue = PVO_ValueClass(0)
              aPrevValues.append(PVO_PreviousValue)
            if xDebugOn :
                print( "Main Sequence  :  Init: " )    
            udtMainStep = MainStepType.load_config
        # ----------------------   Step 1  ---------------------
        elif udtMainStep == MainStepType.load_config:
             if xDebugOn :
                print( "Main Sequence  :  Load Config: " )    
             udtMainStep = MainStepType.start_web_client
        # ----------------------   Step 2  ---------------------
        elif udtMainStep == MainStepType.start_web_client:
             if xDebugOn :
                print( "Main Sequence  :  Start Web Client: " )
             udtMainStep = MainStepType.start_web_server
        # ----------------------   Step 3  ---------------------
        elif udtMainStep == MainStepType.start_web_server:
            if xDebugOn :
                print( "Main Sequence  :  Start Web Server: " )
            udtMainStep = MainStepType.read_inputs
        # ----------------------   Step 4  ---------------------
        elif udtMainStep == MainStepType.read_inputs:
            if xNewStep:
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
            sleep(fStepInterval)   #wait 100 ms    
            udtMainStep = MainStepType.read_inputs
        # ----------------------   Step 999  -------------------
        elif udtMainStep == MainStepType.error:
            if xDebugOn :
                print( "Main Sequence  :  ERROR : " )
            sleep(fStepInterval)   #wait 100 ms   
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
        
        

# ------------------------  Call main Sequence    -----------------------------------------------
if __name__ == '__main__':
    mainsequence()

