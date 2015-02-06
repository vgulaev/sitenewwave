#!/web/trimetru/python/bin/python2.6
# -*- coding: utf-8 -*-


import sys
import os
import cgi
import cgitb
cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))

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

def count_items_hash(ghash):
    connector = myDBC("goods")
    connector.dbConnect()

    groups_array = get_sgroups(ghash)

    r_cond = "' OR `offers`.`parent_hash`='".join(groups_array)


    r = connector.dbExecute("""
                SELECT count(*) FROM `offers`, `groups`
                WHERE ( `offers`.`parent_hash`='""" + r_cond + """' )
                AND `groups`.`hash`=`offers`.`parent_hash`
            """)

    connector.dbClose()

    return r[0][0] - 20

def get_sgroups(ghash):
    connector = myDBC("goods")
    connector.dbConnect()

    groups_array = [ghash]

    r = connector.dbExecute("""
        SELECT `groups`.`hash`, `groups`.`name`
        FROM `groups`
        WHERE `groups`.`parent_hash`='"""+ghash+"""'
        AND NOT `groups`.`hash`=`groups`.`parent_hash`
        """)

    while r.__len__() > 0:
        x_arr = []
        for x in r:
            # print("<li>{0} :: {1}</li>".format(x[0], x[1]))
            x_arr.append(x[0])
            groups_array.append(x[0])

        r_cond = "' OR `groups`.`parent_hash`='".join(x_arr)
        # print r_cond
        r = connector.dbExecute("""
            SELECT `groups`.`hash`, `groups`.`name`
            FROM `groups`
            WHERE `groups`.`parent_hash`='"""+r_cond+"""'
        """)

    return groups_array


form = cgi.FieldStorage()

if "term" in form:

    print "Content-Type: text/html; charset=utf-8\n"
    print str(count_items(form["term"].value))

if "hash" in form:

    print "Content-Type: text/html; charset=utf-8\n"
    print str(count_items_hash(form["hash"].value))
