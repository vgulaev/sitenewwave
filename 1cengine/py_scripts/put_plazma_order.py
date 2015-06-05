#!/usr/bin/python
# -*- coding: utf-8 -*-

import sys
import os

import base64

import cgitb
cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))
reload(sys)
sys.setdefaultencoding('utf-8')

print("Content-Type: text/html; charset=utf-8\n")

from suds.client import Client
from suds.cache import DocumentCache

import logging
logging.basicConfig(level=logging.INFO)
if __debug__:
    logging.getLogger('suds.client').setLevel(logging.DEBUG)
else:
    logging.getLogger('suds.client').setLevel(logging.CRITICAL)


# _DEVELOPING_ADDRESS_ = "http://192.168.194.27/trimet_trade_fedorov/ws/"
_DEVELOPING_ADDRESS_ = "http://192.168.194.27/trimet_trade_fedorov/ws/"
_PRODUCTION_ADDRESS_ = "http://195.239.221.58:30082/trimet_trade/ws/"

# if "dev" in os.environ["SERVER_NAME"]:
#     _CURRENT_ADDRESS_ = _DEVELOPING_ADDRESS_
# else:
#     _CURRENT_ADDRESS_ = _PRODUCTION_ADDRESS_


_CURRENT_ADDRESS_ = _DEVELOPING_ADDRESS_


# post = {}

# if "POST_DATA" in os.environ:
#     raw_post = os.environ["POST_DATA"]
# else:
#     raw_post = sys.stdin.read()

# if raw_post != "":
#     if "&amp;" in raw_post:
#         pre_post = raw_post.split("&amp;")
#     else:
#         pre_post = raw_post.split("&")
#     # print pre_post
#     for variables in pre_post:
#         # print variables
#         key_var = str(variables).split("=")
#         # print key_var
#         post[key_var[0]] = key_var[1]

def send_order():

    # params = []
    # params.append(order_from_site)

    with open("test.txt") as f:
        encoded_file = base64.b64encode(f.read())
        fname = f.name

    client = Client(_CURRENT_ADDRESS_ + 'OrderKlient.1cws?wsdl',
                    location=_CURRENT_ADDRESS_ + "OrderKlient.1cws")

    client.set_options(cache=None)
    # client.set_options(cache=DocumentCache())

    fname_with_ext = fname.split(".")

    # try:
    result = client.service.GetPlazmaOrder(encoded_file, fname_with_ext[0], fname_with_ext[1])

    # print result[:5]

    return result

print send_order()
