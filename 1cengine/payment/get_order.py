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

def get_new_secret_key():

    ### working Grab code. commented due to pycurl hoster issue
    # from grab import Grab
    # from secrets import banking
    # 
    # g = Grab(None,'urllib.Extension')
    # g.setup(url="https://e-commerce.raiffeisen.ru/portal/mrchtrnvw/trn_xml.jsp")
    # g.setup(connect_timeout=5, timeout=5)
    # g.setup(post={
    #     'xICBSXPProxy.ReqType'      :   '100',
    #     'xICBSXPProxy.Version'      :   '05.00',
    #     'xICBSXPProxy.UserName'     :   banking["login"],
    #     'xICBSXPProxy.UserPassword' :   banking["passwd"],
    #     'MerchantID'                :   banking["merchant_id"]
    #     })
    # 
    # g.request()
    # 
    # return g.xpath_text('//value')
    ###

    import requests
    from secrets import banking

    post={
        'xICBSXPProxy.ReqType'      :   '100',
        'xICBSXPProxy.Version'      :   '05.00',
        'xICBSXPProxy.UserName'     :   banking["login"],
        'xICBSXPProxy.UserPassword' :   banking["passwd"],
        'MerchantID'                :   banking["merchant_id"]
        }

    r = requests.post("https://e-commerce.raiffeisen.ru/portal/mrchtrnvw/trn_xml.jsp", data=post)
    
    from bs4 import BeautifulSoup

    response = BeautifulSoup(r.text)

    return response.find("value").text
    
def get_order(UID):

    ### cache cleaning code
    # import os
    # import shutil
    # from tempfile import gettempdir as tmp
    # shutil.rmtree(os.path.join(tmp(), 'suds'), True)
    
    if UID != None:

            
        client = Client(_CURRENT_ADDRESS_+'OrderKlient.1cws?wsdl', location = _CURRENT_ADDRESS_+"OrderKlient.1cws")
        
        # client.set_options(cache=None)
        client.set_options(cache=DocumentCache())

        try:
            result = client.service.GetOrders(UID)
        except:
            return "<p>Ошибка в работе с веб сервисом</p>"

        
        if result[3].strip().__len__() != 0:
            pass
        else:
            return "<p>Не существующий номер заказа</p>"
        # print result[3]

        try:

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
            
            for good in result[2][0]:
                result_table = result_table + "<tr>"
                
                # print "------", "<br />"
                # print good[0], "<br />" ### Характеристика
                # print good[1], "<br />"
                # print good[2], "<br />"
                # print good[3], "<br />" ### Номенклатура
                # print good[4], "<br />"

                # lib_path = os.path.abspath('1cengine/payment/')
                # sys.path.append(lib_path)
                # python_lib_name = "get_item_name"
                # get_item_name_lib = imp.load_source(python_lib_name, lib_path+"/"+python_lib_name+".py")

                result_table = result_table + "<td>" + good[8] + "</td>"
                result_table = result_table + "<td>" + good[1] + "</td>"
                result_table = result_table + "<td>" + good[2] + "</td>"
                result_table = result_table + "<td>" + good[4] + "</td>"
                # item_sum = float(good[4]) * float(good[2])
                # overall_sum = overall_sum + item_sum
                result_table = result_table + "<td>" + good[7] + "</td>"
                # result_table = result_table + "<td>" + good[8] + "</td>"
                result_table = result_table + "</tr>"



            # print result[5]
            overall_sum = ''.join(result[5].split(" "))
            overall_sum_array = overall_sum.split(",")
            # print overall_sum_array
            if overall_sum_array.__len__() > 1:
                overall_sum = overall_sum_array[0] + "." + overall_sum_array[1].ljust(2,"0")
            else:
                overall_sum = overall_sum_array[0] + ".00"
            # print overall_sum
            result_table = result_table + """
            <tr><td></td><td></td><td></td><td><strong>Итого: </strong>
            </td><td>"""+result[5]+"""<input style="display:none" name="PurchaseAmt" type="text"
             id="PurchaseAmt"  value=\""""+overall_sum+"""\" /></td></tr></table>
            """
            # print "-----", "<br />"
            # print result[3], "<br />"
            # print result[4], "<br />"

            result_table = result_table + """
                <input style="display:none" name="key_b" type="text" id="key_b"  
                value=\""""+get_new_secret_key()+"""\"/>
                <input type="submit" name="SubmitName" value="Создать платеж" />
            """

            # get_new_secret_key()

        except:
            result_table = "<p>Что то пошло не так</p>"
        
    else:
        result_table = "<p>Не задан идентификатор заказа</p>"
    
    return result_table


def __main__(funct_name):
    return eval(funct_name)