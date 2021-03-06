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

    return get_shipping_list_ajax(UID, date_from, date_to, counterparty)


def get_shipping_list_ajax(UID, date_from, date_to, counterparty):

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

    loader_str = "<div><img src='/1cengine/kabinet_shipping/" + \
        random.choice(loader_list) + ".png' /></div>"

    if "dateFrom" in post:
        date_from_value = post["dateFrom"]
    else:
        date_from_value = ""

    if "dateTo" in post:
        date_to_value = post["dateTo"]
    else:
        date_to_value = ""

    if date_from_value == "" and date_to_value == "":
        info_message = """
            <p class="info_message_c">
                * Показаны последние 10 документов *
            </p>
        """
    else:
        info_message = ""

    cp_option = "<option value='Все'>Все</option>"

    for cp_list in get_counterparty_list(UID):
        cp = cp_list[0]
        cpb = cp_list[1]
        is_selected = ""
        if cp in ctext:
            is_selected = "selected"
        formatted_option = "<option value='{0}' balance='{2}' {1}>{0}</option>".format(cp, is_selected, cpb)
        cp_option = cp_option + formatted_option


    if "Розничный покупатель" in ctext:
        cp_option = cp_option + "<option value='Розничный покупатель' selected >Без контрагента</option>"
    else:
        cp_option = cp_option + "<option value='Розничный покупатель'>Без контрагента</option>"


    ajax = """
        <div class="dateChooser">
            <form method="POST" action="/kabinet/shipping/" id="dateForm">
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
        {8}
        <div id="shipping_ajax_div">
        {3}
        <script type="text/javascript">
        $(document).ready( function(){{
            $.ajax({{
                type: "POST",
                url: "/1cengine/py_scripts/get_shipping_list.py",
                async: true,
                data: "UID={4}{5}{6}{7}&from_ajax=true",
                success: function(html) {{
                    $("#shipping_ajax_div").html(html)
                    after_get_list()

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
        counterparty_par,
        info_message
    )

    return ajax


def get_shipping_list_html(UID, date_from, date_to, counterparty):
    client = Client(_CURRENT_ADDRESS_ + 'privetoffice.1cws?wsdl',
                    location=_CURRENT_ADDRESS_ + "privetoffice.1cws")

    client.set_options(cache=DocumentCache())

    if counterparty is None:
        counterparty = u"Все"

    result = client.service.ShippingList(
        UID,
        date_from,
        date_to,
        urllib.unquote(counterparty).decode('utf8').replace("+"," ")
    )

    # return result

    # print "nya"
    # print result

    listShipping = ""

    # listShipping = listShipping + """
    #     <div class="shippingListHeader">
    #         <span>Номер</span>
    #         <span>Сумма</span>
    #         <span>Тоннаж</span>
    #         <span><a href="javascript:pass()">Дата
    #         <img class="date_arrow"
    #         src="/1cengine/kabinet_shipping/arrow_down.svg" /></a></span>
    #     </div>
    #     <div id="shippingsContainer">
    # """

    # odd = "odd"

    listShipping = listShipping + """
        <table cellspacing=0>
            <thead>
                <tr class="shippingListHeader">
                    <th>Документ</th>
                    <th>Сумма</th>
                    <th>Тоннаж</th>
                    <th><a href="javascript:pass()">Дата
                    <span class="date_arrow" way="down"> ▾ </span></a></th>
                </tr>
            </thead>
            <tbody id="shippingsContainer">
    """

    odd = "odd"

    regex = re.compile(r"\s\d+:\d+:\d+")

    shippings = ""
    for shipping in result[2][0]:

        shipping_name = regex.sub("", str(shipping[0])).replace(
            u"Реализация товаров и услуг", u"Товарная накладная"
        )

        shippings = shippings + """
            <tr class="shippingItem """ + odd + """ " name='"""+str(shipping[3])+"""'>
                    <td>
                        <span class="show_order_download">
                        """ + shipping_name + """
                        </span>
                        <p class="orderDownload">
                            Скачать:
                                <a href='javascript:openLink(
                                    \"""" + str(shipping[3]) + """\","pdf")'
                                    title="Скачать документ отгрузки в формате pdf"> pdf </a> 
                                <a href='javascript:showTabPart(
                                    \"""" + str(shipping[3]) + """\")'> Показать список товаров </a>
                            </td>
                        </p>
                    <td class="num_cell">""" + str(shipping[2]) + """</td>
                    <td class="num_cell">""" + str(shipping[4]) + """</td>
                    <td class="shippingDate">
                        """ + str(shipping[1].split(" ")[0]) + """
                    </td>
                    </tr>
        """


        # shippings = shippings + """
        #     <div class="shippingItem """ + odd + """ ">
        #         <div>
        #             <span class="openShippingDownload">
        #             <img class="ar_img"
        #             src="/1cengine/kabinet_shipping/arrow.svg" />
        #             """ + str(shipping[3]) + """</span>
        #             <span>""" + str(shipping[2]) + """</span>
        #             <span class="weight">""" + str(shipping[4]) + """</span>
        #             <span class="shippingDate">
        #             """ + str(shipping[1].split(" ")[0]) + """</span>
        #         </div>

        #         <p class="shippingDownload">
        #             Скачать документ отгрузки:
        #             <a href='javascript:openLink(
        #             \"""" + str(shipping[0]) + """\","xlsx")'
        #             title="Скачать документ отгрузки в формате xls"> xls </a>
        #             <a href='javascript:openLink(
        #             \"""" + str(shipping[0]) + """\","pdf")'
        #             title="Скачать документ отгрузки в формате pdf"> pdf </a>
        #             <a href='javascript:openLink(
        #             \"""" + str(shipping[0]) + """\","ods")'
        #             title="Скачать документ отгрузки в формате ods"> ods </a>
        #         </p>
        #     </div>
        # """

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

        shipping_list = get_shipping_list_html(UID, date_from, date_to, counterparty)

        print shipping_list
