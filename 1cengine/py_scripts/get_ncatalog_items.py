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


    def get_items(self, parms={}):

        connector = myDBC("ncatalog")
        connector.dbConnect()

        if parms.__len__() < 1:

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

        else:
            if "pa" in params:
                if params["pa"].__len__() > 1:
                    parent = " OR ".join(params["pa"])
                else:
                    parent = params["pa"][0]
                parent = "AND ({0})".format(parent)
            else:
                parent = ""

            if "th" in params:
                if params["th"].__len__() > 1:
                    thickness = " OR ".join(params["th"])
                else:
                    thickness = params["th"][0]
                thickness = "AND ({0})".format(thickness)
            else:
                thickness = ""

            if "di" in params:
                if params["di"].__len__() > 1:
                    diameter = " OR ".join(params["di"])
                else:
                    diameter = params["di"][0]
                diameter = "AND ({0})".format(diameter)
            else:
                diameter = ""

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
                {1}
                {2}
                {3}
            """.format(self.group_name, parent, thickness, diameter)
            # print query
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



def compose_table(term, params={}):

    rt = ResultTable(term.encode("utf-8"))

    groups = rt.get_items(params)

    result_table = soup.new_tag("table")
    result_table["id"] = "tableRes"

    result_table_tbody = soup.new_tag("tbody")

    result_table.append(result_table_tbody)

    # result = """
    #     <table id="tableRes">
    #         <tbody>
    # """

    odd=False

    for _item_group in groups:
        ITEM_LIST = groups[_item_group]

        item_header_tr = soup.new_tag("tr")
        item_header_tr["class"] = "iHeader"

        item_header_td_gname = soup.new_tag("td")
        strong = soup.new_tag("strong")
        strong.append(_item_group)
        item_header_td_gname.append(strong)

        item_header_td_price = soup.new_tag("td")
        item_header_td_price["class"] = "priceHeader"
        item_header_td_price.append(u"Цена")

        item_header_td_more = soup.new_tag("td")
        item_header_td_more.append(u"Рассчитать")
        item_header_td_more.append(soup.new_tag("br"))
        item_header_td_more.append(u"В корзину")

        item_header_tr.append(item_header_td_gname)
        item_header_tr.append(item_header_td_price)
        item_header_tr.append(item_header_td_more)

        result_table_tbody.append(item_header_tr)

        # result = result + """
        #     <tr class="iHeader">
        #         <td><strong>{0}</strong></td>
        #         <td class="priceHeader">Цена</td>
        #         <td>Расчитать<br />В корзину</td>
        #     </tr>
        # """.format(_item_group)

        for item_n in ITEM_LIST:
            item = ITEM_LIST[item_n]

            min_price = ""

            char_select = soup.new_tag("select")

            # char_list = "<select>"
            for char in item.char_array:
                char_option = soup.new_tag("option")
                char_option.append(char)

                char_select.append(char_option)
                # char_list = char_list + "<option>" + char + "</option>"

                for price in item.char_array[char].price_array:
                    if min_price is "" or price[1] < min_price:
                        min_price = price[1]
                    else:
                        pass

            min_price = (
                locale.format(
                    "%d", float(min_price), grouping=True
                ) + locale.format("%.2f", float(min_price))[-3:]
            ).replace(" ", "\xc2\xa0")

            # char_list = char_list + "</select>"

            if odd:
                oddity = " ti_odd"
            else:
                oddity = ""

            item_list_tr = soup.new_tag("tr")
            item_list_tr["id"] = item.hash
            item_list_tr["class"] = "item{0}".format(oddity)

            items_list_name_td = soup.new_tag("td")
            items_list_name_td["class"] = "itemName"
            items_list_name_td.append(item.name)

            item_list_price_td = soup.new_tag("td")
            item_list_price_td.append(
                "от {0} за {1}.".format(min_price, item.unit)
            )

            item_list_more_td = soup.new_tag("td")
            item_list_more_span = soup.new_tag("span")
            item_list_more_span["name"] = item.hash
            item_list_more_span["class"] = "more"
            item_list_more_span.append(u"Подробнее ∨")
            item_list_more_td.append(item_list_more_span)

            item_list_tr.append(items_list_name_td)
            item_list_tr.append(item_list_price_td)
            item_list_tr.append(item_list_more_td)

            result_table_tbody.append(item_list_tr)

            item_billet_tr = soup.new_tag("tr")
            item_billet_tr["style"] = "display:none"
            item_billet_tr["class"] = "{0} item{1}".format(item.hash, oddity)

            item_billet_main_td = soup.new_tag("td")
            item_billet_main_td["colspan"] = 3

            item_billet_div = soup.new_tag("div")
            item_billet_name_span = soup.new_tag("span")
            item_billet_name_span.append(item.name)
            item_billet_less_span = soup.new_tag("span")
            item_billet_less_span["name"] = item.hash
            item_billet_less_span["class"] = "less"
            item_billet_less_span.append(u"Скрыть ∧")
            item_billet_length_p = soup.new_tag("p")
            item_billet_length_p.append(u"Возможные размеры: ")
            item_billet_length_p.append(char_select)
            item_billet_length_p.append(u" м.")

            item_billet_div.append(item_billet_name_span)
            item_billet_div.append(item_billet_less_span)
            item_billet_div.append(item_billet_length_p)

            item_billet_main_td.append(item_billet_div)
            item_billet_tr.append(item_billet_main_td)

            result_table_tbody.append(item_billet_tr)


            # result = result + """

            #     # <tr id="{4}" class="item{5}">
            #     #     <td class="itemName">{0}</td>
            #     #     <td>Цена от {2} за {3}.</td>
            #     #     <td><span name="{4}" class="more">Подробнее ∨</span></td>
            #     # </tr>
            #     <tr class="{4} item{5}" style="display:none">
            #         <td colspan=3>
            #             <div>
            #                 <span>{0}</span><span name="{4}" class="less">Скрыть ∧</span>
            #                 <p>Возможные размеры: {1} м.</p>
            #             </div>
            #         </td>
            #     </tr>

            # """.format(
            #     item.name, char_list, min_price, item.unit, item.hash, oddity
            # )

            odd = odd.__xor__(True)

    # result = result + """
    #     </tbody>
    # </table>
    # """

    return result_table

