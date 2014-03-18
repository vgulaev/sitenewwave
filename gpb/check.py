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

print("Content-Type: text/xml; charset=utf-8\n")

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


def get_order(UID):

    if UID is not None:

        client = Client(_CURRENT_ADDRESS_ + 'OrderKlient.1cws?wsdl',
                        location=_CURRENT_ADDRESS_ + "OrderKlient.1cws")

        # client.set_options(cache=None)
        client.set_options(cache=DocumentCache())

        try:
            result = client.service.GetOrders(UID)
        except:
            return False

        if result[3].strip().__len__() != 0:
            pass
        else:
            return False

        return result

    else:
        return False



form = cgi.FieldStorage()

f = open('/web/trimetru/site/www/gpbtest.txt', 'w')

if "o.uid" in form:
    order = get_order(form["o.uid"].value)

    # print("Content-Type: text/xml; charset=utf-8\n")

    print("""<?xml version='1.0' encoding='UTF-8'?>
        <payment-avail-response>
          <result>
            <code>1</code>
            <desc>"""+str(order[3])+"""</desc>
          </result>
          <purchase>
            <shortDesc> </shortDesc>
            <longDesc>Zakaz #"""+str(order[3])+"""</longDesc>
            <account-amount>
              <id>CB4E2E881BEC16145B7DA0AB2278A19D</id>
              <amount>"""+str(order[5])+"""</amount>
              <currency>643</currency>
              <exponent>2</exponent>
            </account-amount>
          </purchase>
        </payment-avail-response>
    """)

    f.write(form["o.uid"].value)
else:
    f.write("Hell No!")

f.close



