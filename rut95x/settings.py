#!/usr/bin/
# ./settings.py

from decouple import config
from unipath import Path

BASE_DIR = Path(__file__).parent

DEBUG = config("DEBUG", default=False, cast=bool)

INSTALLATION_ID = config("INSTALLATION_ID", default="Not Set")

IOLINK_TOUT = config("IOLINK_TOUT", default=0.5, cast=float)

UPLOAD_CYCLIC_SEC = config("UPLOAD_CYCLIC_SEC", default=60.0, cast=float)

IP4_BASE = config("IP4_BASE", default="172.17.17")

IOLINK_NODE_1 = config("IOLINK_NODE_1", default="106")

SQLITE_DB = config("SQLITE_DB", "installation.db")

IOLINK_PVO_MAX = config("IOLINK_PVO_MAX", default=6, cast=int)
# log data locally every ten seconds when batch is running
PVO_LOG_INTERVAL_RUN = config("PVO_LOG_INTERVAL", default=10.0, cast=float)
# log data locally every 60 seconds when batch is idle
PVO_LOG_INTERVAL_IDLE = config("PVO_LOG_INTERVAL_IDLE", default=60.0, cast=float)

API_POST_ENDPOINT = config("API_POST_EndPoint")
