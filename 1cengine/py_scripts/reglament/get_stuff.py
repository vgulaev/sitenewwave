#!/web/trimetru/python/bin/python2.6
# -*- coding:utf-8 -*-

import sys
import os
import imp
import MySQLdb

sys.path.insert(0, os.path.expanduser('~/site/python'))
reload(sys)
sys.setdefaultencoding('utf-8')


from suds.client import Client
from suds.cache import DocumentCache

import logging
logging.basicConfig(level=logging.INFO)
# if __debug__:
#     logging.getLogger('suds.client').setLevel(logging.DEBUG)
# else:
#     logging.getLogger('suds.client').setLevel(logging.CRITICAL)


# c_path = os.path.dirname(os.path.abspath(__file__))
# py_scripts_path = os.path.expanduser('~/web/sitenewwave/1cengine/py_scripts/') #development
py_scripts_path = os.path.expanduser('~/site/www/1cengine/py_scripts/') #production

secrets_lib_name = "secrets"
secrets_lib_path = "structures/secrets.py"
secrets = imp.load_source(secrets_lib_name, py_scripts_path+secrets_lib_path)

database = secrets.databases["addinfo"]

def get_stuff():
    _DEVELOPING_ADDRESS_ = "http://192.168.194.27/trimet_trade_fedorov/ws/"
    # _DEVELOPING_ADDRESS_ = "http://192.168.194.14/trimet_trade/ws/"
    _PRODUCTION_ADDRESS_ = "http://195.239.221.58:30082/trimet_trade/ws/"

    _CURRENT_ADDRESS_ = _PRODUCTION_ADDRESS_
    # _CURRENT_ADDRESS_ = _DEVELOPING_ADDRESS_

    client = Client(
        _CURRENT_ADDRESS_ + "InfoService.1cws?wsdl",
        location=_CURRENT_ADDRESS_ + "InfoService.1cws", timeout=180)
    client.set_options(cache=DocumentCache())

    result = client.service.GetStuff()

    return result


def load_to_db():

    insert_text = """

        INSERT INTO `stuff` (
            `name`, `local_phone`, `mobile_phone`,
            `email`, `department`, `role`
        ) VALUES (

    """
    values_list = []

    stuff_list = get_stuff()

    for stuff in stuff_list[u"СписокСотрудников"]:
        name = str(stuff[u"Наименование"])
        local_phone = str(stuff[u"ВнутреннийНомер"])
        mobile_phone = str(stuff[u"Мобильный"])
        email = str(stuff[u"ЭлектроннаяПочта"])
        department = str(stuff[u"Отдел"])
        role = str(stuff[u"Должность"])

        values = """
            "{0}","{1}","{2}","{3}","{4}","{5}"
        """.format(
            name, local_phone, mobile_phone, email, department, role
        )

        values_list.append(values)

    values_string = "), (".join(values_list) + ")"

    insert_text = insert_text + values_string

    # print insert_text


    conn = MySQLdb.connect(host=database["host"],
                       user=database["user"],
                       passwd=database["passwd"],
                       db=database["db"])


    conn.set_character_set('utf8')
    cursor = conn.cursor()

    cursor.execute(""" TRUNCATE `stuff` """)

    cursor.execute('SET NAMES utf8;')

    cursor.execute(insert_text)
    conn.commit()

    cursor.close()
    conn.close()

    print "Stuff was loaded"

load_to_db()
