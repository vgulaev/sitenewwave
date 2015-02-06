#!/usr/bin/python2.6
# -*- coding: utf-8 -*-


import cgi
import cgitb
cgitb.enable()

print("Content-Type: text/html; charset=utf-8\n")

import imp
# py_scripts_path = os.path.expanduser('~/web/sitenewwave/1cengine/py_scripts/') #development
py_scripts_path = os.path.expanduser('~/site/www/1cengine/py_scripts/') #production

_PATH_ = os.path.abspath(os.path.dirname(__file__))

secrets_lib_name = "secrets"
secrets_lib_path = "structures/secrets.py"
secrets = imp.load_source(
    secrets_lib_name,
    _PATH_ + "/" + secrets_lib_path
)

myDBC = secrets.myDBC


def get_item_char(char_hash, item_hash, is_kis):
    connector = myDBC("catalog")
    connector.dbConnect()

    if is_kis:

        query = """
            SELECT DISTINCT 0, 0, 0,
                `item`.`ed_izm`,`item_price`.`in_stock`, `item`.`diameter`,
                `item`.`work_width`, `site_group`.`ai_flag`
            FROM `char`, `item`, `item_price`, `site_group`
            WHERE
                `item`.`hash`='{1}'
                AND `item_price`.`item_ref`=`item`.`id`
                AND `item_price`.`is_char`=0
                AND `site_group`.`id`=`item`.`site_group_ref`
                LIMIT 1
        """.format(char_hash, item_hash)
    else:

        query = """
            SELECT DISTINCT `char`.`length`, `char`.`weight`, `char`.`kf`,
                `item`.`ed_izm`,`item_price`.`in_stock`, `item`.`diameter`,
                `item`.`work_width`, `site_group`.`ai_flag`
            FROM `char`, `item`, `item_price`, `site_group`
            WHERE
                `char`.`hash`='{0}' AND `item`.`hash`='{1}'
                AND `char`.`item_ref`=`item`.`id`
                AND `item_price`.`item_ref`=`char`.`id`
                AND `item_price`.`is_char`=1
                AND `site_group`.`id`=`item`.`site_group_ref`
                LIMIT 1
        """.format(char_hash, item_hash)

    # r = connector.dbExecute("""
    #         SELECT `char`.`name`, `char`.`weight`, `char`.`kf`,
    #             `item`.`ed_izm`,`item_price`.`in_stock`, `item`.`diameter`
    #         FROM `char`, `item`, `item_price`
    #         WHERE
    #          `char`.`hash` = '{""" + item_hash + """}'
    #     """)

    r = connector.dbExecute(query)

    connector.dbClose()

    r_string = "fail"
    for row in r:
        r_string = str(row[0]) + "|" + str(row[1]) + "|" + str(row[2]) +\
            "|" + str(row[3]) + "|" + str(row[4]) + "|" + str(row[5]) +\
            "|" + str(row[6]) + "|" + str(row[7])
        print r_string

    return r_string

get = cgi.FieldStorage()

if "item_hash" in get:
    i_hash = get["item_hash"].value
else:
    i_hash = ""

hash_array = i_hash.split(":")

if hash_array[0] == "0":
    get_item_char(hash_array[0], hash_array[1], True)
else:
    get_item_char(hash_array[0], hash_array[1], False)
