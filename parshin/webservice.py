#!/web/tdymkru/python/bin/python2.6
# -*- coding: utf-8 -*-
# This Python file uses the following encoding: utf-8

import sys, os
import cgi
import cgitb; cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))
reload(sys)
sys.setdefaultencoding('utf-8')

from suds.client import Client
from suds.cache import DocumentCache
#from suds.sax.element import Element
#from suds import WebFault
import logging
logging.basicConfig(level=logging.INFO)
if __debug__:
    logging.getLogger('suds.client').setLevel(logging.DEBUG)
else:
    logging.getLogger('suds.client').setLevel(logging.CRITICAL)
    
print ("Content-Type: text/html; charset=utf-8")
print ("")

form = cgi.FieldStorage()

if (form.has_key("likecondition")):
    likecondition = form["likecondition"].value
else:
    likecondition = "пельмени"
    
likeex = "%" + likecondition + "%"
 
client = Client('http://195.239.221.58:30080/Parshin_YMK_UT_Copy/ws/map.1cws?wsdl', location = "http://195.239.221.58:30080/Parshin_YMK_UT_Copy/ws/map.1cws")
client.set_options(cache=DocumentCache())
result = client.service.GetAddress(likeex)

for adress in result[0]:
    print adress[0] + ';'


