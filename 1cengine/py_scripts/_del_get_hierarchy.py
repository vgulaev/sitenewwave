#!/usr/bin/python2.6
# -*- coding: utf-8 -*-


import cgi
import cgitb
cgitb.enable()

print("Content-Type: text/html; charset=utf-8\n")

import json
from secrets import *

print("<h1>nya!</h1><hr />")


def get_main_groups():
    ret = []
    connector = myDBC("goods")
    connector.dbConnect()
    r = connector.dbExecute("""
            SELECT DISTINCT `name`, `hash`
            FROM `groups`
            WHERE `parent_hash` = `hash`
        """)

    # r = connector.dbExecute("""
    #         SELECT DISTINCT SUBSTRING_INDEX(`display_name`, ' ', 1)
    #         FROM `offers`
    #         WHERE `display_name` LIKE '%'
    #     """)

    for row in r:
        ret.append([str(row[0]), str(row[1])])

    connector.dbClose()

    return ret


def get_subgroups(group_hash):
    ret = []
    connector = myDBC("goods")
    connector.dbConnect()

    r = connector.dbExecute("""
            SELECT DISTINCT `name`, `hash`
            FROM `groups`
            WHERE ( `parent_hash` = '"""+group_hash+"""'
            ) AND `parent_hash` != `hash`
        """)

    for row in r:
        ret.append([str(row[0]), str(row[1])])

    connector.dbClose()

    return ret


def get_items(term_hash):
    # space_count = term.decode("utf-8").count(' ') + 1
    ret = []
    connector = myDBC("goods")
    connector.dbConnect()
    r = connector.dbExecute("""
            SELECT DISTINCT `display_name`
            FROM `offers`
            WHERE `parent_hash` = '"""+term_hash+"""'
                AND `parent_hash` != `hash`
        """)

    for row in r:
        ret.append(str(row[0]))

    connector.dbClose()

    return ret


def print_until_last(subgroup, hash):
    print("<li>{0}<ul>".format(subgroup))
    for y in get_subgroups(hash):
        print_until_last(y[0], y[1])
    # print("<hr />")
    # for z in get_items(hash):
    #     print("<li>{0}</li>".format(z))
    print("</ul></li>")

# print("<ul>")
# for x in get_main_groups():
#     print_until_last(x[0], x[1])



def get_sgroups(ghash):
    connector = myDBC("goods")
    connector.dbConnect()

    groups_array = [ghash]

    r = connector.dbExecute("""
        SELECT `groups`.`hash`, `groups`.`name`
        FROM `groups`
        WHERE `groups`.`parent_hash`='"""+c+"""'
        AND NOT `groups`.`hash`=`groups`.`parent_hash`
        """)

    while r.__len__() > 0:
        x_arr = []
        for x in r:
            # print("<li>{0} :: {1}</li>".format(x[0], x[1]))
            x_arr.append(x[0])
            groups_array.append(x[0])

        r_cond = "' OR `groups`.`parent_hash`='".join(x_arr)
        # print r_cond
        r = connector.dbExecute("""
            SELECT `groups`.`hash`, `groups`.`name`
            FROM `groups`
            WHERE `groups`.`parent_hash`='"""+r_cond+"""'
        """)

    return groups_array

def get_items_from_ghash(ghash):
    connector = myDBC("goods")
    connector.dbConnect()

    groups_array = get_sgrous(ghash)

    r_cond = "' OR `offers`.`parent_hash`='".join(groups_array)

    r = connector.dbExecute("""
            SELECT `offers`.`name`
            FROM `offers`
            WHERE `offers`.`parent_hash`='"""+r_cond+"""'
        """)

    for x in r:
        print("<li>{0}</li>".format(x[0]))



c = "b5941407-8872-11e1-a7b1-00155dc20a18"
b = "b5941408-8872-11e1-a7b1-00155dc20a18"

arr = get_sgroups(c)

for x in arr:
    print("<li>{0}</li>".format(x))

# get_items_from_ghash(c)