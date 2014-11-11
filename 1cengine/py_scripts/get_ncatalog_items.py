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
        self.in_stock = 0
        self.price_array = []

class Item():
    def __init__(self, name):
        self.name = name

        self.hash = ""
        self.unit = ""
        self.char_array = {}
        self.in_stock = 0
        self.price_array = []
        self.is_char_price = True

    def add_char(self, char_name, char):
        if char_name not in self.char_array:
            self.char_array[char_name] = char

    def add_price(self, price_type, price, in_stock, char_name=""):
        if self.is_char_price:
            char = self.char_array[char_name]
            if (price_type, price) not in char.price_array:
                char.price_array.append((price_type, price))
                char.in_stock = in_stock
        else:
            if (price_type, price) not in self.price_array:
                self.price_array.append((price_type, price))
                self.in_stock = in_stock


class ResultTable():
    def __init__(self, group_name):
        self.group_name = group_name

        self.items_list = {}



    def get_items(self, offset=0, limit=20, params={}):

        connector = myDBC("catalog")
        connector.dbConnect()

        if "pa" in params:
            if params["pa"].__len__() > 1:
                parent = " OR ".join(params["pa"])
            else:
                parent = params["pa"][0]
            parent = "AND ({0}) AND `item`.`item_parent_ref`=`item_parent`.`id`".format(parent)
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

        if "he" in params:
            if params["he"].__len__() > 1:
                height = " OR ".join(params["he"])
            else:
                height = params["he"][0]
            height = "AND ({0})".format(height)
        else:
            height = ""

        is_optional_length_query = """
            SELECT `char_price`
            FROM `site_group`
            WHERE `id`='{0}'
        """.format(self.group_name)

        r = connector.dbExecute(is_optional_length_query)
        opt_len = False
        for line in r:
            if line[0] == 0:
                opt_len = True

        if opt_len:
            query = """
                SELECT `item`.`name`, `item`.`name`, `item`.`ed_izm`,
                    `item_price`.`price`, `price_type`.`name`, `item`.`hash`,
                    `item_parent`.`name`, `item_price`.`is_char`, `item`.`hash`,
                    `item_price`.`in_stock`
                    FROM `item`, `item_price`, `price_type`,
                    `item_parent`
                    WHERE `item`.`site_group_ref`='{0}'
                    AND `item`.`id` IN ( SELECT * FROM (
                    SELECT DISTINCT `item`.`id` FROM `item`, `item_parent`
                    WHERE `item`.`site_group_ref`='{0}'
                    {1}
                    {2}
                    {3}
                    {4}
                    limit {5},{6}) as `id`
                    )
                    AND `item_price`.`item_ref`=`item`.`id`
                    AND `item_price`.`is_char`='0'
                    AND `item_price`.`price_type_ref`=`price_type`.`id`
                    AND `item_parent`.`id` = `item`.`item_parent_ref`
            """.format(self.group_name, parent, thickness, diameter, height, offset, limit)
        else:
            query = """
                SELECT `item`.`name`, `char`.`name`, `item`.`ed_izm`,
                    `item_price`.`price`, `price_type`.`name`, `item`.`hash`,
                    `item_parent`.`name`, `item_price`.`is_char`, `char`.`hash`,
                    `item_price`.`in_stock`
                    FROM `item`, `char`, `item_price`, `price_type`,
                    `item_parent`
                    WHERE `item`.`site_group_ref`='{0}'
                    AND `item`.`id` IN ( SELECT * FROM (
                    SELECT DISTINCT `item`.`id` FROM `item`, `item_parent`
                    WHERE `item`.`site_group_ref`='{0}'
                    {1}
                    {2}
                    {3}
                    {4}
                    ORDER BY `item`.`name` LIMIT {5},{6}) as `id`
                    )
                    AND `char`.`item_ref`=`item`.`id`
                    AND `item_price`.`item_ref`=`char`.`id`
                    AND `item_price`.`is_char`='1'
                    AND `item_price`.`price_type_ref`=`price_type`.`id`
                    AND `item_parent`.`id` = `item`.`item_parent_ref`
                    ORDER BY `item`.`name`
            """.format(self.group_name, parent, thickness, diameter, height, offset, limit)

        # print query

        r = connector.dbExecute(query)


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

            if line[7] == 1:
                item.is_char_price = True
                char = Char(line[1])
                char.hash = line[8]
                item.add_char(line[1], char)
                item.add_price(line[4], line[3], line[9], line[1])
            elif line[7] == 0:
                item.is_char_price = False
                item.add_price(line[4], line[3], line[9])

        return self.items_list




