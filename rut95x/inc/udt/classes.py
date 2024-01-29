import signal

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



# class that allows the handling of shutdown and start up signals
# based on article from https://oxylabs.io/blog/python-script-service-guide
class SignalHandler:
    shutdown_requested = False
    
    def __init__(self):
        signal.signal(signal.SIGINT, self.request_shutdown)
        signal.signal(signal.SIGTERM, self.request_shutdown)

    def request_shutdown(self, *args):
        print('Request to shutdown received, stopping')
        self.shutdown_requested = True

    def can_run(self):
        return not self.shutdown_requested