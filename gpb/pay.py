#!/web/trimetru/python/bin/python2.6
# -*- coding:utf-8 -*-

import sys
import os
import cgi
import cgitb
cgitb.enable()

sys.path.insert(0, os.path.expanduser('~/site/python'))
reload(sys)
sys.setdefaultencoding('utf-8')

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


def report_1c(uid, sum):

    client = Client(_CURRENT_ADDRESS_ + 'OrderKlient.1cws?wsdl',
                    location=_CURRENT_ADDRESS_ + "OrderKlient.1cws")

    # client.set_options(cache=None)
    client.set_options(cache=DocumentCache())

    # try:
    result = client.service.CreatePaymentOrder(
        uid, sum)

    return result


print("Content-Type: text/xml; charset=utf-8\n")

form = cgi.FieldStorage()

if "o.uid" in form and "amount" in form:
    result = report_1c(form["o.uid"].value, form["amount"].value)
    if "SUCCESS" in result:
        rs = """<?xml version='1.0' encoding='UTF-8'?>
                    <register-payment-response>
                       <result>
                          <code>1</code>
                          <desc>"""+result+"""</desc>
                       </result>
                    </register-payment-response>
                """
    else:
        rs = """<?xml version='1.0' encoding='UTF-8'?>
                    <register-payment-response>
                       <result>
                          <code>2</code>
                          <desc>"""+result+"""</desc>
                       </result>
                    </register-payment-response>
                """
else:
    rs = """<?xml version='1.0' encoding='UTF-8'?>
                    <register-payment-response>
                       <result>
                          <code>2</code>
                          <desc>Нет идентификатора платежа или суммы</desc>
                       </result>
                    </register-payment-response>
                """
print(rs)
