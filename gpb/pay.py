#!/web/trimetru/python/bin/python2.6
# -*- coding:utf-8 -*-

import sys
import os
import cgi
import cgitb
import locale
locale.setlocale(locale.LC_ALL, ("ru_RU.UTF-8"))

import imp
import random
import MySQLdb
import datetime

from secrets import *

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

    f = open("testpay.txt", "w+")
    f.write(sum)
    f.close()

    major_sum = sum[:-2] + "," + sum[-2:]

    # try:
    result = client.service.CreatePaymentOrder(
        uid, major_sum)

    return result

def get_trx(trx_string):

    conn = MySQLdb.connect(host=databases["trx"]["host"],
                           user=databases["trx"]["user"],
                           passwd=databases["trx"]["passwd"],
                           db=databases["trx"]["db"])


    conn.set_character_set('utf8')
    cursor = conn.cursor()
    cursor.execute('SET NAMES utf8;')


    time = datetime.datetime.now()
    time = time.strftime('%Y-%m-%d')

    cursor.execute("""
        SELECT * FROM `trimetru_trx`.`trx_codes`
        WHERE `trx`='"""+trx_string+"""'
        AND `date`='"""+time+"""'
        AND `is_active`='1'""")

    r = cursor.fetchall()

    print r
    if r.__len__() > 0:
        for x in r:
            # print x[0]

            cursor.execute("""
               UPDATE `trimetru_trx`.`trx_codes`
               SET `is_active`='0'
               WHERE `id`='%s'
            """, (x[0]))

            row = cursor.fetchone()
            conn.commit()

            result = True
    else:
        result = False

    cursor.close()
    conn.close()

    return result

def send_mail():
    try:

        lib_path = os.path.abspath('')
        sys.path.append(lib_path)
        _PATH_ = os.path.abspath(os.path.dirname(__file__))

        python_lib_name = "mail_checkout"
        mail_lib = imp.load_source(
            python_lib_name, lib_path + "/" + python_lib_name + ".py")

        f = open(lib_path+"/checkout.tpl.html", "r")
        f_template = f.read()
        f.close()

        if form.has_key("o.number"):
            number = str(form["o.number"].value)
        else:
            number = "xxx"

        if form.has_key("ts"):
            timestamp = str(form["ts"].value)
        else:
            timestamp = "xxx"

        if form.has_key("amount"):
            summ = str(form["amount"].value)
            major = summ[:-2]
            minor = summ[-2:]
            summ = major + "." + minor
            summ = ( locale.format("%d", float(summ), grouping=True) + locale.format("%.2f", float(summ))[-3:] ).replace(" ", "\xc2\xa0")
        else:
            summ = "xxx"

        if form.has_key("p.cardholder"):
            fio = str(form["p.cardholder"].value)
        else:
            fio = "xxx"

        if form.has_key("o.mail"):
            mail = str(form["o.mail"].value)
        else:
            mail = "xxx"

        f_template = f_template.replace("{{NUMBER}}", number)
        f_template = f_template.replace("{{TIMESTAMP}}", timestamp)
        f_template = f_template.replace("{{SUM}}", summ)
        f_template = f_template.replace("{{FIO}}", fio)
        f_template = f_template.replace("{{MAIL}}", mail)

        mail_lib.mail_checkout(f_template, form["o.mail"].value)



    except:
        pass


print("Content-Type: text/xml; charset=utf-8\n")

form = cgi.FieldStorage()

if "result_code" in form and "merchant_trx" in form and form["result_code"].value == "1":

    if get_trx(form["merchant_trx"].value):

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
                send_mail()
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
    else:
        rs = """<?xml version='1.0' encoding='UTF-8'?>
                        <register-payment-response>
                            <result>
                                <code>2</code>
                                <desc>Нет идентификатора платежа или суммы</desc>
                            </result>
                        </register-payment-response>
                """
else:
    rs = """<?xml version='1.0' encoding='UTF-8'?>
                    <register-payment-response>
                        <result>
                            <code>2</code>
                            <desc>Платеж отменен</desc>
                        </result>
                    </register-payment-response>
            """

print(rs)



