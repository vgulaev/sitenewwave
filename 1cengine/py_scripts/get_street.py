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

if "town" in get:
    town = get["town"].value
else:
    town = ""

# print term, ' ', town


def getStreets(town, term):
    ret = []
    connector = myDBC("kladr")
    connector.dbConnect()
    r = connector.dbExecute("""
            SELECT `SOCR,C,10`, `NAME,C,40`, `CODE,C,17`
            FROM `Street`
            WHERE `CODE,C,17` LIKE '""" + town + """%'
            AND `NAME,C,40` LIKE '""" + term + """%' ORDER BY `NAME,C,40`
        """)

    for row in r:
        # print row[0], " ", row[1], " ", row[2]
        t = str(row[2])[0:11]
        r2 = connector.dbExecute("""
            SELECT `SOCR,C,10`, `NAME,C,40`, `CODE,C,13`
            FROM `Base`
            WHERE `CODE,C,13` LIKE '""" + t + """%' LIMIT 1
        """)

        if r2.__len__() > 0:
            for row2 in r2:
                appendStr = row[0] + '. ' + row[
                    1] + ' (' + row2[0] + '. ' + row2[1] + ')'
                ret.append(appendStr)
        else:
            appendStr = row[0] + '. ' + row[1]
            ret.append(appendStr)

    connector.dbClose()

    return ret


def showStreets(ret):

    print json.dumps(ret)

ret = getStreets(town, term)
showStreets(ret)
