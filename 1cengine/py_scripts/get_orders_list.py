#!/web/trimet/python/bin/python2.6
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

_DEVELOPING_ADDRESS_ = "http://192.168.194.14/DemoTrimet/ws/"
_PRODUCTION_ADDRESS_ = "http://195.239.221.58:30080/DemoTrimet/ws/"

if "dev" in os.environ["SERVER_NAME"]:
    _CURRENT_ADDRESS_ = _DEVELOPING_ADDRESS_
else:
    _CURRENT_ADDRESS_ = _PRODUCTION_ADDRESS_


def get_orders_list(UID):

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
    client.set_options(cache=DocumentCache())


    result = client.service.OrderLists(UID,date_from,date_to)

    # print "nya"
    # print result

    listOrder = """
         
        <div class="dateChooser">
            <form method="POST" action="/kabinet/orders/" id="dateForm">
                Показать заказы в период: <input type="textarea" name="dateFrom" class="dateInput dateFrom" /> - <input type="textarea" name="dateTo" class="dateInput dateTo" />
                <div class="datePickButton">Обновить журнал</div>
            </form>
        </div>
    """

    listOrder = listOrder + """
        <div class="orderListHeader">
            <span>Номер</span>
            <span>Сумма</span>
            <span><a href="javascript:pass()">Дата</a></span>
        </div>
        <div id="ordersContainer">
    """

    odd = "odd"

    orders = ""
    for order in result[2][0]:
        orders = orders + """
            <div class="orderItem """+odd+""" ">
            
                <div>

                    <span class="openOrderDownload">
                        <img class="ar_img" src="/1cengine/kabinet_orders/arrow.svg" />
                        """+str(order[3])+"""            
                    </span>
                    <span>"""+str(order[2])+"""</span>
                    <span class="orderDate">"""+str(order[1].split(" ")[0])+"""</span>
                </div>

                <p class="orderDownload">
                    Скачать заказ: 
                    <a href='javascript:openLink(\""""+str(order[0])+"""\","xlsx")' title="Скачать заказ в формате xls"> xls </a>
                    <a href='javascript:openLink(\""""+str(order[0])+"""\","pdf")' title="Скачать заказ в формате pdf"> pdf </a>
                    <a href='javascript:openLink(\""""+str(order[0])+"""\","ods")' title="Скачать заказ в формате ods"> ods </a>
                </p>
            </div>
        """
        
        if odd=="odd":
            odd=""
        else:
            odd = "odd"

    listOrder = listOrder + orders + "</div>"

    return listOrder


def __main__(funct_name):
    return eval(funct_name)