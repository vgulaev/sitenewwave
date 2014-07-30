#!/usr/bin/python2.6
# -*- coding: utf-8 -*-


# import cgi
# import cgitb
# cgitb.enable()

# print("Content-Type: text/html; charset=utf-8\n")

# import json
from secrets import *

# get = cgi.FieldStorage()
# if "term" in get:
#     term = get["term"].value
# else:
#     term = ""

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


def get_items(term):
    space_count = term.decode("utf-8").count(' ') + 1
    ret = []
    connector = myDBC("goods")
    connector.dbConnect()
    r = connector.dbExecute("""
            SELECT DISTINCT `name`
            FROM `groups`
            WHERE `parent_hash` = (SELECT `hash` FROM `groups` WHERE `name`='"""+term+"""' )
                AND `parent_hash` != `hash`
        """)

    for row in r:
        ret.append(str(row[0]) + " ")

    connector.dbClose()

    return ret


# def show_items(ret):
#     print json.dumps(ret)


# ret = get_items(term)
# show_items(ret)
