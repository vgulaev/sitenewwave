#!/web/tdymkru/python/bin/python2.6
# -*- coding: utf-8 -*-
# This Python file uses the following encoding: utf-8
import sys, os
import cgitb; cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))

from suds.client import Client
from suds.cache import DocumentCache
from suds.sax.element import Element
from suds import WebFault
import logging
logging.basicConfig(level=logging.INFO)
if __debug__:
    logging.getLogger('suds.client').setLevel(logging.DEBUG)
else:
    logging.getLogger('suds.client').setLevel(logging.CRITICAL)
    
print ("Content-Type: text/html; charset=utf-8")
print ("")
    
print("<!DOCTYPE html>")

client = Client('http://192.168.194.14/Parshin_YMK_UT_Copy/ws/map.1cws?wsdl')
client.set_options(cache=DocumentCache())

result = client.service.HelloWorld()
print result

result = client.service.GetAddress()
print result