def compose_table(term, offset=0, limit=20, params={}):

    rt = ResultTable(term.encode("utf-8"))

    groups = rt.get_items(offset, limit, params)

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
        ITEM_LIST_KEYS = sorted(ITEM_LIST.keys())

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

        for item_n in ITEM_LIST_KEYS:
            item = ITEM_LIST[item_n]

            min_price = ""
            stock_class = ""
            _IN_STOCK = True
            prices_container = soup.new_tag("div")

            if item.is_char_price:
                char_select = soup.new_tag("select")
                char_select["class"] = "item_billet_select_char"

                is_first = " selected_price"
                # char_list = "<select>"

                rebuilt_achar_array = []

                for char in item.char_array:
                    char_hash = item.char_array[char].hash
                    in_stock = item.char_array[char].in_stock
                    char_option = soup.new_tag("option")
                    char_option["name"] = char_hash.decode("utf-8")
                    char_option["stock"] = in_stock
                    char_option.append(char)
                    _IN_STOCK = False
                    if in_stock == 1:
                        char_select.insert(0,char_option)
                        _IN_STOCK = True
                    else:
                        char_select.append(char_option)
                    # char_list = char_list + "<option>" + char + "</option>"
                    if in_stock == 0:
                        stock_class = " out_of_stock"
                    else:
                        stock_class = ""

                    price_ul = soup.new_tag("ul")
                    price_ul["class"] = "item_billet_select_price{0}{1}".format(
                        is_first, stock_class
                    )
                    is_first = ""
                    price_ul["for"] =  char_hash.decode("utf-8")

                    for price in item.char_array[char].price_array:

                        price_li = soup.new_tag("li")
                        price_li.append(price[0])
                        price_li.append(": ")
                        price_li_strong = soup.new_tag("strong")
                        price_li_strong.append(
                            (
                                locale.format(
                                    "%d", float(price[1]), grouping=True
                                ) + locale.format("%.2f", float(price[1]))[-3:]
                            ).replace(" ", "\xc2\xa0")
                        )
                        price_li.append(price_li_strong)

                        price_ul.append(price_li)

                        if min_price is "" or price[1] < min_price:
                            min_price = price[1]
                        else:
                            pass

                    prices_container.append(price_ul)
                # print min_price
                min_price = (
                    locale.format(
                        "%d", float(min_price), grouping=True
                    ) + locale.format("%.2f", float(min_price))[-3:]
                ).replace(" ", "\xc2\xa0")

            else:
                char_select = soup.new_tag("span")
                char_select.append(u"""
                    Вы можете задать нужную длину листа в установленных пределах.
                    """)

                # char_list = "<select>"
                price_ul = soup.new_tag("ul")
                price_ul["class"] = "item_billet_select_price{0}".format(
                    " selected_price"
                )
                price_ul["for"] = "0"

                for price in item.price_array:

                    price_li = soup.new_tag("li")
                    price_li.append(price[0])
                    price_li.append(": ")
                    price_li_strong = soup.new_tag("strong")
                    price_li_strong.append(
                        (
                            locale.format(
                                "%d", float(price[1]), grouping=True
                            ) + locale.format("%.2f", float(price[1]))[-3:]
                        ).replace(" ", "\xc2\xa0")
                    )
                    price_li.append(price_li_strong)

                    price_ul.append(price_li)

                    if min_price is "" or price[1] < min_price:
                        min_price = price[1]
                    else:
                        pass
                # print min_price
                min_price = (
                    locale.format(
                        "%d", float(min_price), grouping=True
                    ) + locale.format("%.2f", float(min_price))[-3:]
                ).replace(" ", "\xc2\xa0")

                prices_container.append(price_ul)

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
            item_billet_tr["class"] = "{0} item_billet{1}".format(item.hash, oddity)
            item_billet_tr["lolid"] = item.hash

            item_billet_main_td = soup.new_tag("td")
            item_billet_main_td["colspan"] = 3

            item_billet_div = soup.new_tag("div")
            item_billet_name_span = soup.new_tag("span")
            item_billet_name_span["class"] = "billet_item_name"
            item_billet_name_span["itemprop"] = "name"
            item_billet_name_span.append(item.name)
            item_billet_less_span = soup.new_tag("span")
            item_billet_less_span["name"] = item.hash
            item_billet_less_span["class"] = "less"
            item_billet_less_span.append(u"Скрыть ∧")
            item_billet_length_p = soup.new_tag("p")
            item_billet_length_p.append(u"Возможные размеры: ")
            item_billet_length_p.append(char_select)
            item_billet_length_p.append(u" м.")

            ###

            item_billet_table = soup.new_tag("table")

            item_billet_table_upper_tr = soup.new_tag("tr")

            item_billet_table_upper_img_td = soup.new_tag("td")
            item_billet_table_upper_img_td["rowspan"] = "2"
            item_billet_table_upper_img_td["class"] = "billet_item_image"

            item_billet_table_upper_img = soup.new_tag("img")
            item_billet_table_upper_img["src"] = "/1cengine/site/images/eye_pic/default.png"

            item_billet_table_upper_img_td.append(item_billet_table_upper_img)

            item_billet_table_upper_name_td = soup.new_tag("td")
            item_billet_table_upper_name_td["class"] = "billet_item_name_td"
            item_billet_table_upper_name_td.append(item_billet_name_span)

            item_billet_table_upper_price_td = soup.new_tag("td")
            item_billet_table_upper_price_td["rowspan"] = "2"
            item_billet_table_upper_price_td.append(prices_container)

            item_billet_table_upper_less_td = soup.new_tag("td")
            item_billet_table_upper_less_td.append(item_billet_less_span)

            item_billet_table_upper_tr.append(item_billet_table_upper_img_td)
            item_billet_table_upper_tr.append(item_billet_table_upper_name_td)
            item_billet_table_upper_tr.append(item_billet_table_upper_price_td)
            item_billet_table_upper_tr.append(item_billet_table_upper_less_td)

            ###

            item_billet_table_lower_tr = soup.new_tag("tr")

            item_billet_table_lower_char_td = soup.new_tag("td")
            item_billet_table_lower_char_td.append(item_billet_length_p)

            # item_billet_table_lower_price_td = soup.new_tag("td")

            item_billet_table_lower_buy_td = soup.new_tag("td")
            item_billet_table_lower_buy_td["class"] = "itemBuy"

            item_buy_span_tag = soup.new_tag("span")
            item_buy_span_tag["class"] = "buySpan"

            item_buy_a_tag = soup.new_tag("a")
            if _IN_STOCK:
                item_buy_span_tag.string = "Рассчитать"
                item_buy_a_tag["class"] = u"bItem"
            else:
                item_buy_span_tag.string = "Под заказ"
                item_buy_a_tag["class"] = u"oItem"
            item_buy_a_tag["name"] = item.hash
            item_buy_a_tag["href"] = u"Добавить в корзину"

            item_buy_a_tag["onClick"] = u"""yaCounter15882208.reachGoal(
                'onBuyLinkPressed', 'купить');
                return false"""

            item_buy_a_tag.append(item_buy_span_tag)
            item_billet_table_lower_buy_td.append(item_buy_a_tag)


            item_billet_table_lower_tr.append(item_billet_table_lower_char_td)
            # item_billet_table_lower_tr.append(item_billet_table_lower_price_td)
            item_billet_table_lower_tr.append(item_billet_table_lower_buy_td)

            ###

            item_billet_table.append(item_billet_table_upper_tr)
            item_billet_table.append(item_billet_table_lower_tr)

            item_billet_div.append(item_billet_table)

            ###

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

    offset = 0
    limit = 20
    if "page" in form:
        xy = int(form["page"].value)
        if xy != 1:
            offset = ((xy + (xy-1)-1) * 10)

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

            if "he_" in param:
                if "he" in params:
                    params["he"].append("`item`.`height`='"+param.replace("he_", "", 1)+"'")
                else:
                    params["he"] = []
                    params["he"].append("`item`.`height`='"+param.replace("he_", "", 1)+"'")

        # print param_string
        print str(compose_table(form["hash"].value.decode("utf-8"), offset, limit, params))

    else:
        print str(compose_table(form["hash"].value.decode("utf-8"), offset, limit))
