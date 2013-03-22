#!/usr/bin/python2.6
# -*- coding: utf-8 -*-


import sys,os
import cgi
import cgitb; cgitb.enable()

print ("Content-Type: text/html; charset=utf-8\n")

from secrets import *

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

        print rt

    return parentArray
        # print "<li>",row[0], " ", row[1],"</li>"

def getItemByHash(hash):
    hashArray = hash.split(":")

    itemHash = hashArray[0]
    pHash = hashArray[1]
    newRow = ""

    connector = myDBC("goods")
    connector.dbConnect()

    r = connector.dbExecute("""
            SELECT `offers`.`display_name`, `offers`.`char_name`, `offers`.`price`, `offers`.`edIzm` 
            FROM `offers` 
            WHERE `offers`.`hash`='"""+itemHash+"""' AND `offers`.`father_hash`='"""+pHash+"""' 
        """)

    connector.dbClose()

    return r

def showItemByHash(hash, char, count,rezka):

    r = getItemByHash(hash)

    if char == "":
        char = row[1]

    for row in r:
        cell = """
            <tr class='itemTr' name='"""+hash+"""'><td></td>
            <td class='itemNameTd'>"""+row[0]+"""
                <span class="delEdSpan">
                <a href="Убрать из корзины" onClick="delModernItem('"""+hash+"""'); return false">X</a>
                <a href="Изменить" onClick="modern_editItem('"""+hash+"""'); return false"><img src="edit.png" /></a></span></td>
            <td class='itemCharTd'>"""+char+"""</td>
            <td class='itemCountTd'><input class='itemCountInput' name='"""+row[3]+"""' type='textarea' value='"""+count+"""' disabled /></td>
            <td class='itemEdIzmTd' name='"""+row[3]+"""'>"""+row[3]+"""</td>
            <td class='itemPriceTd' name='"""+row[2]+"""'></td>
            <td class='itemNdsKfTd'>18%</td>
            <td class='itemNdsSumTd'></td>
            <td class='itemSumTd'></td>
            <td class='itemRezlaTd' style='display:none'>"""+rezk+"""</td></tr>
        """

        print cell


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



get = cgi.FieldStorage()
if "term" in get:
    req = get["term"].value
else:
    req = ""

if "from_hash" in get:
    from_hash = True
else:
    from_hash = False

if from_hash == True:
    hash = get["hash"].value
    char = get["char"].value
    count = get["count"].value
    rezka = get["rezka"].value
    showItemByHash(hash, char, count,rezka)
else:
    res = showItems(req)
    if "strict" in get and res.__len__()==0:
        print "<tr><td>Извините, данный товар в настоящее время отсутствует на складе</td></tr>"
     
