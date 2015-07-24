#!/web/trimetru/python/bin/python2.6
# -*- coding: utf-8 -*-


import sys
import os
import cgi
import cgitb
cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))
from bs4 import BeautifulSoup

from difflib import SequenceMatcher
import MySQLdb

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

    # @profile
    def find_items(self):
        phrase = self.group_name
        conn = MySQLdb.connect(
            host=secrets.databases["catalog"]["host"],
            user=secrets.databases["catalog"]["user"],
            passwd=secrets.databases["catalog"]["passwd"],
            db=secrets.databases["catalog"]["db"]
        )

        conn.set_character_set('utf8')
        cursor = conn.cursor()
        cursor.execute('SET NAMES utf8;')
        cursor.execute('SET SQL_BIG_SELECTS=1;')

        sql_query = """
            SELECT DISTINCT `name`, `hash`
            FROM `item`
            WHERE
        """

        phrase = phrase.decode('utf-8').lower().encode("utf-8")

        sql_query = sql_query + " `name`='"+phrase+"'"

        phrase_array = phrase.split(" ")

        temp_arr = phrase_array

        sql_query = sql_query + " OR `name` LIKE '%" + " ".join(temp_arr) + "%'"
        sql_query = sql_query + " OR `name` LIKE '%" + on_p_replace(" ".join(temp_arr)) + "%'"
        sql_query = sql_query + " OR `name` LIKE '%" + on_p_replace(" ".join(temp_arr), 1) + "%'"

        while temp_arr.__len__() > 1:
            temp_arr = temp_arr[:-1]

            sql_query = sql_query + " OR `name` LIKE '%" + " ".join(temp_arr) + "%'"
            sql_query = sql_query + " OR `name` LIKE '%" + on_p_replace(" ".join(temp_arr)) + "%'"
            sql_query = sql_query + " OR `name` LIKE '%" + on_p_replace(" ".join(temp_arr), 1) + "%'"

        temp_arr = phrase_array

        while temp_arr.__len__() > 1:
            temp_arr = temp_arr[1:]

            sql_query = sql_query + " OR `name` LIKE '%" + " ".join(temp_arr) + "%'"
            sql_query = sql_query + " OR `name` LIKE '%" + on_p_replace(" ".join(temp_arr)) + "%'"
            sql_query = sql_query + " OR `name` LIKE '%" + on_p_replace(" ".join(temp_arr), 1) + "%'"

        for word in phrase_array:

            sql_query = sql_query + " OR `name` LIKE '%" + word + "%'"
            sql_query = sql_query + " OR `name` LIKE '%" + on_p_replace(word) + "%'"
            sql_query = sql_query + " OR `name` LIKE '%" + on_p_replace(word, 1) + "%'"

        # print sql_query

        cursor.execute(sql_query)
        rows = cursor.fetchall()

        cursor.close()
        conn.close()

        simmilarity_array = {}

        for row in rows:
            mrow = row[0].decode('utf-8').lower().encode("utf-8")
            row_array = mrow.split(" ")

            # print mrow.encode("utf-8")

            simmilarity_array[row[0]] = []

            for phrase_word in phrase_array:
                word_sim = 0.0
                for row_word in row_array:
                    s = SequenceMatcher(None, row_word, phrase_word)
                    if s.ratio() > word_sim:
                        word_sim = s.ratio()
                simmilarity_array[row[0]].append(word_sim)
            simmilarity_array[row[0]].append(row[1])

        #     s = SequenceMatcher(lambda x: x==" ", phrase, row[0])
        #     simmilarity_array.append([row[0], s.ratio()])

        wlen = phrase_array.__len__()
        i = 0
        st = []
        while i < wlen:
            st.append("x[1]["+str(i)+"]")
            i = i + 1

        sts = ", ".join(st)

        finale = sorted(
            simmilarity_array.iteritems(),
            key=lambda x: (eval(sts)),
            reverse=True
        )

        return_list = []

        self.order = []

        j = 0
        while j < 20:
            return_list.append([j, finale[j][1][-1]])
            self.order.append(finale[j][0])

            j = j + 1

        return return_list

    def get_search_items(self):

        needed_items = self.find_items()

        or_clause_list = []

        # self.order = []

        for item in needed_items:
            # print item[1]
            or_clause_list.append("""
                `item`.`hash`='""" + item[1]  + """'
            """)
            # self.order.append(item[2])

        or_clause = " OR ".join(or_clause_list)

        # print or_clause

        connector = myDBC("catalog")
        connector.dbConnect()

        query1 = """
            SELECT `item`.`name`, `char`.`name`, `item`.`ed_izm`,
                `item_price`.`price`, `price_type`.`name`, `item`.`hash`,
                'Результаты поиска', `item_price`.`is_char`, `char`.`hash`,
                `item_price`.`in_stock`, `site_group`.`img_url`,
                `price_type`.`id`
            FROM `item`, `char`, `item_price`, `price_type`,
                `item_parent`, `site_group`
            WHERE `item`.`id` IN (
                SELECT * FROM (
                    SELECT DISTINCT `item`.`id` FROM `item`
                        WHERE {0}
                    ) as `id`
                )
                AND `char`.`item_ref`=`item`.`id`
                AND `item_price`.`item_ref`=`char`.`id`
                AND `item_price`.`is_char`='1'
                AND `item_price`.`price_type_ref`=`price_type`.`id`
                AND `item_parent`.`id` = `item`.`item_parent_ref`
                AND `site_group`.`id`=`item`.`site_group_ref`
            """.format(or_clause)

        query2 = """
            SELECT `item`.`name`, `item`.`name`, `item`.`ed_izm`,
                `item_price`.`price`, `price_type`.`name`, `item`.`hash`,
                'Результаты поиска', `item_price`.`is_char`, `item`.`hash`,
                `item_price`.`in_stock`, `site_group`.`img_url`
            FROM `item`, `item_price`, `price_type`,
                `item_parent`, `site_group`
            WHERE `item`.`id` IN (
                    SELECT * FROM (
                        SELECT DISTINCT `item`.`id` FROM `item`
                        WHERE {0}
                    ) as `id`
                )
                AND `item_price`.`item_ref`=`item`.`id`
                AND `item_price`.`is_char`='0'
                AND `item_price`.`price_type_ref`=`price_type`.`id`
                AND `item_parent`.`id` = `item`.`item_parent_ref`
                AND `site_group`.`id`=`item`.`site_group_ref`
            """.format(or_clause)

        # print query2

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


