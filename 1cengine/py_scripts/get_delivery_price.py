#!/web/trimetru/python/bin/python2.6
# -*- coding: utf-8 -*-

import sys
import os
import cgi

import imp
import cgitb
cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))
reload(sys)
sys.setdefaultencoding('utf-8')

print("Content-Type: text/html; charset=utf-8\n")

import json
from suds.client import Client
from suds.cache import DocumentCache

import logging
logging.basicConfig(level=logging.INFO)
if __debug__:
    logging.getLogger('suds.client').setLevel(logging.DEBUG)
else:
    logging.getLogger('suds.client').setLevel(logging.CRITICAL)


_DEVELOPING_ADDRESS_ = "http://192.168.194.14/fedorov_trimet_ut/ws/"
# _DEVELOPING_ADDRESS_ = "http://192.168.194.14/DemoTrimet/ws/"
_PRODUCTION_ADDRESS_ = "http://195.239.221.58:30080/DemoTrimet/ws/"

if "dev" in os.environ["SERVER_NAME"]:
    _CURRENT_ADDRESS_ = _DEVELOPING_ADDRESS_
else:
    _CURRENT_ADDRESS_ = _PRODUCTION_ADDRESS_


def get_delivery_price():

    client = Client(_CURRENT_ADDRESS_ + 'OrderKlient.1cws?wsdl',
                    location=_CURRENT_ADDRESS_ + "OrderKlient.1cws")

    # client.set_options(cache=None)
    client.set_options(cache=DocumentCache())

    result = client.service.GetDeliveryPrice()

    # try:
    #     result = client.service.GetDeliveryPrice()
    # except:
    #     return "<p>Ошибка в работе с веб сервисом</p>"

    delivery_dict = {}

    for x in result[0]:
        if x[0] in delivery_dict:
            delivery_dict[x[0]][x[1]] = x[2]
        else:
            delivery_dict[x[0]] = {x[1]: x[2]}

        # print x[0], " - ", x[1], " - ", x[2], "<br />--<br />"

    print delivery_dict

    # return result

get_delivery_price()
