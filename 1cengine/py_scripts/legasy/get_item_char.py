#!/usr/bin/python2.6
# -*- coding: utf-8 -*-


import cgi
import cgitb
cgitb.enable()

print("Content-Type: text/html; charset=utf-8\n")

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

def get_item_char(item_hash, hash_pointer):
    connector = myDBC("goods")
    connector.dbConnect()

    hash_table = ["hash", "father_hash"]

    r = connector.dbExecute("""
            SELECT `length`,`weight`,`kf`
            FROM `offers`
            WHERE
             `""" + hash_table[hash_pointer] + """` = '""" + item_hash + """'
        """)

    connector.dbClose()

    # r_string = "fail"
    for row in r:
        r_string = str(row[0]) + "|" + str(row[1]) + "|" + str(row[2])
        print r_string

    return r_string

get = cgi.FieldStorage()

if "item_hash" in get:
    i_hash = get["item_hash"].value
else:
    i_hash = ""

hash_array = i_hash.split(":")

if hash_array[0] == 0:
    get_item_char(hash_array[1], 1)
else:
    get_item_char(hash_array[0], 0)
