#!/web/trimetru/python/bin/python2.6
# -*- coding: utf-8 -*-

import sys
import os
import cgi
import random

import random
import MySQLdb

import imp
# py_scripts_path = os.path.expanduser('~/web/sitenewwave/1cengine/py_scripts/') #development
py_scripts_path = os.path.expanduser('~/site/www/1cengine/py_scripts/') #production

secrets_lib_name = "secrets"
secrets_lib_path = "structures/secrets.py"
secrets = imp.load_source(
    secrets_lib_name,
    py_scripts_path + secrets_lib_path
)

databases = secrets.databases

import datetime

import cgitb
cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))
reload(sys)
sys.setdefaultencoding('utf-8')

print("Content-Type: text/xml; charset=utf-8\n")

from suds.client import Client
from suds.cache import DocumentCache

import logging
logging.basicConfig(level=logging.INFO)
if __debug__:
    logging.getLogger('suds.client').setLevel(logging.DEBUG)
else:
    logging.getLogger('suds.client').setLevel(logging.CRITICAL)


# _DEVELOPING_ADDRESS_ = "http://192.168.194.27/trimet_trade_fedorov/ws/"
_DEVELOPING_ADDRESS_ = "http://192.168.194.14/trimet_trade/ws/"
_PRODUCTION_ADDRESS_ = "http://195.239.221.58:30082/trimet_trade/ws/"

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
            result = client.service.GetOrderMeta(UID)
        except:
            return False

        if "FAIL" in result:
            return "FAIL"
        else:
            pass

        return result

    else:
        return False

def set_trx():

    conn = MySQLdb.connect(host=databases["extra"]["host"],
                           user=databases["extra"]["user"],
                           passwd=databases["extra"]["passwd"],
                           db=databases["extra"]["db"])

    conn.set_character_set('utf8')
    cursor = conn.cursor()
    cursor.execute('SET NAMES utf8;')

    choices = '0123456789abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_$#%'
    trx_string = "Trx_"
    for i in range(32):
        trx_string = trx_string + str(random.choice(choices))

    time = datetime.datetime.now()
    time = time.strftime('%Y-%m-%d')

    cursor.execute(""" INSERT INTO `trimetru_extra`.`trx_codes`
        (`id`, `trx`, `date`, `is_active`)
        VALUES ( %s,%s,%s,%s ) """, (
        '', trx_string, time, True ))

    row = cursor.fetchone()
    conn.commit()

    cursor.close()
    conn.close()


    return trx_string


form = cgi.FieldStorage()

# f = open('/web/trimetru/site/www/gpbtest.txt', 'w+')

if "o.uid" in form:
    order = get_order(form["o.uid"].value)

    if order is False:
        rs = """<?xml version='1.0' encoding='UTF-8'?>
            <payment-avail-response>
              <result>
                <code>2</code>
                <desc>Произошла ошибка, попробуйте повторить платёж позже</desc>
              </result>
            </payment-avail-response>
        """

    elif "FAIL" in order:
        rs = """<?xml version='1.0' encoding='UTF-8'?>
            <payment-avail-response>
              <result>
                <code>2</code>
                <desc>Заказ не существует</desc>
              </result>
            </payment-avail-response>
        """

    else:
        rs = """<?xml version='1.0' encoding='UTF-8'?>
            <payment-avail-response>
              <result>
                <code>1</code>
                <desc>"""+order[1]+"""</desc>
              </result>
              <merchant-trx>"""+set_trx()+"""</merchant-trx>
              <purchase>
                <shortDesc> </shortDesc>
                <longDesc>Заказ #"""+order[1]+"""</longDesc>
                <account-amount>
                  <id>58A7ABEFD18BAEBD4173DEA65868910D</id>
                  <amount>"""+str(order[0]).replace(".", "")+"""</amount>
                  <currency>643</currency>
                  <exponent>2</exponent>
                </account-amount>
              </purchase>
            </payment-avail-response>
        """


    # f.write(form["o.uid"].value + "\n" + rs)
else:
    rs = """<?xml version='1.0' encoding='UTF-8'?>
        <payment-avail-response>
          <result>
            <code>2</code>
          </result>
        </payment-avail-response>
    """

print(rs)
    # f.write("Hell No!")

# f.close
