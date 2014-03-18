#!/usr/bin/python2.6
# -*- coding: utf-8 -*-


import cgi
import cgitb
cgitb.enable()

print("Content-Type: text/html; charset=utf-8\n")

import json
from secrets import *

get = cgi.FieldStorage()
if "term" in get:
    term = get["term"].value
else:
    term = ""

def get_items(term):
    space_count = term.decode("utf-8").count(' ') + 1
    ret = []
    connector = myDBC("goods")
    connector.dbConnect()
    # r = connector.dbExecute("""
    #         SELECT DISTINCT SUBSTRING_INDEX(`display_name`, ' ', """+str(space_count)+""")
    #         FROM `offers`
    #         WHERE `display_name` LIKE '"""+term+"""%'
    #     """)

    if term.__len__() < 2:
        r = connector.dbExecute("""
                SELECT DISTINCT `name`
                FROM `groups`
                WHERE `parent_hash` = `hash`
            """)
    else:
        r = connector.dbExecute("""
                SELECT DISTINCT `name`
                FROM `groups`
                WHERE `parent_hash` = (SELECT `hash` FROM `groups` WHERE `name`='"""+term+"""' )
                    AND `parent_hash` != `hash`
            """)


    for row in r:
        if term.__len__() > 1:
            ret.append(term + " " + str(row[0]))
        else:
            ret.append(str(row[0]))

    connector.dbClose()

    return ret


def show_items(ret):
    print json.dumps(ret)


ret = get_items(term)
show_items(ret)
