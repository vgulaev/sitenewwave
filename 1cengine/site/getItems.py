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

    parentArray = []
    for row in r:

        ral = row[0].split("RAL ")
        if ral.__len__()>1:
            rKey = ral[1].split(" ")
            ralColor = getRAL(rKey[0])
        else:
            ralColor = ""

        if not row[4] in parentArray:
            parentArray.append(row[4])

            print '<tr class="iHeader"><td><strong>'+row[4]+'</strong></td><td>Размер</td>'
            priceTypeArray = row[3].split("|")
            i=0

            for priceType in priceTypeArray:
                if priceType != '':
                    if i == 0:
                        print '<td class="priceHeader">'+priceType+'<br /><span>Цена <font color="red">Я</font>ндекса</span></td>'
                    else:
                        print '<td class="priceHeader">'+priceType+'<br /><span>Цена</span></td>'
                    i = i + 1
                        
            print '</tr>'

        print "<li>",row[0], " ", row[1],"</li>"



def getRAL(rKey):
    ralArray = {
        '1014':'#DFCEA1',
        '3003':'#870A24',
        '3005':'#581E29',
        '3011':'#791F24',
        '5002':'#162E7B',
        '5005':'#004389',
        '5021':'#00747D',
        '6002':'#276230',
        '6005':'#0E4438',
        '6029':'#006F43',
        '7004':'#999A9F',
        '8017':'#45302B',
        '9002':'#DADBD5',
        '9003':'#F8F9FB'
    }

    return ralArray(rKey)

r = getItems(req)
showItems(r)



