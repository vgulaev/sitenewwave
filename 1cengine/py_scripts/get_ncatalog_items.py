#!/web/trimetru/python/bin/python2.6
# -*- coding: utf-8 -*-


import sys
import os
import cgi
import cgitb
cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))
from bs4 import BeautifulSoup

from secrets import *

import locale
locale.setlocale(locale.LC_ALL, ("ru_RU.UTF-8"))

soup = BeautifulSoup()

print "Content-Type: text/html; charset=utf-8\n"

ITEM_LIST = {}


class Char():
    def __init__(self, name):
        self.name = name

        self.hash = ""

        self.price_array = []

class Item():
    def __init__(self, name):
        self.name = name

        self.hash = ""
        self.unit = ""
        self.char_array = {}
        self.price_array = []

    def add_char(self, char_name, char):
        if char_name not in self.char_array:
            self.char_array[char_name] = char

    def add_price(self, price_type, price, char_name):
        char = self.char_array[char_name]
        if (price_type, price) not in char.price_array:
            char.price_array.append((price_type, price))


class ResultTable():
    def __init__(self, group_name):
        self.group_name = group_name

        self.items_list = {}


    def get_items(self):

        connector = myDBC("ncatalog")
        connector.dbConnect()

        query = """
            SELECT `item`.`name`, `char`.`name`, `item`.`ed_izm`,
            `item_price`.`price`, `price_type`.`name`, `item`.`hash`,
            `item_parent`.`name`
            FROM `item`, `char`, `site_group`, `item_price`, `price_type`,
            `item_parent`
            WHERE `site_group`.`name`='{0}'
            AND `item`.`site_group_ref`=`site_group`.`id`
            AND `char`.`item_ref`=`item`.`id`
            AND `item_price`.`item_ref`=`item`.`id`
            AND `item_price`.`price_type_ref`=`price_type`.`id`
            AND `item_parent`.`id` = `item`.`item_parent_ref`
        """.format(self.group_name)

        r = connector.dbExecute(query)

        connector.dbClose()

        for line in r:

            if line[6] in self.items_list:
                _item_list = self.items_list[line[6]]
            else:
                _item_list = self.items_list[line[6]] = {}

            if line[0] in _item_list:
                item = _item_list[line[0]]
            else:
                item = Item(line[0])
                item.unit = line[2]
                item.hash = line[5]

                _item_list[line[0]] = item

            char = Char(line[1])
            item.add_char(line[1], char)
            item.add_price(line[4], line[3], line[1])

        return self.items_list



def compose_table(term):

    rt = ResultTable(term.encode("utf-8"))

    groups = rt.get_items()

    result = """
        <table id="tableRes">
            <tbody>
    """

    odd=False

    for _item_group in groups:
        ITEM_LIST = groups[_item_group]

        result = result + """
            <tr class="iHeader">
                <td><strong>{0}</strong></td>
                <td class="priceHeader">Цена</td>
                <td>Расчитать<br />В корзину</td>
            </tr>
        """.format(_item_group)

        # print header

        for item_n in ITEM_LIST:
            item = ITEM_LIST[item_n]

            min_price = ""

            char_list = "<select>"
            for char in item.char_array:
                char_list = char_list + "<option>" + char + "</option>"

                for price in item.char_array[char].price_array:
                    if min_price is "" or price[1] < min_price:
                        min_price = price[1]
                    else:
                        pass

            char_list = char_list + "</select>"

            if odd:
                oddity = " ti_odd"
            else:
                oddity = ""

            result = result + """
                <tr id="{4}" class="item{5}">
                    <td class="itemName">{0}</td>
                    <td>Цена от {2} за {3}.</td>
                    <td><span name="{4}" class="more">Подробнее ∨</span></td>
                </tr>
                <tr class="{4} item{5}" style="display:none">
                    <td colspan=3>
                        <div>
                            <span>{0}</span><span name="{4}" class="less">Скрыть ∧</span>
                            <p>Возможные размеры: {1} м.</p>
                        </div>
                    </td>
                </tr>

            """.format(
                item.name, char_list, min_price, item.unit, item.hash, oddity
            )

            odd = odd.__xor__(True)

    result = result + """
        </tbody>
    </table>
    """

    return result

form = cgi.FieldStorage()
if "term" in form:
    # print form["term"].value
    result_table = compose_table(form["term"].value.decode("utf-8"))

    print result_table

if "hash" in form:

    result_table = compose_table(form["term"].value)

    print result_table
