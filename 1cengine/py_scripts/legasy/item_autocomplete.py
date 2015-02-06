#!/usr/bin/python2.6
# -*- coding: utf-8 -*-


import cgi
import cgitb
cgitb.enable()

print("Content-Type: text/html; charset=utf-8\n")

import json

import imp
# py_scripts_path = os.path.expanduser('~/web/sitenewwave/1cengine/py_scripts/') #development
py_scripts_path = os.path.expanduser('~/site/www/1cengine/py_scripts/') #production

secrets_lib_name = "secrets"
secrets_lib_path = "structures/secrets.py"
secrets = imp.load_source(
    secrets_lib_name,
    py_scripts_path + secrets_lib_path
)

myDBC = secrets.myDBC

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
    r = connector.dbExecute("""
            SELECT DISTINCT SUBSTRING_INDEX(`display_name`, ' ', """+str(space_count)+""")
            FROM `offers`
            WHERE `display_name` LIKE '"""+term+"""%'
        """)

    # if term.__len__() < 2:
    #     # r = connector.dbExecute("""
    #     #         SELECT DISTINCT `name`
    #     #         FROM `groups`
    #     #         WHERE `parent_hash` = `hash`
    #     #     """)
    #     r = connector.dbExecute("""
    #         SELECT DISTINCT SUBSTRING_INDEX(`display_name`, ' ', 1)
    #         FROM `offers`
    #         WHERE `display_name` LIKE '%'
    #     """)
    # else:
    #     # r = connector.dbExecute("""
    #     #         SELECT DISTINCT `name`
    #     #         FROM `groups`
    #     #         WHERE `parent_hash` = (SELECT `hash` FROM `groups` WHERE `name`='"""+term+"""' )
    #     #             AND `parent_hash` != `hash`
    #     #     """)

    #     r = connector.dbExecute("""
    #             SELECT DISTINCT `name`
    #             FROM `groups`
    #             WHERE ( `parent_hash` = (SELECT `hash` FROM `groups` WHERE `name`='"""+term+"""' )
    #                 AND `parent_hash` != `hash` ) OR (`name` LIKE '"""+term+"""%' AND `hash`=`parent_hash`)
    #         """)


    for row in r:

        # r_a = str(row[0]).split(" ")
        # if term.__len__() > 1 and term.strip().lower() != r_a[0].strip().lower():
        #     ret.append(term + " " + str(row[0]))
        # else:
        ret.append(str(row[0]))

    connector.dbClose()

    return ret


def show_items(ret):
    print json.dumps(ret)


ret = get_items(term)
show_items(ret)
