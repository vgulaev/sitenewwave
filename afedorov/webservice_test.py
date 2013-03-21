#!/web/trimet/python/bin/python2.6
# -*- coding: utf-8 -*-

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

_CURRENT_ADDRESS_ = _DEVELOPING_ADDRESS_

def get_order_list_test():

    # date_from = "2010-05-05"
    date_from = None
    date_to = None
    UID = "5f719f9e-3b78-4f83-8b3e-6a64cbc84206"

    client = Client(_DEVELOPING_ADDRESS_+'privetoffice.1cws?wsdl', location = _DEVELOPING_ADDRESS_+"privetoffice.1cws")
    client.set_options(cache=DocumentCache())


    result = client.service.OrderLists(UID,date_from,date_to)

    orders = ""
    i = 0
    for order in result[2][0]:
        print """
            <div class="orderItem """+str(i)+""" ">
                <div>
                    <span class="openOrderDownload">"""+str(order[3])+"""</span>
                    <span>"""+str(order[2])+"""</span>
                    <span class="orderDate">"""+str(order[1].split(" ")[0])+"""</span>
                </div>

                <p class="orderDownload">
                    Скачать заказ: 
                    <a href='javascript:openLink(\""""+str(order[0])+"""\","xlsx")' title="Скачать заказ в формате xls"> xls </a>
                    <a href='javascript:openLink(\""""+str(order[0])+"""\","pdf")' title="Скачать заказ в формате pdf"> pdf </a>
                    <a href='javascript:openLink(\""""+str(order[0])+"""\","odf")' title="Скачать заказ в формате ods"> ods </a>
                </p>
            </div>
        """
        i = i + 1

def create_1c_user_test():

    client = Client(_CURRENT_ADDRESS_+"Register.1cws?wsdl", location = _CURRENT_ADDRESS_+"Register.1cws")
    client.set_options(cache=DocumentCache())

    username = "test"
    fullname = "test"
    passwd = "test"
    email = "test"

    result = client.service.AddUser(email,passwd,email,fullname)

    return result

def authorize_user_1c_test():
    client = Client(_CURRENT_ADDRESS_+"PrivetOffice.1cws?wsdl", location = _CURRENT_ADDRESS_+"PrivetOffice.1cws")
    client.set_options(cache=DocumentCache())

    email = "q1"
    passwd = "8e35c2cd3b"

    result = client.service.Authorize(email,passwd[:10],"")

    return result



print authorize_user_1c_test()