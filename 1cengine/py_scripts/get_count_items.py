#!/web/trimetru/python/bin/python2.6
# -*- coding: utf-8 -*-


import sys
import os
import cgi
import cgitb
cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))


from secrets import *


def count_items(term):
    connector = myDBC("goods")
    connector.dbConnect()

    condition = "WHERE "

    reqArray = term.split(" ")
    condition_array = []
    for reqWord in reqArray:
        if reqWord.__len__() > 1:
            condition_array.append(
                "`offers`.`name` LIKE '%" + reqWord + "%'")
        else:
            condition_array.append(
                "`offers`.`name` LIKE '% " + reqWord + "%'")

    condition = condition + " AND ".join(condition_array)



    r = connector.dbExecute("""
                SELECT count(*) FROM `offers`
                """+condition+"""
            """)

    connector.dbClose()

    return r[0][0] - 20


form = cgi.FieldStorage()

if "term" in form:

    print "Content-Type: text/html; charset=utf-8\n"
    print str(count_items(form["term"].value))