form = cgi.FieldStorage()
if "term" in form:
    print "Content-Type: text/html; charset=utf-8\n"
    print str(compose_table(form["term"].value.decode("utf-8")))
    # print form["term"].value
    # result_table = compose_table(form["term"].value.decode("utf-8"))

    # print result_table

if "hash" in form:

    print "Content-Type: text/html; charset=utf-8\n"


    if "params" in form and form["params"].value != ";":
        # print "|"+form["params"].value+"|"
        params = {}
        param_string = form["params"].value
        param_arr = param_string.replace(
            "'", "", 1
        ).replace(
            "',;", ""
        ).split("','")

        for param in param_arr:
            if "pa_" in param:
                if "pa" in params:
                    params["pa"].append("`item_parent`.`name`='"+param.replace("pa_", "", 1)+"'")
                else:
                    params["pa"] = []
                    params["pa"].append("`item_parent`.`name`='"+param.replace("pa_", "", 1)+"'")

            if "th_" in param:
                if "th" in params:
                    params["th"].append("`item`.`thickness`='"+param.replace("th_", "", 1)+"'")
                else:
                    params["th"] = []
                    params["th"].append("`item`.`thickness`='"+param.replace("th_", "", 1)+"'")

            if "di_" in param:
                if "di" in params:
                    params["di"].append("`item`.`diameter`='"+param.replace("di_", "", 1)+"'")
                else:
                    params["di"] = []
                    params["di"].append("`item`.`diameter`='"+param.replace("di_", "", 1)+"'")

        # print param_string
        print str(compose_table(form["hash"].value.decode("utf-8"), params))

    else:
        print str(compose_table(form["hash"].value.decode("utf-8")))
