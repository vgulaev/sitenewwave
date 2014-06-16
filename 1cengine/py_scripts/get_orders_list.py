#!/web/trimetru/python/bin/python2.6
# -*- coding: utf-8 -*-

import sys
import os
import cgi
import cgitb
cgitb.enable()
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

_DEVELOPING_ADDRESS_ = "http://192.168.194.14/fedorov_trimet_ut/ws/"
# _DEVELOPING_ADDRESS_ = "http://192.168.194.14/DemoTrimet/ws/"
_PRODUCTION_ADDRESS_ = "http://195.239.221.58:30080/DemoTrimet/ws/"

if "dev" in os.environ["SERVER_NAME"]:
    _CURRENT_ADDRESS_ = _DEVELOPING_ADDRESS_
else:
    _CURRENT_ADDRESS_ = _PRODUCTION_ADDRESS_

post = {}


if "POST_DATA" in os.environ:
    raw_post = os.environ["POST_DATA"]
else:
    raw_post = sys.stdin.read()

if raw_post != "":
    if "&amp;" in raw_post:
        pre_post = raw_post.split("&amp;")
    else:
        pre_post = raw_post.split("&")
    # print pre_post
    for variables in pre_post:
        # print variables
        key_var = str(variables).split("=")
        # print key_var
        post[key_var[0]] = key_var[1]


def get_orders_list(UID):

    date_from = ""
    date_to = ""

    if "dateFrom" in post:
        if post["dateFrom"] != "":
            date_from_array = post["dateFrom"].split(".")
            date_from = date_from_array[
                2] + "-" + date_from_array[1] + "-" + date_from_array[0]
            # print date_from

    if "dateTo" in post:
        if post["dateTo"] != "":
            date_to_array = post["dateTo"].split(".")
            date_to = date_to_array[
                2] + "-" + date_to_array[1] + "-" + date_to_array[0]

    # if "from_ajax" in post:
    #     res = get_order_list_ajax(UID,date_from,date_to)

    # else:
    #     res = get_order_list_html(UID,date_from,date_to)

    return get_order_list_ajax(UID, date_from, date_to)


def get_order_list_ajax(UID, date_from, date_to):

    if date_from != "":
        date_from_par = "&date_from=" + date_from
    else:
        date_from_par = ""

    if date_to != "":
        date_to_par = "&date_to=" + date_to
    else:
        date_to_par = ""

    import random
    loader_list = ["379", "285", "377", "382", "385"]

    loader_str = "<div><img src='/1cengine/payment/" + \
        random.choice(loader_list) + ".png' /></div>"

    if "dateFrom" in post:
        date_from_value = post["dateFrom"]
    else:
        date_from_value = ""

    if "dateTo" in post:
        date_to_value = post["dateTo"]
    else:
        date_to_value = ""

    ajax = """
        <div class="dateChooser">
            <form method="POST" action="/kabinet/orders/" id="dateForm">
                Показать заказы в период:
                 <input type="textarea" name="dateFrom"
                class="dateInput dateFrom"
                value=\"""" + date_from_value + """\" />
                 - <input type="textarea" name="dateTo"
                class="dateInput dateTo" value=\"""" + date_to_value + """\" />
                <div class="datePickButton">Обновить журнал</div>
            </form>
        </div>
        <div id="order_ajax_div">
        """ + loader_str + """
        <script type="text/javascript">
        $(document).ready( function(){
            $.ajax({
                type: "POST",
                url: "/1cengine/py_scripts/get_orders_list.py",
                async: true,
                data: "UID=""" + UID + date_from_par + date_to_par + \
                """&from_ajax=true",
                success: function(html) {

                    $("#order_ajax_div").html(html)
                    after_get_list()

                }

            });

        })

        </script>
        </div>
    """

    return ajax


def get_order_list_html(UID, date_from, date_to):

    client = Client(_CURRENT_ADDRESS_ + 'privetoffice.1cws?wsdl',
                    location=_CURRENT_ADDRESS_ + "privetoffice.1cws")
    client.set_options(cache=DocumentCache())

    result = client.service.OrderLists(UID, date_from, date_to)

    # print "nya"
    # print result

    listOrder = ""

    listOrder = listOrder + """
        <div class="orderListHeader">
            <span>Номер</span>
            <span>Сумма</span>
            <span><a href="javascript:pass()">Дата
            <img class="date_arrow"
            src="/1cengine/kabinet_orders/arrow_down.svg" /></a></span>
        </div>
        <div id="ordersContainer">
    """

    odd = "odd"

    orders = ""
    for order in result[2][0]:
        orders = orders + """
            <div class="orderItem """ + odd + """ ">
                <div>
                    <span class="openOrderDownload">
                        <img class="ar_img"
                        src="/1cengine/kabinet_orders/arrow.svg" />
                        """ + str(order[3]) + """
                    </span>
                    <span>""" + str(order[2]) + """</span>
                    <span class="orderDate">
                    """ + str(order[1].split(" ")[0]) + """</span>
                </div>

                <p class="orderDownload">
                    Скачать заказ:
                    <a href='javascript:openLink(
                    \"""" + str(order[0]) + """\","xlsx")'
                    title="Скачать заказ в формате xls"> xls </a>
                    <a href='javascript:openLink(
                    \"""" + str(order[0]) + """\","pdf")'
                    title="Скачать заказ в формате pdf"> pdf </a>
                    <a href='javascript:openLink(
                    \"""" + str(order[0]) + """\","ods")'
                    title="Скачать заказ в формате ods"> ods </a>
                </p>
            </div>
        """

        if odd == "odd":
            odd = ""
        else:
            odd = "odd"

    listOrder = listOrder + orders + "</div>"

    return listOrder


def __main__(funct_name):
    return eval(funct_name)

if os.environ.get('REQUEST_METHOD', '') == "POST":

    # print os.environ.get('REQUEST_METHOD','')
    raw_post = sys.stdin.read()

    if raw_post != "":
        pre_post = raw_post.split("&amp;")
        # print pre_post
        for variables in pre_post:
            # print variables
            key_var = str(variables).split("=")
            # print key_var
            post[key_var[0]] = key_var[1]

    # print post
    if "from_ajax" in post:
        print "Content-Type: text/html; charset=utf-8\n"

        UID = post["UID"]
        if "date_from" in post:
            date_from = post["date_from"]
        else:
            date_from = None
        if "date_to" in post:
            date_to = post["date_to"]
        else:
            date_to = None

        order_list = get_order_list_html(UID, date_from, date_to)

        print order_list
