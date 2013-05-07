#!/usr/bin/python2.6
# -*- coding: utf-8 -*-


import sys,os
import cgi
import cgitb; cgitb.enable()

from secrets import *

def get_item_name(item_hash, parent_hash):
    connector = myDBC("goods")
    connector.dbConnect()

    # print item_hash, " | ", parent_hash
    r = connector.dbExecute("""
            SELECT `name`
            FROM `offers`
            WHERE `hash` = '""" + item_hash + """' AND `father_hash` = '""" + parent_hash + """'
        """)

    connector.dbClose()

    
    for row in r:
        r_string = str(row[0])
        # print r_string

    return r_string

