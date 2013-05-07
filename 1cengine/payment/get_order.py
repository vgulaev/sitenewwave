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

if "dev" in os.environ["SERVER_NAME"]:
    _CURRENT_ADDRESS_ = _DEVELOPING_ADDRESS_
else:
    _CURRENT_ADDRESS_ = _PRODUCTION_ADDRESS_

def get_order(UID):
    post = {}

    if "POST_DATA" in os.environ:
        raw_post = os.environ["POST_DATA"]
    else:
        raw_post = sys.stdin.read()

    if raw_post != "":
        pre_post = raw_post.split("&")
        # print pre_post
        for variables in pre_post:
            # print variables
            key_var = str(variables).split("=")
            # print key_var
            post[key_var[0]] = key_var[1]

    client = Client(_CURRENT_ADDRESS_+'OrderKlient.1cws?wsdl', location = _CURRENT_ADDRESS_+"OrderKlient.1cws")
    client.set_options(cache=DocumentCache())


    result = client.service.GetOrders(UID)

    print result, "<br />"
    print "-----", "<br />"

    print result[0], "<br />"
    print result[1], "<br />"
    # print result[2], "<br />"
    print "------", "<br />"
    print result[2][0][0][0], "<br />"
    print result[2][0][0][1], "<br />"
    print result[2][0][0][2], "<br />"
    print result[2][0][0][3], "<br />"
    print result[2][0][0][4], "<br />"
    print result[2][0][0][5], "<br />"
    print result[2][0][0][6], "<br />"
    # print result[2][0][0][7], "<br />"
    print "-----", "<br />"
    print result[3], "<br />"
    print result[4], "<br />"
    print result[5], "<br />"

    # if result == "Well":
    #     order_file_path = _CURRENT_ADDRESS_.replace("/DemoTrimet/ws/", "/download/") + UID + ".html"

    # import urllib2
    # response = urllib2.urlopen(order_file_path)
    # html = response.read()

    # from bs4 import BeautifulSoup
    # import re

    # soup = BeautifulSoup(''.join(html))

    return result


def __main__(funct_name):
    return eval(funct_name)