#!/web/trimetru/python/bin/python2.6
# -*- coding: utf-8 -*-

import sys, os
import cgi
import cgitb; cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))
reload(sys)
sys.setdefaultencoding('utf-8')

print ("Content-Type: text/html; charset=utf-8\n")

import json
from suds.client import Client
from suds.cache import DocumentCache

import logging
logging.basicConfig(level=logging.INFO)
if __debug__:
    logging.getLogger('suds.client').setLevel(logging.DEBUG)
else:
    logging.getLogger('suds.client').setLevel(logging.CRITICAL)

client = Client('http://192.168.194.14/DemoTrimet/ws/privetoffice.1cws?wsdl', location = "http://192.168.194.14/DemoTrimet/ws/privetoffice.1cws")
client.set_options(cache=DocumentCache())


result = client.service.OrderLists("657ed8dd-be8f-42d5-95f2-708f21dd5a1c",None,None)

print """
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

print """
    <table>
        <thead>
            <tr>
                <th>---</th>
                <th>Номер</th>
                <th>Сумма Документов</th>
                <th>Дата</th>
                <th>Ответственный</th>
                <th>Контрагент</th>
            </tr>
        </thead>
        <tbody>
"""


for order in result[2][0]:
    print """
        <tr>
            <td><a href='http://trimet.ru/1cengine/site/index.php?uid="""+order[0]+"""'>Просмотреть заказ</a></td>
            <td>"""+order[3]+"""</td>
            <td>"""+order[2]+"""</td>
            <td>"""+order[1]+"""</td>
            <td>"""+order[4]+"""</td>
            <td>"""+order[5]+"""</td>
        </tr>
    """
    # print " ---- ",order[0]," | ",order[1]," | ",order[2]," | ",order[3]," | ",order[4]," | ",order[5]," ---- <br />"

print "</tbody></table>"

# print result