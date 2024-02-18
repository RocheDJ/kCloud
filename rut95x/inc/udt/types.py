
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

# enum that defines the value type of the json variable
class reportType(Enum):
    alarm = 1
    batch_start = 2
    batch_stop = 3

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
    


class PostStepType(Enum):
    init =0
    load_config =1
    login=2
    read_local_data_pvo=3
    post_local_data_pvo=4
    ack_local_data_pvo=5
    read_local_data_pdo=6
    post_local_data_pdo=7
    ack_local_data_pdo=8
    read_remote_command=9
    process_remote_command=10
    ack_remote_command=11
    wait=12
    error=999
    

#PVO data type 
# title = what the process variable is called
# unit = text of the unit of variable measurement
# value type = ordinal from valueType class 
# value = actual value
# port = iolink port number
# node = iolink node number     
PVOType = collections.namedtuple('PVOType', 'title unit valuetype value port node')
