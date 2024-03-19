import signal
from datetime import datetime
#-------------------------------------------------------------------------------
# User defined classes
# define a static class to hold previous values

class PVO_ValueClass(object):
    """Represents the Value of a PVO object"""
    class_Index =1
    value = 0.0
    def __init__(self,value):
        PVO_ValueClass.class_Index += 1
        self.class_Index = PVO_ValueClass.class_Index +1
        self.value=value

#-------------------------------------------------------------------------------
# class that allows the handling of shutdown and start up signals
# based on article from https://oxylabs.io/blog/python-script-service-guide
class SignalHandler:
    shutdown_requested = False
    ProcessName = ''
    def __init__(self,inProcessName):
        self.ProcessName = inProcessName
        signal.signal(signal.SIGINT, self.request_shutdown)
        signal.signal(signal.SIGTERM, self.request_shutdown)

    def request_shutdown(self, *args):
        print('Request to shutdown received, stopping-' + self.ProcessName)
        self.shutdown_requested = True

    def can_run(self):
        return not self.shutdown_requested

#-------------------------------------------------------------------------------
# Step class
class step_class:
    def __init__(self) -> None: # -> is an annotation that describes what type the class will return
                                # -> in this case when it is declared it wont return anything
        self._step = 0
    # getter function
    def get_step(self):
        return self._step

    # setter function
    def set_step(self, value):
        self._step = value

    # Set property() to use get_, set_  methods
    step = property(get_step, set_step)

#-------------------------------------------------------------------------------
# Digital IO class list 8
class io_eight_class:
    def __init__(self) -> list: # -> is an annotation that describes what type the class will return
                                # -> in this case a list
        self.value = [False for i in range (8)] 
#-------------------------------------------------------------------------------
# List of DateTimes size 4    
class dt_three_class:
    def __init__(self) -> list: # -> is an annotation that describes what type the class will return                               # -> in this case a list
        self.value = [datetime.utcnow() for i in range (4)] 
#-------------------------------------------------------------------------------  
# List of floats size 8
class aio_eight_class:
    def __init__(self) -> list: # -> is an annotation that describes what type the class will return
                                # -> in this case a list
        self.value = [0.0 for i in range (8)] 
