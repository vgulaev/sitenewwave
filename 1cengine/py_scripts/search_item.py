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


def get_item_list(ref):

    ref_words = ref.split(" ")

    while "" in ref_words:
        ref_words.remove("")

    clean_ref = " ".join(ref_words)

    query = """
        SELECT `item`.`name`, `char`.`name`, `item`.`ed_izm`,
            `item_price`.`price`, `price_type`.`name`, `item`.`hash`,
            `item_parent`.`name`, `item_price`.`is_char`, `char`.`hash`,
            `item_price`.`in_stock`, `site_group`.`img_url`,
            `price_type`.`id`
            FROM `item`, `char`, `item_price`, `price_type`,
            `item_parent`, `site_group`
            WHERE `item`.`id` IN ( SELECT * FROM (
            SELECT DISTINCT `item`.`id` FROM `item`
            WHERE `item`.`name` LIKE '%{0}%'
            ORDER BY `item_parent`.`name`, `item`.`name` ) as `id`
            )
            ORDER BY `item_parent`.`name`, `item`.`name`, `price_type`.`id`
    """.format(clean_ref)

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

