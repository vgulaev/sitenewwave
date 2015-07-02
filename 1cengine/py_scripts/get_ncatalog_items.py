#!/web/trimetru/python/bin/python2.6
# -*- coding: utf-8 -*-


import sys
import os
import cgi
import cgitb
cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))
from bs4 import BeautifulSoup

import imp
py_scripts_path = os.path.expanduser('~/web/sitenewwave/1cengine/py_scripts/') #development
# py_scripts_path = os.path.expanduser('~/site/www/1cengine/py_scripts/') #production

_PATH_ = os.path.abspath(os.path.dirname(__file__))

secrets_lib_name = "secrets"
secrets_lib_path = "structures/secrets.py"
secrets = imp.load_source(
    secrets_lib_name,
    _PATH_ + "/" + secrets_lib_path
)

myDBC = secrets.myDBC

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
        self.img_url = "/1cengine/site/images/eye_pic/default.png"

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

    def get_search_items(self, offset=0, limit=20):

        connector = myDBC("catalog")
        connector.dbConnect()

        # is_optional_length_query = """
        #     SELECT `char_price`
        #     FROM `site_group`
        #     WHERE `id`='{0}'
        # """.format(self.group_name)

        # r = connector.dbExecute(is_optional_length_query)
        # opt_len = False
        # for line in r:
        #     if line[0] == 0:
        #         opt_len = True

        query1 = """
            SELECT `item`.`name`, `item`.`name`, `item`.`ed_izm`,
                `item_price`.`price`, `price_type`.`name`, `item`.`hash`,
                `item_parent`.`name`, `item_price`.`is_char`, `item`.`hash`,
                `item_price`.`in_stock`, `site_group`.`img_url`
                FROM `item`, `item_price`, `price_type`,
                `item_parent`, `site_group`
                WHERE `item`.`name` LIKE '%{0}%'
                AND `item`.`id` IN ( SELECT * FROM (
                SELECT DISTINCT `item`.`id` FROM `item`, `item_parent`
                WHERE `item`.`name` LIKE '%{0}%'
                AND `item`.`item_parent_ref`=`item_parent`.`id`
                ORDER BY `item_parent`.`name`, `item`.`name` limit {1},{2}) as `id`
                )
                AND `item_price`.`item_ref`=`item`.`id`
                AND `item_price`.`is_char`='0'
                AND `item_price`.`price_type_ref`=`price_type`.`id`
                AND `item_parent`.`id` = `item`.`item_parent_ref`
                AND `site_group`.`id`=`item`.`site_group_ref`
                ORDER BY `item_parent`.`name`, `item`.`name`, `item_price`.`price` DESC
        """.format(self.group_name, offset, limit)

        query2 = """
            SELECT `item`.`name`, `char`.`name`, `item`.`ed_izm`,
                `item_price`.`price`, `price_type`.`name`, `item`.`hash`,
                `item_parent`.`name`, `item_price`.`is_char`, `char`.`hash`,
                `item_price`.`in_stock`, `site_group`.`img_url`,
                `price_type`.`id`
                FROM `item`, `char`, `item_price`, `price_type`,
                `item_parent`, `site_group`
                WHERE `item`.`name` LIKE '%{0}%'
                AND `item`.`id` IN ( SELECT * FROM (
                SELECT DISTINCT `item`.`id` FROM `item`, `item_parent`
                WHERE `item`.`name` LIKE '%{0}%'
                AND `item`.`item_parent_ref`=`item_parent`.`id`
                ORDER BY `item_parent`.`name`, `item`.`name` LIMIT {1},{2}) as `id`
                )
                AND `char`.`item_ref`=`item`.`id`
                AND `item_price`.`item_ref`=`char`.`id`
                AND `item_price`.`is_char`='1'
                AND `item_price`.`price_type_ref`=`price_type`.`id`
                AND `item_parent`.`id` = `item`.`item_parent_ref`
                AND `site_group`.`id`=`item`.`site_group_ref`
                ORDER BY `item_parent`.`name`, `item`.`name`, `item_price`.`price` DESC
        """.format(self.group_name, offset, limit)

        # print query

        r1 = connector.dbExecute(query1)
        r2 = connector.dbExecute(query2)

        for line in r1:

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
                item.img_url = line[10]

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

        for line in r2:

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
                item.img_url = line[10]

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

    def get_items_by_group_name(self, offset=0, limit=20, params={}):

        connector = myDBC("catalog")
        connector.dbConnect()

        # is_optional_length_query = """
        #     SELECT `char_price`
        #     FROM `site_group`
        #     WHERE `name`='{0}'
        # """.format(self.group_name)

        # r = connector.dbExecute(is_optional_length_query)
        # opt_len = False
        # for line in r:
        #     if line[0] == 0:
        #         opt_len = True

        query1 = """
            SELECT `item`.`name`, `item`.`name`, `item`.`ed_izm`,
                `item_price`.`price`, `price_type`.`name`, `item`.`hash`,
                `item_parent`.`name`, `item_price`.`is_char`, `item`.`hash`,
                `item_price`.`in_stock`, `site_group`.`img_url`
            FROM `item`, `item_price`, `price_type`,
                `item_parent`, `site_group`
            WHERE `site_group`.`name`='{0}'
                AND `item`.`id` IN (
                    SELECT * FROM (
                        SELECT DISTINCT `item`.`id`
                        FROM `item`, `item_parent`, `site_group`
                        WHERE `site_group`.`name`='{0}'
                            AND `item`.`item_parent_ref`=`item_parent`.`id`
                            AND `site_group`.`id`=`item`.`site_group_ref`
                            ORDER BY `item_parent`.`name`, `item`.`name` limit {1},{2}
                    ) as `id`
                )
                AND `item_price`.`item_ref`=`item`.`id`
                AND `item_price`.`is_char`='0'
                AND `item_price`.`price_type_ref`=`price_type`.`id`
                AND `item_parent`.`id` = `item`.`item_parent_ref`
                AND `site_group`.`id`=`item`.`site_group_ref`
                ORDER BY `item_parent`.`name`, `item`.`name`, `item_price`.`price` DESC
        """.format(self.group_name, offset, limit)

        query2 = """
            SELECT `item`.`name`, `char`.`name`, `item`.`ed_izm`,
                `item_price`.`price`, `price_type`.`name`, `item`.`hash`,
                `item_parent`.`name`, `item_price`.`is_char`, `char`.`hash`,
                `item_price`.`in_stock`, `site_group`.`img_url`,
                `price_type`.`id`
            FROM `item`, `char`, `item_price`, `price_type`,
                `item_parent`, `site_group`
            WHERE `site_group`.`name`='{0}'
                AND `item`.`id` IN (
                    SELECT * FROM (
                        SELECT DISTINCT `item`.`id`
                        FROM `item`, `item_parent`, `site_group`
                        WHERE `site_group`.`name`='{0}'
                            AND `item`.`item_parent_ref`=`item_parent`.`id`
                            AND `site_group`.`id`=`item`.`site_group_ref`
                            ORDER BY `item_parent`.`name`, `item`.`name` LIMIT {1},{2}
                    ) as `id`
                )
                AND `char`.`item_ref`=`item`.`id`
                AND `item_price`.`item_ref`=`char`.`id`
                AND `item_price`.`is_char`='1'
                AND `item_price`.`price_type_ref`=`price_type`.`id`
                AND `item_parent`.`id` = `item`.`item_parent_ref`
                AND `site_group`.`id`=`item`.`site_group_ref`
                ORDER BY `item_parent`.`name`, `item`.`name`, `item_price`.`price` DESC
        """.format(self.group_name, offset, limit)

        # print query

        r1 = connector.dbExecute(query1)
        r2 = connector.dbExecute(query2)

        for line in r1:

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
                item.img_url = line[10]

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

        for line in r2:

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
                item.img_url = line[10]

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

        # is_optional_length_query = """
        #     SELECT `char_price`
        #     FROM `site_group`
        #     WHERE `id`='{0}'
        # """.format(self.group_name)

        # r = connector.dbExecute(is_optional_length_query)
        # opt_len = False
        # for line in r:
        #     if line[0] == 0:
        #         opt_len = True

        query1 = """
            SELECT `item`.`name`, `char`.`name`, `item`.`ed_izm`,
                `item_price`.`price`, `price_type`.`name`, `item`.`hash`,
                `item_parent`.`name`, `item_price`.`is_char`, `char`.`hash`,
                `item_price`.`in_stock`, `site_group`.`img_url`,
                `price_type`.`id`
            FROM `item`, `char`, `item_price`, `price_type`,
                `item_parent`, `site_group`
            WHERE `item`.`site_group_ref`='{0}'
                AND `item`.`id` IN (
                    SELECT * FROM (
                        SELECT DISTINCT `item`.`id` FROM `item`, `item_parent`
                        WHERE `item`.`site_group_ref`='{0}'
                        AND `item`.`item_parent_ref`=`item_parent`.`id`
                        {1}
                        {2}
                        {3}
                        {4}
                        ORDER BY `item_parent`.`name`, `item`.`name` LIMIT {5},{6}
                    ) as `id`
                )
                AND `char`.`item_ref`=`item`.`id`
                AND `item_price`.`item_ref`=`char`.`id`
                AND `item_price`.`is_char`='1'
                AND `item_price`.`price_type_ref`=`price_type`.`id`
                AND `item_parent`.`id` = `item`.`item_parent_ref`
                AND `site_group`.`id`=`item`.`site_group_ref`
                ORDER BY `item_parent`.`name`, `item`.`name`, `item_price`.`price` DESC
            """.format(self.group_name, parent, thickness, diameter, height, offset, limit)

        query2 = """
            SELECT `item`.`name`, `item`.`name`, `item`.`ed_izm`,
                `item_price`.`price`, `price_type`.`name`, `item`.`hash`,
                `item_parent`.`name`, `item_price`.`is_char`, `item`.`hash`,
                `item_price`.`in_stock`, `site_group`.`img_url`
            FROM `item`, `item_price`, `price_type`,
                `item_parent`, `site_group`
            WHERE `item`.`site_group_ref`='{0}'
                AND `item`.`id` IN (
                    SELECT * FROM (
                        SELECT DISTINCT `item`.`id` FROM `item`, `item_parent`
                        WHERE `item`.`site_group_ref`='{0}'
                            AND `item`.`item_parent_ref`=`item_parent`.`id`
                                {1}
                                {2}
                                {3}
                                {4}
                            ORDER BY `item_parent`.`name`, `item`.`name`
                    ) as `id`
                )
                AND `item_price`.`item_ref`=`item`.`id`
                AND `item_price`.`is_char`='0'
                AND `item_price`.`price_type_ref`=`price_type`.`id`
                AND `item_parent`.`id` = `item`.`item_parent_ref`
                AND `site_group`.`id`=`item`.`site_group_ref`
                ORDER BY `item_parent`.`name`, `item`.`name`, `item_price`.`price` DESC
            """.format(self.group_name, parent, thickness, diameter, height, offset, limit)

        # print query

        r1 = connector.dbExecute(query1)
        r2 = connector.dbExecute(query2)

        for line in r1:

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
                item.img_url = line[10]

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

        for line in r2:

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
                item.img_url = line[10]

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


