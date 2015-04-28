#!/web/trimetru/python/bin/python2.6
# -*- coding: utf-8 -*-

import sys
import os
import cgi
import cgitb
import MySQLdb
import urllib
cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))
reload(sys)
sys.setdefaultencoding('utf-8')

# print ("Content-Type: text/html; charset=utf-8\n")

_PATH_ = os.path.abspath(os.path.dirname(__file__))

import imp
py_scripts_path = os.path.expanduser('~/web/sitenewwave/1cengine/py_scripts/') #development
# py_scripts_path = os.path.expanduser('~/site/www/1cengine/py_scripts/') #production

secrets_lib_name = "secrets"
secrets_lib_path = "structures/secrets.py"
secrets = imp.load_source(
    secrets_lib_name,
    _PATH_ + "/" + secrets_lib_path
)

database = secrets.databases["extra"]

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

# _CURRENT_ADDRESS_ = _DEVELOPING_ADDRESS_
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


def get_managers():
    conn = MySQLdb.connect(host=database["host"],
                       user=database["user"],
                       passwd=database["passwd"],
                       db=database["db"])


    conn.set_character_set('utf8')
    cursor = conn.cursor()

    exec_text = """
        SELECT *
        FROM `stuff`
        WHERE `department`='Отдел продаж'
    """

    cursor.execute(exec_text)
    r = cursor.fetchall()

    managers = {}
    # print r
    for row in r:
        if row[1] not in managers:
            phn = row[3].replace(" ", "&nbsp;")
            managers[row[1]] = [row[2], phn, row[4]]
        # print row[1]
        # print " : "
        # print row[2]
        # print " : "
        # print row[3]
        # print " : "
        # print row[4]
        # print "<br />"

    return managers

def get_counterparty_list(UID):

    python_lib_name = "1c_user_interaction"
    user_1c_lib = imp.load_source(
        python_lib_name, _PATH_ + "/" + python_lib_name + ".py")

    user_1c = user_1c_lib.User1C()
    user_data = user_1c.get_user_information(UID)
    # print user_data[8]
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

    # if "from_ajax" in post:
    #     res = get_order_list_ajax(UID,date_from,date_to)

    # else:
    #     res = get_order_list_html(UID,date_from,date_to)

    return get_order_list_ajax(UID, date_from, date_to, counterparty)


def get_order_list_ajax(UID, date_from, date_to, counterparty):

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

    if date_from_value == "" and date_to_value == "":
        info_message = """
            <p class="info_message_c">
                * Показаны последние 10 документов *
            </p>
        """
    else:
        info_message = ""

    cp_option = "<option value='Все'>Все</option>"

    # cp_option = get_counterparty_list(UID)

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
            <form method="POST" action="/kabinet/orders/" id="dateForm">
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
        <div id="order_ajax_div">
        {3}
        <script type="text/javascript">
        $(document).ready( function(){{
            $.ajax({{
                type: "POST",
                url: "/1cengine/py_scripts/get_orders_list.py",
                async: true,
                data: "UID={4}{5}{6}{7}&from_ajax=true",
                success: function(html) {{
                    $("#order_ajax_div").html(html)
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


def get_order_list_html(UID, date_from, date_to, counterparty):
    # print get_counterparty_list(UID)
    managers = get_managers()

    client = Client(_CURRENT_ADDRESS_ + 'privetoffice.1cws?wsdl',
                    location=_CURRENT_ADDRESS_ + "privetoffice.1cws")
    client.set_options(cache=DocumentCache())

    # client.set_options(cache=None)

    if counterparty is None:
        counterparty = u"Все"

    result = client.service.OrderLists(
        UID,
        date_from,
        date_to,
        urllib.unquote(counterparty).decode('utf8').replace("+"," ")
    )

    # print "nya"
    # print result

    listOrder = ""

    listOrder = listOrder + """
        <table cellspacing=0>
        <thead>
        <tr class="orderListHeader">
            <th>Номер</th>
            <th>Сумма</th>
            <th>Статус</th>
            <th>Контрагент</th>
            <th>Ответственный</th>
            <th><a href="javascript:pass()">Дата
            <span class="date_arrow" way="down"> ▾ </span></a></th>
        </tr>
        </thead>
        <tbody id="ordersContainer">
    """

    odd = "odd"

    orders = ""
    for order in result[2][0]:
        if "None" in str(order[4]):
            rplc = ""
        else:
            if str(order[4]) in managers:
                rplc = """
                    <span class="manager_show" title="">
                    """ + str(order[4]) + """
                    </span>
                    <div class="m_info_wrapper">
                        <p>
                            Городской:
                        </p>
                        <p>
                            <strong>
                                <nobr>+7&nbsp;(3452)&nbsp;520-670</nobr>
                            </strong>
                            <br />
                            доб.&nbsp;<strong>{0}</strong>
                        </p>
                        <hr />
                        <p>
                            Сотовый:
                        </p>
                        <p>
                            <strong><nobr>{1}</nobr></strong>
                        </p>
                        <hr />
                        <p>Почта:</p>
                        <p><strong>{2}</strong></p>
                    </div>
                """.format(
                    str(managers[str(order[4])][0]),
                    str(managers[str(order[4])][1]),
                    str(managers[str(order[4])][2])
                )

            else:
                rplc = str(order[4])

        if order[7] is not None:
            download_links = """
                Скачать:
                    <a href='javascript:openLink(
                        \"""" + str(order[0]) + """\","pdf", "order")'
                        title="Скачать заказ в формате pdf"> заказ </a> 
                    <a href='javascript:openLink(
                        \"""" + str(order[7]) + """\","pdf", "rezka")'
                        title="Скачать бланк резки в формате pdf"> бланк резки </a>
            """
        else:
            download_links = """
                Скачать:
                    <a href='javascript:openLink(
                        \"""" + str(order[0]) + """\","pdf", "order")'
                        title="Скачать заказ в формате pdf"> заказ </a>
            """

        orders = orders + """
            <tr class="orderItem """ + odd + """ ">
                    <td>
                        <span class="show_order_download">
                        """ + str(order[3]) + """
                        </span>
                        <p class="orderDownload">
                        """ + download_links + """
                        </p>

                    </td>
                    <td class="num_cell">""" + str(order[2]) + """</td>
                    <td>""" + str(order[6]) + """</td>
                    <td>""" + str(order[5]) + """</td>
                    <td>""" + rplc + """</td>
                    <td class="orderDate">
                        """ + str(order[1].split(" ")[0]) + """
                    </td>
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

        order_list = get_order_list_html(UID, date_from, date_to, counterparty)

        print order_list

