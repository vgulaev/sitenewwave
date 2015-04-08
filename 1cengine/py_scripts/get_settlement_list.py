#!/web/trimetru/python/bin/python2.6
# -*- coding: utf-8 -*-

import sys
import os
import re
import cgi
import cgitb
import imp
import urllib
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

def get_shipping_list(UID):

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

    return get_settlement_list_ajax(UID, date_from, date_to, counterparty)


def get_settlement_list_ajax(UID, date_from, date_to, counterparty):

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

    loader_str = "<div><img src='/1cengine/kabinet_settlement/" + \
        random.choice(loader_list) + ".png' /></div>"

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
            <form method="POST" action="/kabinet/settlement/" id="dateForm">
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
        <div id="settlement_ajax_div">
        {3}
        <script type="text/javascript">
        $(document).ready( function(){{
            $.ajax({{
                type: "POST",
                url: "/1cengine/py_scripts/get_settlement_list.py",
                async: true,
                data: "UID={4}{5}{6}{7}&from_ajax=true",
                success: function(html) {{
                    $("#settlement_ajax_div").html(html)
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

def get_latest_settlements_html(UID, date_from, date_to, counterparty):
    client = Client(_CURRENT_ADDRESS_ + 'privetoffice.1cws?wsdl',
                    location=_CURRENT_ADDRESS_ + "privetoffice.1cws")

    client.set_options(cache=DocumentCache())

    # client.set_options(cache=None)
    # client.options.cache.clear()

    if counterparty is None:
        return None

    else:
        result = client.service.SettlementList(
            UID,
            date_from,
            date_to,
            urllib.unquote(counterparty).decode('utf8').replace("+"," ")
        )

        return result

def get_settlement_list_html(UID, date_from, date_to, counterparty):

    latest = get_latest_settlements_html(UID, date_from, date_to, counterparty)
    # print latest
    if latest is not None and latest[u"Журнал"].__len__() > 0:
    # if latest[0].__len__() > 0:
        list_payments_debts = """
            <table class="upper_settlement_table">
                <thead>
                    <tr class="settlementHeader">
                        <th>Дата</th>

                        <th>Начальный остаток</th>
                        <th>Приход</th>
                        <th>Расход</th>
                        <th>Конечный остаток</th>

                    </tr>
                </thead>
                <tbody>

        """
        shippings = ""
        regex = re.compile(r"\s\d+:\d+:\d+")
        odd = "odd"
        for pay in latest[0][0]:

            shippings = shippings + """
                <tr class="settlementItem """ + odd + """ ">
                    <td>""" + regex.sub("", str(pay[0])) + """</td>

                    <td>""" + str(pay[3]) + """</td>
                    <td>""" + str(pay[4]) + """</td>
                    <td>""" + str(pay[5]) + """</td>
                    <td>""" + str(pay[6]) + """</td>


                </tr>
            """

            if odd == "odd":
                odd = ""
            else:
                odd = "odd"

            # print pay, "<br />"

        list_payments_debts = list_payments_debts + shippings + "</tbody></table>"
    else:
        list_payments_debts = ""

    client = Client(_CURRENT_ADDRESS_ + 'privetoffice.1cws?wsdl',
                    location=_CURRENT_ADDRESS_ + "privetoffice.1cws")

    client.set_options(cache=DocumentCache())

    # client.set_options(cache=None)
    # client.options.cache.clear()

    if counterparty is None:
        counterparty = u"Все"

    result = client.service.GetReconciliationActList(
        UID,
        date_from,
        date_to,
        urllib.unquote(counterparty).decode('utf8').replace("+"," ")
    )

    # return result

    # print "nya"
    # print result


    listShipping = "" + list_payments_debts
    # listShipping = ""

    if result[u"Журнал"].__len__() > 0:
    # if result[0].__len__() > 0:

        listShipping = listShipping + """
            <table>
                <thead>
                    <tr class="settlementHeader">
                        <th>Документ</th>
                        <th>Дата</th>
                        <th>Начало периода</th>
                        <th>Конец периода</th>
                        <th>Скачать</th>
                    </tr>
                </thead>
                <tbody>
        """


        odd = "odd"

        regex = re.compile(r"\s\d+:\d+:\d+")

        shippings = ""


        for shipping in result[0][0]:
            shippings = shippings + """
                <tr class="settlementItem """ + odd + """ ">
                    <td>""" + regex.sub("", str(shipping[0])) + """</td>
                    <td>""" + regex.sub("", str(shipping[2])) + """</td>
                    <td>""" + regex.sub("", str(shipping[3])) + """</td>
                    <td>""" + regex.sub("", str(shipping[4])) + """</td>
                    <td>
                        <a href='javascript:openLink(
                            \"""" + str(shipping[1]) + """\","pdf")'
                            title="Скачать документ отгрузки в формате pdf"> pdf </a>
                    </td>
                </tr>
            """

            if odd == "odd":
                odd = ""
            else:
                odd = "odd"


        listShipping = listShipping + shippings + "</tbody></table>"

    return listShipping


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

        settlement_list = get_settlement_list_html(UID, date_from, date_to, counterparty)

        print settlement_list
