#!/web/trimetru/python/bin/python2.6
# -*- coding: utf-8 -*-

import sys
import os
import re
import cgi
import cgitb
import urllib
import imp
cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))
reload(sys)
sys.setdefaultencoding('utf-8')

# print ("Content-Type: text/html; charset=utf-8\n")

_PATH_ = os.path.abspath(os.path.dirname(__file__))

import json
from suds.client import Client
from suds.cache import DocumentCache

import logging
logging.basicConfig(level=logging.INFO)
if __debug__:
    logging.getLogger('suds.client').setLevel(logging.DEBUG)
else:
    logging.getLogger('suds.client').setLevel(logging.CRITICAL)

# from pysimplesoap.client import SoapClient


_DEVELOPING_ADDRESS_ = "http://192.168.194.27/trimet_trade_fedorov/ws/"
# _DEVELOPING_ADDRESS_ = "http://192.168.194.14/trimet_trade/ws/"
_PRODUCTION_ADDRESS_ = "http://195.239.221.58:30082/trimet_trade/ws/"

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

def get_counterparty_list(UID):

    python_lib_name = "1c_user_interaction"
    user_1c_lib = imp.load_source(
        python_lib_name, _PATH_ + "/" + python_lib_name + ".py")

    user_1c = user_1c_lib.User1C()
    user_data = user_1c.get_user_information(UID)

    return user_data[8][0]

def get_orders_list(UID):

    date_from = ""
    date_to = ""
    counterparty = ""

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

    if "counterparty" in post:
        if post["counterparty"] != "":
            counterparty = post["counterparty"]

    return get_payment_list_ajax(UID, date_from, date_to, counterparty)


def get_payment_list_ajax(UID, date_from, date_to, counterparty):
    if date_from != "":
        date_from_par = "&date_from=" + date_from
    else:
        date_from_par = ""

    if date_to != "":
        date_to_par = "&date_to=" + date_to
    else:
        date_to_par = ""

    if counterparty != "":
        counterparty_par = "&counterparty=" + counterparty
    else:
        counterparty_par = ""

    ctext = urllib.unquote(counterparty).decode('utf8').replace("+", " ")

    import random
    loader_list = ["379", "285", "377", "382", "385"]

    loader = random.choice(loader_list)
    loader_str = """
        <div><img src='/1cengine/payment/{0}.png' /></div>
    """.format(loader)

    if "dateFrom" in post:
        date_from_value = post["dateFrom"]
    else:
        date_from_value = ""

    if "dateTo" in post:
        date_to_value = post["dateTo"]
    else:
        date_to_value = ""

    cp_option = "<option value='Все'>Все</option>"

    for cp in get_counterparty_list(UID):
        is_selected = ""
        if cp in ctext:
            is_selected = "selected"
        formatted_option = "<option value='{0}' {1}>{0}</option>".format(cp, is_selected)
        cp_option = cp_option + formatted_option

    if "Розничный покупатель" in ctext:
        cp_option = cp_option + "<option value='Розничный покупатель' selected >Без контрагента</option>"
    else:
        cp_option = cp_option + "<option value='Розничный покупатель'>Без контрагента</option>"

    ajax = """
        <div class="dateChooser">
            <form method="POST" action="/kabinet/payment/" id="dateForm">
                <table>
                    <tbody>
                        <tr>
                            <td>
                                Показать заказы в период:<br />
                                <input type="textarea" name="dateFrom"
                                class="dateInput dateFrom"
                                value="{0}" />
                                 - <input type="textarea" name="dateTo"
                                class="dateInput dateTo" value="{1}" />
                            </td>
                            <td>
                                Отображать заказы контрагента:<br />
                                <select class="counterparty_select" name="counterparty">
                                    {2}
                                </select>
                            </td>
                            <td>
                                <div class="datePickButton">Обновить журнал</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
        <div id="payment_ajax_div">
        {3}
        <script type="text/javascript">
        $(document).ready( function(){{
            $.ajax({{
                type: "POST",
                url: "/1cengine/py_scripts/get_payments_list.py",
                async: true,
                data: "UID={4}{5}{6}{7}&from_ajax=true",
                success: function(html) {{
                    $("#payment_ajax_div").html(html)

                }}

            }});

        }})

        </script>
        </div>
    """.format(
        date_from_value,
        date_to_value,
        cp_option,
        loader_str,
        UID,
        date_from_par,
        date_to_par,
        counterparty_par
    )

    return ajax


def get_payment_list_html(UID, date_from, date_to, counterparty):

    # client = SoapClient(
    #     wsdl=_CURRENT_ADDRESS_ + "privetoffice.1cws?wsdl",
    #     location=_CURRENT_ADDRESS_ + "privetoffice.1cws"
    # )
    # response = client.PaymentList(UID, date_from, date_to)
    # result = response['PaymentListResponse']


    client = Client(_CURRENT_ADDRESS_ + 'privetoffice.1cws?wsdl',
                    location=_CURRENT_ADDRESS_ + "privetoffice.1cws")

    client.options.cache.clear()
    client.set_options(cache=None)
    # client.set_options(cache=DocumentCache())

    if counterparty is None:
        counterparty = u"Все"

    result = client.service.PaymentList(
        UID,
        date_from,
        date_to,
        urllib.unquote(counterparty).decode('utf8').replace("+"," ")
    )

    # return result

    # print "nya"
    # print result

    listOrder = ""

    # listOrder = listOrder + """
    #     <div class="orderListHeader">
    #         <span>Документ оплаты</span>
    #         <span>Сумма</span>
    #         <span>Документ основания</span>
    #         <span><a href="javascript:pass()">Дата
    #         <img class="date_arrow"
    #         src="/1cengine/kabinet_payment/arrow_down.svg" /></a></span>
    #     </div>
    #     <div id="ordersContainer">
    # """

    listOrder = listOrder + """
        <table cellspacing=0>
            <thead class="orderListHeader">
                <tr>
                    <th>Документ оплаты</th>
                    <th>Документ основания</th>
                    <th>Дата</th>
                    <th>Сумма</th>
                    <th>Скачать</th>
                </tr>
            </thead>
            <tbody>
    """

    odd = "odd"

    regex = re.compile(r"\s\d+:\d+:\d+")

    orders = ""
    for order in result[2][0]:

        if "None" in str(order[6]):
            rplc = ""
        else:
            rplc = str(order[6])

        orders = orders + """
            <tr class="orderItem """ + odd + """ ">
                <td>""" + regex.sub("", str(order[0])) + """</td>
                <td>""" + regex.sub("", str(order[6])) + """</td>
                <td>""" + regex.sub("", str(order[1])) + """</td>
                <td class="sum_td">""" + str(order[2]) + """</td>
                <td>pdf</td>
            </tr>
        """

        if odd == "odd":
            odd = ""
        else:
            odd = "odd"

    listOrder = listOrder + orders + "</tbody></table>"

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
        if "counterparty" in post:
            counterparty = post["counterparty"]
        else:
            counterparty = None

        payment_list = get_payment_list_html(UID, date_from, date_to, counterparty)

        print payment_list

# form = cgi.FieldStorage()
# if "from_ajax" in form:
#     print "Content-Type: text/html; charset=utf-8\n"

#     UID = form["UID"].value
#     if "date_from" in form:
#         date_from = form["date_from"].value
#     else:
#         date_from = None
#     if "date_to" in form:
#         date_to = form["date_to"].value
#     else:
#         date_to = None

#     payment_list = get_payment_list_html(UID, date_from, date_to)

#     print payment_list