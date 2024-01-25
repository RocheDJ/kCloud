# Status String Property
class status_class:
    def __init__(self,status) -> None:
        self._status = status
        self._cycle_time =0.0
    # getter function
    def get_status(self):
        return self._status

    # setter function
    def set_status(self, value):
        self._status = value

# getter function
    def get_cycle_time(self):
        return self._cycle_time

    # setter function
    def set_cycle_time(self, value):
        self._cycle_time = value
    # Set property() to use get_, set_  methods
    status = property(get_status, set_status)
    cycle_time = property(get_cycle_time, set_cycle_time)