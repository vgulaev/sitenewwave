#!/usr/bin/python2.6
# -*- coding: utf-8 -*-


import sys,os
import cgi
import cgitb; cgitb.enable()

print ("Content-Type: text/html; charset=utf-8\n")

from secrets import *

get = cgi.FieldStorage()
if "term" in get:
    req = get["term"].value
else:
    req = ""

def getItems(req):

    connector = myDBC("goods")
    connector.dbConnect()

    condition = "WHERE "

    if "strict" in get:
        condition = condition + "CONCAT(display_name, ' ', char_name) LIKE '%"+req+"%' AND "

        limit = "LIMIT 1"

    else:
        reqArray = req.split(" ")
        for reqWord in reqArray:
            if reqWord.__len__()>1:
                condition = condition + "`offers`.`name` LIKE '%"+reqWord+"%' AND "
            else:
                condition = condition + "`offers`.`name` LIKE '% "+reqWord+" %' AND "

        if "show_all" in get:
            limit = ""
        else :
            limit = "ORDER BY `offers`.`stock` DESC LIMIT 20"

    r = connector.dbExecute("""
            SELECT `offers`.`display_name`, `offers`.`char_name`, `offers`.`price`, 
            `offers`.`price_type`, `groups`.`name`, `offers`.`hash`, `offers`.`edIzm`, `offers`.`father_hash`, `offers`.`stock`
            FROM `offers`, `groups` 
            """+condition+""" `offers`.`parent_hash`=`groups`.`hash` """+limit+"""
        """)

    connector.dbClose()

    return r

def showItems(r):
    for row in r:
        print row[0], " ", row[1]

r = getItems(req)
showItems(r)



