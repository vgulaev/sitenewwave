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


_DEVELOPING_ADDRESS_ = "http://192.168.194.27/trimet_trade_fedorov/ws/"
# _DEVELOPING_ADDRESS_ = "http://192.168.194.14/trimet_trade/ws/"
_PRODUCTION_ADDRESS_ = "http://195.239.221.58:30082/trimet_trade/ws/"

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
        "7":  "7",  "8": "8",  "9": "9",   " ": " ",
        "-":  "-"
    }

    letter = letter.lower().encode('utf-8')
    return ru_en_dict[letter].upper()


def get_tab_part_order(UID):

    # cache cleaning code
    # import os
    # import shutil
    # from tempfile import gettempdir as tmp
    # shutil.rmtree(os.path.join(tmp(), 'suds'), True)

    if UID is not None:

        client = Client(_CURRENT_ADDRESS_ + 'privetoffice.1cws?wsdl',
                        location=_CURRENT_ADDRESS_ + "privetoffice.1cws")

        # client.set_options(cache=None)
        client.set_options(cache=DocumentCache())

        # print client.service.GetOrders(UID)
        try:
            result = client.service.GetTabPartOrder(UID)
            # return result
        except:
            return "<p>Ошибка в работе с веб сервисом</p>"

        # print result

        return result

def compose_table(UID):

    order_str = get_tab_part_order(UID)

    order_obj = json.loads(order_str)

    order_table = """
        <tr><td colspan=6 class="order_tab_part">
        <div class="close_button" goal="{0}">x</div>
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th>Номенклатура</th>
                    <th>Характеристика</th>
                    <th>Кол-во</th>
                    <th>Ед. изм.</th>
                    <th>Цена</th>
                    <th>Ставка НДС</th>
                    <th>Сумма НДС</th>
                    <th>Сумма с НДС</th>
                </tr>
            </thead>
            <tbody>
    """.format(UID)

    for line in order_obj[u"ТабЧасть"]:

        output = """
            <tr>
                <td>{0}</td>
                <td>{1}</td>
                <td>{2}</td>
                <td class="num_cell">{3}</td>
                <td>{4}</td>
                <td class="num_cell">{5}</td>
                <td class="num_cell">{6}</td>
                <td class="num_cell">{7}</td>
                <td class="num_cell">{8}</td>
            </tr>
        """.format(
            line[u"НомерСтрока"],
            line[u"Номенклатура"],
            line[u"Характеристика"],
            line[u"Количество"],
            line[u"Упаковка"],
            line[u"Цена"],
            line[u"СтавкаНДС"],
            line[u"СуммаНДС"],
            line[u"СуммаСНДС"]
        )

        order_table = order_table + output

    order_table = order_table + """
        </td></tr></tbody></table>
    """
    print order_table


form = cgi.FieldStorage()
if "UID" in form:

    compose_table(form["UID"].value)
