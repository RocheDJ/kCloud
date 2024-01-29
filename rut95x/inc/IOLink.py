#!/usr/bin/python3
#-------------------------------------------------------------------------------------------------------------------
# ./inc/IOLink.py
#-------------------------------------------------------------------------------------------------------------------
# IOLink read data from an 4 Port IO link Master AL1350 with the following configuration
# Port 1 - 
# Port 2 - 
# Port 3 -
# Port 4 - 
#-------------------------------------------------------------------------------------------------------------------

import requests
import settings

from inc.udt import types

#------------------------------------------    Constants      ------------------------------------------------------
IOLINK_TOUT = settings.IOLINK_TOUT

#-------------------------------------------------------------------------------------------------------------------
# define the data for the io link ports
#   ref https://stackoverflow.com/questions/6198372/most-pythonic-way-to-provide-global-configuration-variables-in-config-py
Pvo_Config= lambda Port,Sensor,Description,Unit,Datatype:{'Port':Port,'Sensor':Sensor,'Description':Description,'Unit':Unit,'Datatype':Datatype}

IOLINK_PVO= {1 : Pvo_Config(1,'TV7105',"Outlet Temperature", "C",types.valueType.real),
             2 : Pvo_Config(2,'LDL100', "Conductivity", "uS",types.valueType.real),
             3:  Pvo_Config(2,'LDL100',"Temperature", "C",types.valueType.real),
             4 : Pvo_Config(3,'DI',"Agitator", "QI",types.valueType.bool),
             5 : Pvo_Config(4,'LR2750',"Volume", "L",types.valueType.real)
            }

#----------------------------------------------------------------------------------------------------------------------

#FUNCTION TO RETURN API PATH FOR GIVEN PORT AND NODE
def IolinkMakeProcessVariablePath(Node,Port,SensorType):
    if SensorType == 'DI':
         sUrlBase = 'http://' +str(settings.IP4_BASE) + '.' + str(Node) + '/iolinkmaster/port[' + str(Port)+ ']/pin2in/getdata'
    else:
        sUrlBase = 'http://' +str(settings.IP4_BASE) + '.' + str(Node) + '/iolinkmaster/port[' + str(Port)+ ']/iolinkdevice/pdin/getdata' #eg http://172.17.17.106/iolinkmaster/port[1]/iolinkdevice/pdin/getdata
    return sUrlBase

#----------------------------------------------------------------------------------------------------------------------

#Function to recode raw input values depending on SensorType and values
def IOLinkDecodeValues(SensorType_In,ProcessData_In):
    if SensorType_In =='TV7105':
         # Process data is 32 bits long
         # add 0x as prefix to hex which will allow Python to decode base automatically
         # first 16 bits are Temperature 10 Word0
         # eg 00C8FF00 = 00C8,FF00
         sHexTemperature = '0x' + ProcessData_In[0:4] #s = s[ beginning : beginning + LENGTH]
         # the next 8 bits have the SCALE
         sHexScale = '0x' + ProcessData_In[5:7]
         #convert the hex value to integer
         iDataValue = int(ProcessData_In,32) # ,0 invokes get base from hex value 
         if (iDataValue != 32764): # 
            iWord0 = int(sHexTemperature,0)
            fDegC = iWord0 * 0.1
            temperature = round(fDegC, 1)
         else:
            temperature = -70.0 # deafult out of limit tempriture
         return temperature
    
    if SensorType_In =='LDL100':
        # Process data is 96 bits long
        # add 0x as prefix to hex which will allow Python to decode base automatically
        # First 32 bits are Conductivity Word 0 and Word 1
        # Next  16 bits are Scale COND Word 2 LSB not Used
        # next  32 are Temperature Word 3 and Word 4
        # Next  16 bits are Scale Temp and Device Status Word 5
        # eg 00000000FC00000000CFFF00 = 0000,0000,FC00,0000,00CF,FF00
        # Conductivity   
        sHexConductivity = '0x' + ProcessData_In[0:8] #s = s[ beginning : beginning + LENGTH]
        iDWord0 = int(sHexConductivity,0) # convert the Value to an integer
        sHexConductivityScale = '0x' + ProcessData_In[8:10] #s = s[ beginning : beginning + LENGTH]
        fConductivity = iDWord0 * 0.1 # value is scaled by 0.1
        conductivity = round(fConductivity, 1)  # 0 decimal place required
        #Temp                
        sHexTemperature = '0x' + ProcessData_In[13:20] #s = s[ beginning : beginning + LENGTH]
        iDWord1 = int(sHexTemperature,0)
        fDegC = iDWord1 * 0.1
        temperature = round(fDegC, 1)
        sHexTemperatureScale = '0x' + ProcessData_In[20:22] #s = s[ beginning : beginning + LENGTH]
        sHexDeviceStatus = '0x' + ProcessData_In[23:24] # 0 = OK, 
                                                      # 1 = Maintenance required
                                                      # 2 = Out Of Spec
                                                      # 4 = Function Check
                                                      # 5 = Faiure
        return conductivity,temperature

    if SensorType_In=='DI':
        #note for digital input neet to set mode on IOlink master first
        #    http://172.17.17.106/iolinkmaster/port[3]/mode/getdata
       
        iWord0 = ProcessData_In # convert the Value to an integer
        if iWord0 >=1 :
            return 1
        else:
            return 0    
        
    if SensorType_In =='LR2750':
         # Process data is 16 bits long
         # add 0x as prefix to hex which will allow Python to decode base automatically
         # first 2 bits are Output States
         sHexData = '0x' + ProcessData_In 
         #convert the hex value to integer
         iDataValue = int(ProcessData_In,16) # ,0 invokes get base from hex value
       
         # shift right twice to get rit of first two bits
         iDataValue = iDataValue//2
         iDataValue = iDataValue//2 
         if (iDataValue <= 1970): # from iodd sheet range 10 to 1970
            if iDataValue <10:
                iDataValue =0
            # assume tank is 500 L which is 
            fFullVolume = 500 # full volume
            fFullMM     = 250 # full mm
            # scale the values
            rRatio =  iDataValue / fFullMM
            rVolume =  fFullVolume *  rRatio
            volume = round(rVolume, 1)
         else:
            if (iDataValue == 8189):
                level = fFullVolume # full
            else:
                level = -99 # default out of limit level
         return volume   
    return -99 # return catch all error