def compose_table(term, offset=0, limit=20, params={}, search_flag=False):

    rt = ResultTable(term.encode("utf-8"))

    if search_flag:
        groups = rt.get_items_by_group_name(offset, limit)
    else:
        groups = rt.get_items(offset, limit, params)

    result_table = soup.new_tag("table")
    result_table["id"] = "tableRes"

    result_table_tbody = soup.new_tag("tbody")

    result_table.append(result_table_tbody)

    ral_items = {}

    odd = False

    item_groups_keys = sorted(groups.keys())

    for _item_group in item_groups_keys:
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
                _IN_STOCK = False

                for char in item.char_array:
                    char_hash = item.char_array[char].hash
                    in_stock = item.char_array[char].in_stock
                    char_option = soup.new_tag("option")
                    char_option["name"] = char_hash.decode("utf-8")
                    char_option["stock"] = in_stock
                    char_option.append(char)
                    if in_stock > 0:
                        if is_first != "":
                            char_option["selected"] = "selected"
                            char_option["leftovers"] = str(in_stock)
                        char_select.insert(0, char_option)
                        _IN_STOCK = True
                    else:
                        char_select.append(char_option)
                    # char_list = char_list + "<option>" + char + "</option>"
                    if in_stock == "":
                        stock_class = " out_of_stock"
                    else:
                        stock_class = ""

                    price_ul = soup.new_tag("ul")
                    price_ul["class"] = "item_billet_select_price{0}{1}".format(
                        is_first, stock_class
                    )
                    is_first = ""
                    price_ul["for"] = char_hash.decode("utf-8")

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
                char_select.append(u"Вы можете задать нужную длину листа в установленных пределах.")

                # char_list = "<select>"
                price_ul = soup.new_tag("ul")
                price_ul["class"] = "item_billet_select_price{0}".format(
                    " selected_price"
                )
                price_ul["for"] = "0"

                for price in item.price_array:

                    price_li = soup.new_tag("li")
                    price_li.append(price[0].replace("КИС:", ""))
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
            item_billet_table_upper_img["src"] = item.img_url
            # item_billet_table_upper_img["src"] = "/1cengine/site/images/eye_pic/default.png"

            item_billet_table_upper_img_td.append(item_billet_table_upper_img)

            if "RAL" in item.name:

                ral_lib_name = "ral_dict"
                ral_lib_path = "structures/ral_dict.py"
                ral = imp.load_source(
                    ral_lib_name,
                    _PATH_ + "/" + ral_lib_path
                )

                rd = ral.ral

                import re

                r = re.search('(?<=RAL )\d\d\d\d', item.name)
                rn = r.group(0)

                drop = soup.new_tag("div")
                drop["class"] = "drop"
                drop["ral"] = rn
                drop["style"] = "box-shadow: inset -3px -3px 4px 12px #" + rd[rn]

                glow = soup.new_tag("div")
                glow["class"] = "glow"
                glow2 = soup.new_tag("div")
                glow2["class"] = "glow2"
                glow3 = soup.new_tag("div")
                glow3["class"] = "glow3"

                drop.append(glow)
                drop.append(glow2)
                drop.append(glow3)

                item_billet_table_upper_img_td.append(drop)

                ri_key = (item.name.replace(rn, ""), min_price)
                if ri_key in ral_items:
                    ral_span = soup.new_tag("span")
                    ral_span["style"] = "background-color:#{0};".format(rd[rn])
                    ral_span["ralid"] = item.hash
                    ral_items[ri_key]["il"].append(
                        rn, item.hash, item_billet_tr, item_list_tr
                    )
                    ral_items[ri_key]["rl"].append(ral_span)
                    item_list_tr["style"] = "display:none;"

                    more_colors = soup.new_tag("span")
                    more_colors["class"] = "more_colors"
                    more_colors["ralid"] = item.hash
                    more_colors.append(u"Выбрать другой цвет ➚")
                    item_billet_table_upper_img_td.append(more_colors)
                else:
                    ral_div = soup.new_tag("div")
                    ral_div["class"] = "r_c"
                    ral_span = soup.new_tag("span")
                    ral_span["style"] = "background-color:#{0};".format(rd[rn])
                    ral_span["ralid"] = item.hash
                    ral_div.append(ral_span)

                    ral_items[ri_key] = {
                        "il": [(rn, item.hash, item_billet_tr, item_list_tr)],
                        "rl": ral_div
                    }

                    more_colors = soup.new_tag("span")
                    more_colors["class"] = "more_colors"
                    more_colors["ralid"] = item.hash
                    more_colors.append(u"Выбрать другой цвет ➚")
                    item_billet_table_upper_img_td.append(more_colors)

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

                item_list_availability_span = soup.new_tag("span")
                item_list_availability_span.append(u"есть на складе")
                item_list_availability_span["class"] = "item_in_stock"
                items_list_name_td.append(item_list_availability_span)
            else:
                item_buy_span_tag.string = "Под заказ"
                item_buy_a_tag["class"] = u"oItem"
            item_buy_a_tag["name"] = item.hash
            item_buy_a_tag["href"] = "javascript:void(0)"

            item_buy_a_tag["onClick"] = u"""yaCounter15882208.reachGoal(
                'onBuyLinkPressed', 'купить'
                );return false"""

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

            odd = odd.__xor__(True)

    # result = result + """
    #     </tbody>
    # </table>
    # """

    # print ral_items

    if ral_items.__len__() > 0:

        for key in ral_items:
            if ral_items[key]["il"].__len__() > 1:
                for i in ral_items[key]["il"]:
                    itn = i[3].find(class_="itemName")
                    n_str = itn.contents[0].replace(i[0], "")
                    itn.contents[0].replace_with(n_str)
                    itn.contents.append(ral_items[key]["rl"])
            else:
                for i in ral_items[key]["il"]:
                    mc = i[2].find(class_="more_colors")
                    mc.extract()
    return result_table

form = cgi.FieldStorage()
offset = 0
limit = 20
if "page" in form:
    xy = int(form["page"].value)
    if xy != 1:
        offset = ((xy + (xy-1)-1) * 10)

if "term" in form:
    print "Content-Type: text/html; charset=utf-8\n"
    print str(
        compose_table(
            form["term"].value.decode("utf-8"),
            offset,
            limit,
            {},
            True
        )
    )
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

            if "he_" in param:
                if "he" in params:
                    params["he"].append("`item`.`height`='"+param.replace("he_", "", 1)+"'")
                else:
                    params["he"] = []
                    params["he"].append("`item`.`height`='"+param.replace("he_", "", 1)+"'")

        # print param_string
        print str(
            compose_table(
                form["hash"].value.decode("utf-8"),
                offset,
                limit,
                params
            )
        )

    else:
        print str(
            compose_table(
                form["hash"].value.decode("utf-8"),
                offset,
                limit
            )
        )
