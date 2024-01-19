
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



