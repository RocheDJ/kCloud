#!/usr/bin/
# ./settings.py

from decouple import config
from unipath import Path

BASE_DIR = Path(__file__).parent

DEBUG = config('DEBUG', default=False, cast=bool)

INSTALLATION_ID = config('INSTALLATION_ID', default='Not Set')

IOLINK_TOUT = config('IOLINK_TOUT',default=1.0, cast=float)

UPLOAD_CYCLIC_SEC = config('UPLOAD_CYCLIC_SEC', default=60.0, cast=float)

IP4_BASE = config('IP4_BASE', default='172.17.17')

IOLINK_NODE_1 = config('IOLINK_NODE_1',default='106')

SQLITE_DB = config('SQLITE_DB', 'installation.db')