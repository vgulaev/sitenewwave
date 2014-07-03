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
    print("<hr />")
    for z in get_items(hash):
        print("<li>{0}</li>".format(z))
    print("</ul></li>")

print("<ul>")
for x in get_main_groups():
    print_until_last(x[0], x[1])
