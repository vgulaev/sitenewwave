#!/web/trimet/python/bin/python2.6
# -*- coding: utf-8 -*-

import sys, os
import cgi
import imp
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

_DEVELOPING_ADDRESS_ = "http://192.168.194.14/fedorov_trimet_ut_copy/ws/"
_PRODUCTION_ADDRESS_ = "http://195.239.221.58:30080/DemoTrimet/ws/"

if "dev" in os.environ["SERVER_NAME"]:
    _CURRENT_ADDRESS_ = _DEVELOPING_ADDRESS_
else:
    _CURRENT_ADDRESS_ = _PRODUCTION_ADDRESS_

def translit(letter):
    ru_en_dict = {
        "а" :  "a",
        "б" :  "b",
        "в" :  "v",
        "г" :  "g",
        "д" :  "d",
        "е" :  "e",
        "ё" :  "yo",
        "ж" :  "zh",
        "з" :  "z",
        "и" :  "i",
        "й" :  "j",
        "к" :  "k",
        "л" :  "l",
        "м" :  "m",
        "н" :  "n",
        "о" :  "o",
        "п" :  "p",
        "р" :  "r",
        "с" :  "s",
        "т" :  "t",
        "у" :  "u",
        "ф" :  "f",
        "х" :  "x",
        "ц" :  "cz",
        "ч" :  "ch",
        "ш" :  "sh",
        "щ" :  "shh",
        "ъ" :  "``",
        "ы" :  "y'",
        "ь" :  "`",
        "э" :  "e`",
        "ю" :  "yu",
        "я" :  "ya",
        "0" :  "0",
        "1" :  "1",
        "2" :  "2",
        "3" :  "3",
        "4" :  "4",
        "5" :  "5",
        "6" :  "6",
        "7" :  "7",
        "8" :  "8",
        "9" :  "9"
    }

    letter = letter.lower().encode('utf-8')
    return ru_en_dict[letter].upper()

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

    result_table = "<table>"
    result_table = result_table + "<caption>" + result[3]
    order_number = ""
    for letter in result[3]:
        order_number = order_number + translit(letter)
    result_table = result_table + """
        <input style="display:none" name="PurchaseDesc" type="text" id="PurchaseDesc"  value=\""""+order_number+"""\" />
    """  + "</caption>"
    result_table = result_table + "<tr><th>Номенклатура</th><th>Количество шт.</th><th>Вес тн.</th><th>Цена за тн.</th><th>Сумма</th></tr>"

    # print result, "<br />"
    # print "-----", "<br />"

    # print result[0], "<br />"
    # print result[1], "<br />"
    # overall_sum = 0
    
    for good in result [2][0]:
        result_table = result_table + "<tr>"
        
        # print "------", "<br />"
        # print good[0], "<br />" ### Характеристика
        # print good[1], "<br />"
        # print good[2], "<br />"
        # print good[3], "<br />" ### Номенклатура
        # print good[4], "<br />"

        lib_path = os.path.abspath('1cengine/payment/')
        sys.path.append(lib_path)
        python_lib_name = "get_item_name"
        get_item_name_lib = imp.load_source(python_lib_name, lib_path+"/"+python_lib_name+".py")

        result_table = result_table + "<td>" + get_item_name_lib.get_item_name(good[0],good[3]) + "</td>"
        result_table = result_table + "<td>" + good[1] + "</td>"
        result_table = result_table + "<td>" + good[2] + "</td>"
        result_table = result_table + "<td>" + good[4] + "</td>"
        # item_sum = float(good[4]) * float(good[2])
        # overall_sum = overall_sum + item_sum
        result_table = result_table + "<td>" + good[6] + "</td>"
        result_table = result_table + "</tr>"



    overall_sum = ''.join(result[5].split())
    overall_sum_array = overall_sum.split(",")
    overall_sum = overall_sum_array[0] + "." + overall_sum_array[1].ljust(2,"0")
    # print overall_sum
    result_table = result_table + """
    <tr><td></td><td></td><td></td><td><strong>Итого: </strong>
    </td><td>"""+result[5]+"""<input style="display:none" name="PurchaseAmt" type="text"
     id="PurchaseAmt"  value=\""""+overall_sum+"""\" /></td></tr>
    """
    # print "-----", "<br />"
    # print result[3], "<br />"
    # print result[4], "<br />"


    return result_table + "</table>"


def __main__(funct_name):
    return eval(funct_name)