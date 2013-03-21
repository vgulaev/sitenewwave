#!/web/trimet/python/bin/python2.6
# -*- coding:utf-8 -*-

import sys, os
import cgi
import cgitb; cgitb.enable()

sys.path.insert(0, os.path.expanduser('~/site/python'))
reload(sys)
sys.setdefaultencoding('utf-8')

# print ("Content-Type: text/html; charset=utf-8\n")

import json
from suds.client import Client
from suds.cache import DocumentCache

import logging
logging.basicConfig(level=logging.INFO)
if __debug__:
    logging.getLogger('suds.client').setLevel(logging.DEBUG)
else:
    logging.getLogger('suds.client').setLevel(logging.CRITICAL)

_DEVELOPING_ADDRESS_ = "http://192.168.194.14/DemoTrimet/ws/"
_PRODUCTION_ADDRESS_ = "http://195.239.221.58:30080/DemoTrimet/ws/"

if "dev" in os.environ["SERVER_NAME"]:
    _CURRENT_ADDRESS_ = _DEVELOPING_ADDRESS_
else:
    _CURRENT_ADDRESS_ = _PRODUCTION_ADDRESS_

class User1C():
    def __init__(self):
        pass

    def register_user_1c(self, email, passwd):
        # print email, " | ", passwd
        client = Client(_CURRENT_ADDRESS_+"Register.1cws?wsdl", location = _CURRENT_ADDRESS_+"Register.1cws")
        client.set_options(cache=DocumentCache())

        username = ""
        fullname = ""

        result = client.service.AddUser(email,passwd,email,fullname)

        return result

    def authorize_user_1c(self, email, passwd):
        client = Client(_CURRENT_ADDRESS_+"PrivetOffice.1cws?wsdl", location = _CURRENT_ADDRESS_+"PrivetOffice.1cws")
        client.set_options(cache=DocumentCache())

        result = client.service.Authorize(email,passwd,"")

        return result


def __main__(funkt=False):
    return eval(funkt)