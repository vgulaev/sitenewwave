#!/web/trimetru/python/bin/python2.6
# -*- coding: utf-8 -*-

import sys
import os
import cgi

import imp
import cgitb
cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))
reload(sys)
sys.setdefaultencoding('utf-8')

print("Content-Type: text/html; charset=utf-8\n")

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
# _DEVELOPING_ADDRESS_ = "http://192.168.194.14/trimet_trade/ws/"
_PRODUCTION_ADDRESS_ = "http://195.239.221.58:30080/trimet_trade/ws/"

if "dev" in os.environ["SERVER_NAME"]:
    _CURRENT_ADDRESS_ = _DEVELOPING_ADDRESS_
else:
    _CURRENT_ADDRESS_ = _PRODUCTION_ADDRESS_


def translit(letter):
    ru_en_dict = {
        "а":  "a",  "б": "b",  "в": "v",   "г": "g",
        "д":  "d",  "е": "e",  "ё": "yo",  "ж": "zh",
        "з":  "z",  "и": "i",  "й": "j",   "к": "k",
        "л":  "l",  "м": "m",  "н": "n",   "о": "o",
        "п":  "p",  "р": "r",  "с": "s",   "т": "t",
        "у":  "u",  "ф": "f",  "х": "x",   "ц": "cz",
        "ч":  "ch", "ш": "sh", "щ": "shh", "ъ": "``",
        "ы":  "y'", "ь": "`",  "э": "e`",  "ю": "yu",
        "я":  "ya", "0": "0",  "1": "1",   "2": "2",
        "3":  "3",  "4": "4",  "5": "5",   "6": "6",
        "7":  "7",  "8": "8",  "9": "9",   " ": " "
    }

    letter = letter.lower().encode('utf-8')
    return ru_en_dict[letter].upper()


def get_order(UID):

    # cache cleaning code
    # import os
    # import shutil
    # from tempfile import gettempdir as tmp
    # shutil.rmtree(os.path.join(tmp(), 'suds'), True)

    if UID is not None:

        client = Client(_CURRENT_ADDRESS_ + 'OrderKlient.1cws?wsdl',
                        location=_CURRENT_ADDRESS_ + "OrderKlient.1cws")

        # client.set_options(cache=None)
        client.set_options(cache=DocumentCache())

        try:
            result = client.service.GetOrders(UID)
            # return result
        except:
            return "<p>Ошибка в работе с веб сервисом</p>"

        if result[3].strip().__len__() != 0:
            pass
        else:
            return "<p>Не существующий номер заказа</p>"
        # print result[3]

        # try:

        result_table = "<table class='checkoutTable'>"
        result_table = result_table + "<caption>Заказ № " + result[3]
        order_number = ""
        for letter in result[3]:
            order_number = order_number + translit(letter)
        result_table = result_table + """
            <input style="display:none" name="o.number"
            type="text" id="o.number"
            value=\"""" + order_number + """\" /></caption>"""

        result_table = result_table + \
            "<thead><tr><th>Номенклатура</th><th>Количество шт.</th>\
            <th>Вес тн.</th><th>Цена за тн.</th><th>Сумма</th></tr></thead>"

        for good in result[2][0]:
            result_table = result_table + "<tr>"

            result_table = result_table + "<td>" + good[8] + "</td>"
            result_table = result_table + "<td>" + good[1] + "</td>"
            result_table = result_table + "<td>" + good[2] + "</td>"
            result_table = result_table + "<td>" + good[4] + "</td>"
            result_table = result_table + "<td>" + good[7] + "</td>"
            result_table = result_table + "</tr>"

        display_sum = result[5][:-3][:-3][:-3][-3:]
        display_sum = display_sum + "&nbsp;" + result[5][:-3][:-3][-3:]
        display_sum = display_sum + "&nbsp;" + result[5][:-3][-3:]
        display_sum = display_sum + result[5][-3:]


        result_table = result_table + "<tr class='sep_tr'><td></td><td></td><td></td><td></td><td></td></tr>"


        if u"Доставка" in result:
            result_table = result_table + "<tr>"
            result_table = result_table + "<td></td><td></td><td></td>"
            result_table = result_table + "<td>Доставка:</td>"
            result_table = result_table + "<td>" + str(result[u'Доставка'][1]) + "</td>"

            result_table = result_table + "</tr>"

        if u"Резка" in result:
            result_table = result_table + "<tr>"
            result_table = result_table + "<td></td><td></td><td></td>"
            result_table = result_table + "<td>Резка:</td>"
            result_table = result_table + "<td>" + str(result[u'Резка']) + "</td>"

            result_table = result_table + "</tr>"


        result_table = result_table + "<tr class='sep_tr'><td></td><td></td><td></td><td></td><td></td></tr>"

        result_table = result_table + """
        <tr class='f_sum'><td></td><td></td><td></td><td><strong>Итого: </strong>
        </td><td>""" + display_sum + """
        <input style="display:none" name="o.amount" type="text" id="o.amount" value=\"""" + str(result[5]).replace(".",",") + """\" />
         </td></tr></table>
        """

        result_table = result_table + """
            <input style="display:none" name="o.uid" type="text" id="o.uid"
            value=\"""" + str(UID) + """\"/>

            <table class="submit_table">
                <tr>
                    <td>
                        <label for="o.mail">*Вы можете указать адрес электронной почты, чтобы мы могли выслать на него электронный чек:</label>
                        <input type="textarea" class="set_mail" id="o.mail" name="o.mail" />
                    </td>
                    <td>
                        <input type="submit" class="submit_button" name="SubmitName" value="Оплатить" />
                    </td>
                </tr>
            </table>
        """

    else:
        result_table = "<p>Не задан идентификатор заказа</p>"

    return result_table


def __main__(funct_name):
    print eval(funct_name)


get = cgi.FieldStorage()

if "funkt" in get:
    __main__(get["funkt"].value)
