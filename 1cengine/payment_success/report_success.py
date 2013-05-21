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



# _DEVELOPING_ADDRESS_ = "http://192.168.194.14/fedorov_trimet_ut_copy/ws/"
_DEVELOPING_ADDRESS_ = "http://192.168.194.14/DemoTrimet/ws/"
_PRODUCTION_ADDRESS_ = "http://195.239.221.58:30080/DemoTrimet/ws/"

if "dev" in os.environ["SERVER_NAME"]:
    _CURRENT_ADDRESS_ = _DEVELOPING_ADDRESS_
else:
    _CURRENT_ADDRESS_ = _PRODUCTION_ADDRESS_

def translit(letter):
    ru_en_dict = {
        "а" :  "a",  "б" : "b",  "в" : "v",   "г" : "g",
        "д" :  "d",  "е" : "e",  "ё" : "yo",  "ж" : "zh",
        "з" :  "z",  "и" : "i",  "й" : "j",   "к" : "k",
        "л" :  "l",  "м" : "m",  "н" : "n",   "о" : "o",
        "п" :  "p",  "р" : "r",  "с" : "s",   "т" : "t",
        "у" :  "u",  "ф" : "f",  "х" : "x",   "ц" : "cz",
        "ч" :  "ch", "ш" : "sh", "щ" : "shh", "ъ" : "``",
        "ы" :  "y'", "ь" : "`",  "э" : "e`",  "ю" : "yu",
        "я" :  "ya", "0" : "0",  "1" : "1",   "2" : "2",
        "3" :  "3",  "4" : "4",  "5" : "5",   "6" : "6",
        "7" :  "7",  "8" : "8",  "9" : "9",   " " : " "
    }

    letter = letter.lower().encode('utf-8')
    return ru_en_dict[letter].upper()


### спросить банк о существовании и оплате заказа по номеру
def ask_bank(uid):

    order_number = ""
    for letter in get_order_number(uid):
        order_number = order_number + translit(letter)

    import requests
    from secrets import banking

    post={
        'xICBSXPProxy.ReqType'      :   '100',
        'xICBSXPProxy.Version'      :   '01.00',
        'xICBSXPProxy.UserName'     :   banking["login"],
        'xICBSXPProxy.UserPassword' :   banking["passwd"],
        'MerchantID'                :   banking["merchant_id"],
        'PurchaseDesc'              :   order_number
        }

    r = requests.post("https://e-commerce.raiffeisen.ru/portal/mrchtrnvw/trn_xml.jsp", data=post)
    
    from bs4 import BeautifulSoup

    response = BeautifulSoup(r.text)

    data_row = response.find("parameter", {"name" : "Row1"})
    order_row = data_row.find("value").text

    return order_row

### функция будет измененна и/или выкинута на задворки истории
### в случае, если мы передаем уид как идентификатор заказа ..
def get_order_number(uid):
    client = Client(_CURRENT_ADDRESS_+'OrderKlient.1cws?wsdl', 
        location = _CURRENT_ADDRESS_+"OrderKlient.1cws")
        
    # client.set_options(cache=None)
    client.set_options(cache=DocumentCache())

    try:
        result = client.service.GetOrders(uid)
    except:
        return False

    if result[3].strip().__len__() != 0:
        return result[3]
    else:
        return False

def report_1c(uid):
    order_row = ask_bank(uid)
    order_array = order_row.split("|")
    

    if order_array[5] == "Y":
        pass
    else:
        return "НЕ ОПЛОЧЕНО! >("

    client = Client(_CURRENT_ADDRESS_+'OrderKlient.1cws?wsdl', 
        location = _CURRENT_ADDRESS_+"OrderKlient.1cws")
        
    # client.set_options(cache=None)
    client.set_options(cache=DocumentCache())



    # try:
    result = client.service.CreatePaymentOrder(uid,order_array[4])
    # except:
    #     return False

    print result
    return "SUCCESS"

# print ask_bank("54ed5a9b-bdfe-11e2-be6a-00163e25bdbe")