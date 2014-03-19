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

def translit(letter):
    ru_en_dict = {
        "а":  "a",  "б": "b",  "в": "v",   "г": "g",
        "д":  "d",  "е": "e",  "ё": "yo",  "ж": "zh",
        "з":  "z",  "и": "i",  "й": "j",   "к": "k",
        "л":  "l",  "м": "m",  "н": "n",   "о": "o",
        "п":  "p",  "р": "r",  "с": "s",   "т": "t",
        "у":  "u",  "ф": "f",  "х": "x",   "ц": "cz",
        "ч":  "ch", "ш": "sh", "щ": "shh", "ъ": "``",
        "ы":  "y'", "ь": "`",  "э": "e`",  "ю": "yu",
        "я":  "ya", "0": "0",  "1": "1",   "2": "2",
        "3":  "3",  "4": "4",  "5": "5",   "6": "6",
        "7":  "7",  "8": "8",  "9": "9",   " ": " "
    }

    letter = letter.lower().encode('utf-8')
    return ru_en_dict[letter].upper()



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

    order_number = ""
    for letter in order[3]:
        order_number = order_number + translit(letter)

    rs = """<?xml version='1.0' encoding='UTF-8'?>
        <payment-avail-response>
          <result>
            <code>1</code>
            <desc>"""+order_number+"""</desc>
          </result>
          <purchase>
            <shortDesc> </shortDesc>
            <longDesc>Zakaz #"""+order_number+"""</longDesc>
            <account-amount>
              <id>CB4E2E881BEC16145B7DA0AB2278A19D</id>
              <amount>"""+str(order[5]).replace(".",",")+"""</amount>
              <currency>643</currency>
              <exponent>2</exponent>
            </account-amount>
          </purchase>
        </payment-avail-response>
    """

    print(rs)

    f.write(form["o.uid"].value + "\n" + rs)
else:
    f.write("Hell No!")

f.close

