#!/usr/bin/python2.6
# -*- coding: utf-8 -*-

import os
import cgi
import cgitb
cgitb.enable()

print("Content-Type: text/html; charset=utf-8\n")

import json

import imp
# py_scripts_path = os.path.expanduser('/home/saur/web/sitenewwave/1cengine/py_scripts/') #development
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
    connector = myDBC("catalog")
    connector.dbConnect()
    r = connector.dbExecute("""
            SELECT DISTINCT SUBSTRING_INDEX(`name`, ' ', """+str(space_count)+""")
            FROM `item`
            WHERE `name` LIKE '"""+term+"""%'
        """)

    for row in r:

        ret.append(str(row[0]))

    connector.dbClose()

    return ret


def show_items(ret):
    print json.dumps(ret)


ret = get_items(term)
show_items(ret)
