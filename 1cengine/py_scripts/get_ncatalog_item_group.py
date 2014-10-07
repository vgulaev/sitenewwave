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
    connector = myDBC("ncatalog")
    connector.dbConnect()
    r = connector.dbExecute("""
            SELECT DISTINCT `site_group`.`name`, `site_group`.`id`
            FROM `site_group`
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
    ret = {}
    connector = myDBC("ncatalog")
    connector.dbConnect()

    r = connector.dbExecute("""
            SELECT DISTINCT `item_parent`.`name`, `item_parent`.`id`
            FROM `item_parent`, `item`, `site_group`
            WHERE `site_group`.`id`='"""+group_hash+"""'
            AND `item`.`site_group_ref`=`site_group`.`id`
            AND `item_parent`.`id`=`item`.`item_parent_ref`
            ORDER BY `item_parent`.`name`
        """)

    for row in r:
        if "parents" in ret:
            ret["parents"].append([str(row[0]), str(row[1])])
        else:
            ret["parents"] = []
            ret["parents"].append([str(row[0]), str(row[1])])

    r = connector.dbExecute("""
        SELECT DISTINCT `item`.`thickness`
        FROM `item`, `site_group`
        WHERE `site_group`.`id`='"""+group_hash+"""'
        AND `item`.`site_group_ref`=`site_group`.`id`
        ORDER BY `item`.`thickness`
    """)

    for row in r:
        if not row[0] == 0.0:
            if "thickness" in ret:
                ret["thickness"].append(str(row[0]))
            else:
                ret["thickness"] = []
                ret["thickness"].append(str(row[0]))

    r = connector.dbExecute("""
        SELECT DISTINCT `item`.`diameter`
        FROM `item`, `site_group`
        WHERE `site_group`.`id`='"""+group_hash+"""'
        AND `item`.`site_group_ref`=`site_group`.`id`
        ORDER BY `item`.`diameter`
    """)

    for row in r:
        if not row[0] == 0.0:
            if "diameter" in ret:
                ret["diameter"].append(str(row[0]))
            else:
                ret["diameter"] = []
                ret["diameter"].append(str(row[0]))


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