def on_p_replace(string, i=0):
    index = 0 + i
    string = string.decode("utf-8")
    new = ""
    for c in string:
        if index % 2 == 0:
            new = new + "%"
            index = index + 1
        else:
            new = new + c
            index = index + 1
        # print c

        # index = index + 1

    return new.encode("utf-8")


def compose_table(term):

    rt = ResultTable(term.encode("utf-8"))

    groups = rt.get_search_items()

    result_table = soup.new_tag("table")
    result_table["id"] = "tableRes"

    result_table_tbody = soup.new_tag("tbody")

    result_table.append(result_table_tbody)

    ral_items = {}

    odd = False

    item_groups_keys = sorted(groups.keys())


    # item_groups_keys = rt.order

    for _item_group in item_groups_keys:
        ITEM_LIST = groups[_item_group]
        # ITEM_LIST_KEYS = sorted(ITEM_LIST.keys())
        ITEM_LIST_KEYS = rt.order

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
                        # if is_first != "":
                        #     char_option["selected"] = "selected"
                        char_option["leftovers"] = str(in_stock)
                        # endif
                        char_select.insert(0, char_option)
                        _IN_STOCK = True
                    else:
                        char_select.append(char_option)
                    # char_list = char_list + "<option>" + char + "</option>"
                    if in_stock == "":
                        stock_class = " out_of_stock"
                    else:
                        stock_class = ""

                    # print char, " : ", char_hash, " : ", is_first, "<br />"

                    price_ul = soup.new_tag("ul")
                    price_ul["class"] = "item_billet_select_price{0}".format(
                        stock_class
                    )
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

                    if in_stock > 0:
                        prices_container.insert(0, price_ul)
                    else:
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

            prices_container.contents[0]["class"] = prices_container.contents[0]["class"] + " selected_price"
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
                    ral_items[ri_key]["il"].append((rn, item.hash, item_billet_tr, item_list_tr))
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

if "term" in form:
    print "Content-Type: text/html; charset=utf-8\n"
    # print "1"
    print str(
        compose_table(
            form["term"].value.decode("utf-8")
        )
    )
