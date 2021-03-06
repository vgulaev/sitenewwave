#!/usr/bin/python2.6
# -*- coding: utf-8 -*-


import sys,os
import cgi
import cgitb; cgitb.enable()
from bs4 import BeautifulSoup

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

def getItems(req):

    get = "strict"

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
                condition = condition + "`offers`.`name` LIKE '% "+reqWord+"%' AND "

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

def showItems(req):

    r = getItems(req)

    soup = BeautifulSoup()
    result_table_tag = soup.new_tag("table")

    result_table_tag["id"] = "tableRes"

    # result_table = "<table id=\"tableRes\">"

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

            header_tag = soup.new_tag("tr")

            header_tag["class"] = "iHeader"

            result_table = result_table + '<tr class="iHeader"><td><strong>'+row[4]+'</strong></td><td>Размер</td>'
            priceTypeArray = row[3].split("|")
            i=0

            for priceType in priceTypeArray:
                if priceType != '':
                    if i == 0:
                        result_table = result_table + '<td class="priceHeader">'+priceType+'<br /><span>Цена <font color="red">Я</font>ндекса</span></td>'
                    else:
                        result_table = result_table + '<td class="priceHeader">'+priceType+'<br /><span>Цена</span></td>'
                    i = i + 1
                        
            result_table = result_table + '</tr>'

        priceArray = row[2].split("|")

        rt = '''
            <tr class="item" id="'''+row[5]+':'+row[7]+'''" itemscope itemtype="http://schema.org/Product">
                <td name="'''+row[0]+'''" class="itemName" >
                <span itemprop="name">'''+row[0]+'''</span>   
                    <span class="buySpan">
            '''

        if not row[8] == 0:
            rt = rt + """<a class="bItem" href="Добавить в корзину" 
                    onClick="yaCounter15882208.reachGoal('onBuyLinkPressed', 'купить'); 
                        openItem('"""+row[5]+":"+row[7]+"', '"+row[6]+"', '"+row[2]+"""', '1'); 
                        return false">купить</a>
                    </span></td>""" 
            stock = "В наличии"
            stockSchema = 'href="http://schema.org/InStock"'
        else:
            rt = rt + """<a class="oItem" href="Добавить в корзину" 
                    onClick="yaCounter15882208.reachGoal('onBuyLinkPressed', 'заказать'); 
                        openItem('"""+row[5]+":"+row[7]+"', '"+row[6]+"', '"+row[2]+"""','0'); 
                        return false">заказать</a>
                    </span></td>"""
            stock = "Под заказ"
            stockSchema = 'href="http://schema.org/PreOrder"'
            
        if not ralColor == "":
            rt = rt + '<td name="'+row[1]+'" class="itemChar" itemprop="model" style="background-color:'+ralColor+';"><span style="color:#cfcfcf;text-shadow: 1px 1px 2px black, 0 0 1em grey;">'+row[1]+'</span></td>'
        else:
            rt = rt + '<td name="'+row[1]+'" class="itemChar" itemprop="model">'+row[1]+'</td>'
        

        
        paLength = priceArray.__len__() - 1
        j = 0
        for price in priceArray:
            if price != "":
                if j == paLength:
                    rt = rt + '''<td class="price itemPrice'''+str(j)+'''" itemprop="offers" itemscope itemtype="http://schema.org/Offer">
                            <span itemprop="price">'''+str(price)+'''</span>
                            <meta itemprop="priceCurrency" content="RUB" />
                            <span style="display:none;" itemprop="availability" '''+stockSchema+'>'+stock+'''</span>
                            <div style="display:none;" itemprop="seller" itemscope itemtype="http://schema.org/Organization">
                                <span itemprop="name">Тримет ООО</span>
                                <div itemprop="address" itemscope itemtype="http://schema.org/PostalAddress">
                                    <span itemprop="streetAddress">ул. Республики, 278 а, строение 1</span>
                                    <span itemprop="postalCode">625014</span>
                                    <span itemprop="addressLocality">Тюмень, Россия</span> 
                                </div>
                                <span itemprop="telephone">+7 (3452) 520-670</span>
                            </div>
                        </td>'''
                else:
                    rt = rt + '<td class="price itemPrice'+str(j)+'"><span>'+str(price)+'</span></td>'
                        
                j = j + 1

        rt = rt + '</tr>'

        result_table = result_table + rt + "</table>"

    return result_table
        # print "<li>",row[0], " ", row[1],"</li>"


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
        '9003':'#F8F9FB',
        '1018':'#F1CF44',
        '3009':'#703731'
    }
    if rKey in ralArray:
        return ralArray[rKey]
    else:
        return '#000000'

