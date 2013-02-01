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

def getOrdersList(UID):

    # client = Client('http://195.239.221.58:30080/DemoTrimet/ws/privetoffice.1cws?wsdl', location = "http://195.239.221.58:30080/DemoTrimet/ws/privetoffice.1cws")
    client = Client('http://192.168.194.14/DemoTrimet/ws/privetoffice.1cws?wsdl', location = "http://192.168.194.14/DemoTrimet/ws/privetoffice.1cws")
    client.set_options(cache=DocumentCache())


    result = client.service.OrderLists(UID,None,None)

    listOrder = """
        <style>
            table{
                border-left:1px solid gray;
                border-top:1px solid gray;
            }
            td,th{
                border-right:1px solid gray;
                border-bottom:1px solid gray;
                text-align:center;
                padding:5px;
            }
        </style>
    """

    listOrder = listOrder + """
        <div class="orderListHeader">
            <span>Номер</span>
            <span>Сумма</span>
            <span>Дата</span>
        </div>
    """

    odd = "odd"

    for order in result[2][0]:
        listOrder = listOrder + """
            <div class="orderItem """+odd+""" ">
                <span class="openOrderDownload">"""+str(order[3])+"""</span>
                <span>"""+str(order[2])+"""</span>
                <span>"""+str(order[1].split(" ")[0])+"""</span>
                
                <p class="orderDownload">
                    Скачать заказ: 
                    <a href='javascript:openLink(\""""+str(order[0])+"""\","xlsx")' title="Скачать заказ в формате xls"> xls </a>
                    <a href='javascript:openLink(\""""+str(order[0])+"""\","pdf")' title="Скачать заказ в формате pdf"> pdf </a>
                    <a href='javascript:openLink(\""""+str(order[0])+"""\","odf")' title="Скачать заказ в формате ods"> ods </a>
                </p>
            </div>
        """
        
        if odd=="odd":
            odd=""
        else:
            odd = "odd"

    listOrder = listOrder + "</tbody></table>"

    return listOrder


def __main__(funct_name):
    return eval(funct_name)