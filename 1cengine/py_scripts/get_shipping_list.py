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

# _DEVELOPING_ADDRESS_ = "http://192.168.194.14/fedorov_trimet_ut_copy/ws/"
_DEVELOPING_ADDRESS_ = "http://192.168.194.14/DemoTrimet/ws/"
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


def get_shipping_list(UID):

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

    return get_shipping_list_ajax(UID, date_from, date_to)


def get_shipping_list_ajax(UID, date_from, date_to):

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

    ajax = """
        <div class="dateChooser">
            <form method="POST" action="/kabinet/shipping/" id="dateForm">
                Показать отгрузки в период: <input type="textarea"
                name="dateFrom" class="dateInput dateFrom"
                value=\"""" + date_from_value + """\" /> - <input
                type="textarea" name="dateTo" class="dateInput dateTo"
                value=\"""" + date_to_value + """\" />
                <div class="datePickButton">Обновить журнал</div>
            </form>
        </div>
        <div id="shipping_ajax_div">
        """ + loader_str + """
        <script type="text/javascript">
        $(document).ready( function(){
            $.ajax({
                type: "POST",
                url: "/1cengine/py_scripts/get_shipping_list.py",
                async: true,
                data: "UID=""" + UID + date_from_par + date_to_par + \
                """&from_ajax=true",
                success: function(html) {
                    $("#shipping_ajax_div").html(html)
                    after_get_list()
                }
            });
        })
        </script>
        </div>
    """

    return ajax


def get_shipping_list_html(UID, date_from, date_to):
    client = Client(_CURRENT_ADDRESS_ + 'privetoffice.1cws?wsdl',
                    location=_CURRENT_ADDRESS_ + "privetoffice.1cws")

    client.set_options(cache=DocumentCache())

    result = client.service.ShippingList(UID, date_from, date_to)

    # return result

    # print "nya"
    # print result

    listShipping = ""

    listShipping = listShipping + """
        <div class="shippingListHeader">
            <span>Номер</span>
            <span>Сумма</span>
            <span>Тоннаж</span>
            <span><a href="javascript:pass()">Дата
            <img class="date_arrow"
            src="/1cengine/kabinet_shipping/arrow_down.svg" /></a></span>
        </div>
        <div id="shippingsContainer">
    """

    odd = "odd"

    shippings = ""
    for shipping in result[2][0]:
        shippings = shippings + """
            <div class="shippingItem """ + odd + """ ">
                <div>
                    <span class="openShippingDownload">
                    <img class="ar_img"
                    src="/1cengine/kabinet_shipping/arrow.svg" />
                    """ + str(shipping[3]) + """</span>
                    <span>""" + str(shipping[2]) + """</span>
                    <span class="weight">""" + str(shipping[4]) + """</span>
                    <span class="shippingDate">
                    """ + str(shipping[1].split(" ")[0]) + """</span>
                </div>

                <p class="shippingDownload">
                    Скачать документ отгрузки:
                    <a href='javascript:openLink(
                    \"""" + str(shipping[0]) + """\","xlsx")'
                    title="Скачать документ отгрузки в формате xls"> xls </a>
                    <a href='javascript:openLink(
                    \"""" + str(shipping[0]) + """\","pdf")'
                    title="Скачать документ отгрузки в формате pdf"> pdf </a>
                    <a href='javascript:openLink(
                    \"""" + str(shipping[0]) + """\","ods")'
                    title="Скачать документ отгрузки в формате ods"> ods </a>
                </p>
            </div>
        """

        if odd == "odd":
            odd = ""
        else:
            odd = "odd"

    listShipping = listShipping + shippings + "</div>"

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

        shipping_list = get_shipping_list_html(UID, date_from, date_to)

        print shipping_list