#----------------------------------------------------------------------------------------------------------------------

def IoLink_Read_PVO(PVO_INDEX):
    try:
        # default IS no error string
        sError = ""
        
        iIOLinkPort = IOLINK_PVO[PVO_INDEX].get('Port')
        
        udtPVO = types.PVOType(IOLINK_PVO[PVO_INDEX].get('Description'), IOLINK_PVO[PVO_INDEX].get('Unit'),
                                 IOLINK_PVO[PVO_INDEX].get('Datatype').value,0,IOLINK_PVO[PVO_INDEX].get('Port'))
      
        sNode = settings.IOLINK_NODE_1
        sSensorType = IOLINK_PVO[PVO_INDEX].get('Sensor')
        sApiUrl = IolinkMakeProcessVariablePath(sNode,iIOLinkPort,sSensorType)
        iResponse = requests.get(sApiUrl, timeout=int(IOLINK_TOUT))  # send request to IOlink master
        
        # Read Port Data values
        # read the temp values
        if iResponse:
            iResponseCode = iResponse.status_code  # read the response code
            if iResponseCode == 200:
                oJson = iResponse.json()  # read the json response string
                iIOLinkCode = oJson['code']
                if iIOLinkCode == 200:
                    hexDataValue = oJson['data']['value']  # read the process data value from the system
                    # scale the raw values locally for now
                    if PVO_INDEX == 1:  # TV7105 Temp sensor
                        # make the pvoData
                        TempPVO = list(udtPVO) #cant edit a touple so convert to list          
                        TempPVO[3] =    IOLinkDecodeValues(sSensorType,hexDataValue)
                        # convert back to the type
                        udtPVO = types.PVOType(TempPVO[0],TempPVO[1],TempPVO[2],TempPVO[3],iIOLinkPort)
                        
                    if PVO_INDEX == 2:  # LDL100 - conductivity
                        TempPVO = list(udtPVO) #cant edit a touple so convert to list          
                        Cond,Temp = IOLinkDecodeValues(sSensorType,hexDataValue)
                        TempPVO[3] = Cond
                        udtPVO = types.PVOType(TempPVO[0],TempPVO[1],TempPVO[2],TempPVO[3],iIOLinkPort)
                        
                    if PVO_INDEX == 3:  # LDL100 - Temp
                        TempPVO = list(udtPVO) #cant edit a touple so convert to list          
                        Cond,Temp = IOLinkDecodeValues(sSensorType,hexDataValue)
                        TempPVO[3] = Temp
                        udtPVO = types.PVOType(TempPVO[0],TempPVO[1],TempPVO[2],TempPVO[3],iIOLinkPort)
                        
                    if PVO_INDEX == 4:  #
                        TempPVO = list(udtPVO) #
                        TempPVO[3] = IOLinkDecodeValues(sSensorType,hexDataValue)
                        udtPVO = types.PVOType(TempPVO[0],TempPVO[1],TempPVO[2],TempPVO[3],iIOLinkPort)
                        
                    if PVO_INDEX == 5:  #
                        TempPVO = list(udtPVO) #
                        TempPVO[3] = IOLinkDecodeValues(sSensorType,hexDataValue)
                        udtPVO = types.PVOType(TempPVO[0],TempPVO[1],TempPVO[2],TempPVO[3],iIOLinkPort)
                else:
                    sError = "Error On Port " + str(iIOLinkPort) + " code " + str(iIOLinkCode)
            else:
                sError = "Error Reading Port " + str(iIOLinkPort)
      
        # complex message
        # add pvo data to list
        sJSONData = {
            "error": str(sError),
            "data": [
                {
                    "title": udtPVO.title,
                    "unit": udtPVO.unit,
                    "valueType": udtPVO.valuetype,
                    "value": udtPVO.value,
                }
            ]
        }
        return sJSONData
    except Exception as sError:
        sJSONData = {
            "error": "Error in IoLink_Read_PVO, unknown , check connection to master.",
            "data": [
                {
                    "title": udtPVO.title,
                    "unit": udtPVO.unit,
                    "valueType": udtPVO.valuetype,
                    "value": udtPVO.value,
                }
            ]
        }
       
        return sJSONData #