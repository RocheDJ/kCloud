
from enum import Enum
import collections

# enum that defines the value type of the json variable
class valueType(Enum):
    string = 1
    bool = 2
    int16 = 3
    int32 = 4
    real = 5
    longReal = 6

class MainStepType(Enum):
    init =0
    load_config =2
    start_web_client=3
    start_web_server=4
    read_inputs=5
    check_event_triggers=6
    check_timed_triggers=7
    control_logic=8
    write_outputs=9
    wait=10
    error=999
    



#PVO data type as defined in data mode     
PVOType = collections.namedtuple('PVOType', 'title unit valuetype value port')
