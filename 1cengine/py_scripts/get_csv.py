#!/web/trimetru/python/bin/python2.6
# -*- coding:utf-8 -*-

import sys
import os

import cgitb
cgitb.enable()

sys.path.insert(0, os.path.expanduser('~/site/python'))
reload(sys)
sys.setdefaultencoding('utf-8')

print ("Content-Type: text/html; charset=utf-8\n")

from suds.client import Client
from suds.cache import DocumentCache

import logging
logging.basicConfig(level=logging.INFO)
if __debug__:
    logging.getLogger('suds.client').setLevel(logging.DEBUG)
else:
    logging.getLogger('suds.client').setLevel(logging.CRITICAL)

_DEVELOPING_ADDRESS_ = "http://192.168.194.14/fedorov_trimet_ut/ws/"
# _DEVELOPING_ADDRESS_ = "http://192.168.194.14/trimet_trade/ws/"
_PRODUCTION_ADDRESS_ = "http://195.239.221.58:30080/trimet_trade/ws/"

print "Hello, getting started<br />"

_CURRENT_ADDRESS_ = _PRODUCTION_ADDRESS_

client = Client(_CURRENT_ADDRESS_ + "price1c.1cws?wsdl",
                location=_CURRENT_ADDRESS_ + "price1c.1cws")
client.set_options(cache=DocumentCache())

print "forming new price<br />"

result = client.service.GetCSV()

print "trying get csv file<br />"

file_csv_server = "http://195.239.221.58:30080/download/price.csv"
file_csv_site = "/web/trimetru/site/www/import/price.csv"

import requests

r = requests.get(file_csv_server)
with open(file_csv_site, "wb") as csv:
    csv.write(r.content)


print "CSV successfully loaded"
