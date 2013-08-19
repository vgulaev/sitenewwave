#!/web/trimetru/python/bin/python2.6
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

# _DEVELOPING_ADDRESS_ = "http://192.168.194.14/fedorov_trimet_ut_copy/ws/"
_DEVELOPING_ADDRESS_ = "http://192.168.194.14/DemoTrimet/ws/"
_PRODUCTION_ADDRESS_ = "http://195.239.221.58:30080/DemoTrimet/ws/"

if "dev" in os.environ["SERVER_NAME"]:
    _CURRENT_ADDRESS_ = _DEVELOPING_ADDRESS_
else:
    _CURRENT_ADDRESS_ = _PRODUCTION_ADDRESS_


def get_shipping_list(UID):

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

    date_from = None
    date_to = None

    if "dateFrom" in post:
        if post["dateFrom"] != "":
            date_from_array = post["dateFrom"].split(".")
            date_from = date_from_array[2]+"-"+date_from_array[1]+"-"+date_from_array[0]
            # print date_from

    if "dateTo" in post:
        if post["dateTo"] != "":
            date_to_array = post["dateTo"].split(".")
            date_to = date_to_array[2]+"-"+date_to_array[1]+"-"+date_to_array[0]

    client = Client(_CURRENT_ADDRESS_+'privetoffice.1cws?wsdl', location = _CURRENT_ADDRESS_+"privetoffice.1cws")
    # client = Client('http://192.168.194.14/fedorov_trimet_ut_copy/ws/privetoffice.1cws?wsdl', location = "http://192.168.194.14/fedorov_trimet_ut_copy/ws/privetoffice2.1cws?")

    client.set_options(cache=DocumentCache())


    result = client.service.SettlementList(UID,date_from,date_to)

    # return result

    # print "nya"
    # print result

    listShipping = """
         
        <div class="dateChooser">
            <form method="POST" action="/kabinet/settlement/" id="dateForm">
                Показать взаиморасчеты в период: <input type="textarea" name="dateFrom" class="dateInput dateFrom" /> - <input type="textarea" name="dateTo" class="dateInput dateTo" />
                <div class="datePickButton">Обновить журнал</div>
            </form>
        </div>
    """

    listShipping = listShipping + """
        <table>
            <thead>
                <tr class="settlementHeader">
                    <th>Документ</th>
                    <th>Начальный остаток</th>
                    <th>Приход</th>
                    <th>Расход</th>
                    <th>Конечный остаток</th>
                </tr>
            </thead>
            <tbody>
    """

    odd = "odd"

    shippings = ""
    for shipping in result[0][0]:
        shippings = shippings + """
            <tr class="settlementItem """+odd+""" ">
                <td>"""+str(shipping[0])+"""</td>
                <td>"""+str(shipping[1])+"""</td>
                <td>"""+str(shipping[2])+"""</td>
                <td>"""+str(shipping[3])+"""</td>
                <td>"""+str(shipping[4])+"""</td>
            </tr>
        """
        
        if odd=="odd":
            odd=""
        else:
            odd = "odd"

    listShipping = listShipping + shippings + "</tbody></table>"

    return listShipping 


def __main__(funct_name):
    return eval(funct_name)