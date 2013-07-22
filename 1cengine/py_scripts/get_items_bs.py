#!/web/trimetru/python/bin/python2.6
# -*- coding: utf-8 -*-


import sys,os
import cgi
import cgitb; cgitb.enable()
from bs4 import BeautifulSoup

from secrets import *

soup = BeautifulSoup()


class ResultTable():
    def __init__(self, req, rtype):
        self.group_list = []
        self.req = req
        self.rtype = rtype
    
    def get_items(self):


        connector = myDBC("goods")
        connector.dbConnect()

        condition = "WHERE "

        if self.rtype == "strict":
            condition = condition + "CONCAT(display_name, ' ', char_name) LIKE '%"+self.req+"%' AND "

            limit = "LIMIT 1"

        else:
            reqArray = self.req.split(" ")
            for reqWord in reqArray:
                if reqWord.__len__()>1:
                    condition = condition + "`offers`.`name` LIKE '%"+reqWord+"%' AND "
                else:
                    condition = condition + "`offers`.`name` LIKE '% "+reqWord+"%' AND "

            limit = "ORDER BY `offers`.`stock` DESC LIMIT 20"

        r = connector.dbExecute("""
                SELECT `offers`.`display_name`, `offers`.`char_name`, `offers`.`price`, 
                `offers`.`price_type`, `groups`.`name`, `offers`.`hash`, `offers`.`edIzm`, `offers`.`father_hash`, `offers`.`stock`
                FROM `offers`, `groups` 
                """+condition+""" `offers`.`parent_hash`=`groups`.`hash` """+limit+"""
            """)

        connector.dbClose()

        return r

    def  compose_table(self):
        result_table_tag = soup.new_tag("table")

        result_table_tag["id"] = "tableRes"

        parent_array = []

        r = self.get_items()

        for row in r:
            if not row[4] in parent_array:
                parent_array.append(row[4])

                group = ItemGroup(row[4],row[3])

                result_table_tag.append(group.compose_header())

            item = Item(row[0],row[1],row[2],row[5],row[7],row[6],row[8])
            result_table_tag.append(item.compose_item())

        return result_table_tag




class ItemGroup():
    def __init__(self, name, price_type_string):
        self.item_list = []
        self.name = name
        self.price_type_string = price_type_string

    def compose_price_types(self):
        price_type_array = self.price_type_string.split("|")

        price_tag_array = []

        for price in price_type_array:
            if price != "":
                price_header_tag = soup.new_tag("td")
                price_header_tag["class"] = "priceHeader"

                price_header_tag.string = price.decode("utf-8")
                price_header_tag.append(BeautifulSoup("<br />"))

                span_tag = soup.new_tag("span")

                if price_type_array.index(price) == 0:
                    span_tag.string = u"Цена "
                    span_tag.append(BeautifulSoup("<font color=\"red\">Я</font>ндекса"))
                else:
                    span_tag.string = u"Цена"

                price_header_tag.append(span_tag)

                price_tag_array.append(price_header_tag)

        return price_tag_array
        
    def compose_header(self):
        header_tag = soup.new_tag("tr")

        header_tag["class"] = "iHeader"

        header_name_tag = soup.new_tag("td")
        header_name_tag.append(BeautifulSoup("<strong>"+self.name.decode("utf-8")+"</strong>"))
        header_tag.append(header_name_tag)

        header_size_tag = soup.new_tag("td")
        header_size_tag.append(u"Размер")
        header_tag.append(header_size_tag)

        price_tag_array = self.compose_price_types()

        for price_tag in price_tag_array:
            header_tag.append(price_tag)

        return header_tag

class Item():
    def __init__(self, name, char, price_string, item_hash, parent_hash, ed_izm, stock):
        self.name = name
        self.char = char
        self.price_string = price_string
        self.item_hash = item_hash
        self.parent_hash = parent_hash
        self.ed_izm = ed_izm

        if stock == 0:
            self.stock = "Под заказ"
            self.stockSchema = "http://schema.org/PreOrder"
            self.stocked = False
        else:
            self.stock = "В наличии"
            self.stockSchema = "http://schema.org/InStock"
            self.stocked = True

        ral = self.name.split("RAL ")
        if ral.__len__()>1:
            r_key = ral[1].split(" ")
            self.ral_color = self.get_RAL(r_key[0])
        else:
            self.ral_color = ""


    def get_RAL(self,r_key):
        ral_array = {
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
        if r_key in ral_array:
            return ral_array[r_key]
        else:
            return '#000000'

    def compose_price(self):
        price_array = self.price_string.split("|")
        
        price_tag_array = []

        for price in price_array:
            # print "}"+price+"{"
            if price != "":
                price_item_tag = soup.new_tag("td")

                if price_array.index(price) != price_array.__len__() - 1:
                    price_item_tag["class"] = "price itemPrice"+str(price_array.index(price))
                    span_tag = soup.new_tag("span")
                    span_tag.append(price)

                    price_item_tag.append(span_tag)

                else:
                   price_item_tag["class"] = "price itemPrice"+str(price_array.index(price))
                   price_item_tag["itemprop"] = "offers"
                   price_item_tag["itemscope itemtype"] = "http://schema.org/Offer"

                   span_tag = soup.new_tag("span")
                   span_tag["itemprop"] = "price"
                   span_tag.append(price)
                   price_item_tag.append(span_tag)

                   meta_tag = soup.new_tag("meta")
                   meta_tag["itemprop"] = "priceCurrency"
                   meta_tag["content"] = "RUB"
                   price_item_tag.append(meta_tag)

                   span_availability_tag = soup.new_tag("span")
                   span_availability_tag["style"] = "display:none"
                   span_availability_tag["itemprop"] = "availability"
                   span_availability_tag["href"] = self.stockSchema
                   span_availability_tag.append(self.stock.decode("utf-8"))
                   price_item_tag(span_availability_tag)

                   #### div compozing ####
                   div_tag = soup.new_tag("div")
                   div_tag["style"] = "display:none"
                   div_tag["itemprop"] = "seller"
                   div_tag["itemscope itemtype"] = "http://schema.org/Organization"

                   span_shop_tag = soup.new_tag("span")
                   span_shop_tag["itemprop"] = "name"
                   span_shop_tag.append(u"Тримет ООО")
                   div_tag.append(span_shop_tag)

                   div_postal_tag = soup.new_tag("div")
                   div_postal_tag["itemprop"] = "address"
                   div_postal_tag["itemscope itemtype"] = "http://schema.org/PostalAddress"

                   span_sa_tag = soup.new_tag("span")
                   span_sa_tag["itemprop"] = "streetAddress"
                   span_sa_tag.append(u"ул. Республики, 278 а, строение 1")
                   div_postal_tag.append(span_sa_tag)

                   span_pc_tag = soup.new_tag("span")
                   span_pc_tag["itemprop"] = "postalCode"
                   span_pc_tag.append("625014")
                   div_postal_tag.append(span_pc_tag)

                   span_al_tag = soup.new_tag("span")
                   span_al_tag["itemprop"] = "addressLocality"
                   span_al_tag.append(u"Тюмень, Россия")
                   div_postal_tag.append(span_al_tag)

                   div_tag.append(div_postal_tag)

                   span_phone_tag = soup.new_tag("span")
                   span_phone_tag["itemprop"] = "telephone"
                   span_phone_tag.append("+7 (3452) 520-670")
                   div_tag.append(span_phone_tag)

                   #### div compozed ####

                   price_item_tag.append(div_tag)

                price_tag_array.append(price_item_tag)

        return price_tag_array

    def compose_item(self):
        item_tag = soup.new_tag("tr")
        item_tag["class"] = "item"
        item_tag["id"] = self.item_hash+":"+self.parent_hash
        item_tag["itemscope itemtype"] = "http://schema.org/Product"

        #### name&buy td composing ####

        item_name_tag = soup.new_tag("td")
        item_name_tag["name"] = self.name.decode("utf-8")
        item_name_tag["class"] = "itemName"

        item_name_span_tag = soup.new_tag("span")
        item_name_span_tag["itemprop"] = "name"
        item_name_span_tag.append(self.name.decode("utf-8"))
        item_name_tag.append(item_name_span_tag)

        item_buy_span_tag = soup.new_tag("span")
        item_buy_span_tag["class"] = "buySpan"

        item_buy_a_tag = soup.new_tag("a")
        if self.stocked:
            item_buy_a_tag["class"] = u"bItem"
            item_buy_a_tag["href"] = u"Добавить в корзину"
            item_buy_a_tag["onClick"] = u"""yaCounter15882208.reachGoal('onBuyLinkPressed', 'купить'); 
                        openItem('"""+self.item_hash+":"+self.parent_hash+"""', 
                            '"""+self.ed_izm.decode("utf-8")+"', '"+self.price_string.decode("utf-8")+"""','1'); 
                        return false"""
            item_buy_a_tag.append(u"купить")
        else:
            item_buy_a_tag["class"] = "oItem"
            item_buy_a_tag["href"] = u"Добавить в корзину"
            item_buy_a_tag["onClick"] = u"""yaCounter15882208.reachGoal('onBuyLinkPressed', 'заказать'); 
                        openItem('"""+self.item_hash+":"+self.parent_hash+"""', 
                            '"""+self.ed_izm.decode("utf-8")+"', '"+self.price_string.decode("utf-8")+"""','0'); 
                        return false"""
            item_buy_a_tag.append(u"заказать")

        item_buy_span_tag.append(item_buy_a_tag)
        item_name_tag.append(item_buy_span_tag)

        item_tag.append(item_name_tag)

        #### FINISHED name&buy td composing ####

        #### char td composing ####

        item_char_tag = soup.new_tag("td")
        item_char_tag["name"] = self.char.decode("utf-8")
        item_char_tag["class"] = "itemChar"
        item_char_tag["itemprop"] = "model"

        if self.ral_color == "":
            item_char_tag.append(self.char.decode("utf-8"))
        else:
            item_char_tag["style"] = "background-color:"+self.ral_color;
            item_char_span_tag = soup.new_tag("span")
            item_char_span_tag["style"] = "color:#cfcfcf;text-shadow: 1px 1px 2px black, 0 0 1em grey;"

            item_char_span_tag.append(self.char.decode("utf-8"))
            item_char_tag.append(item_char_span_tag)

        item_tag.append(item_char_tag)

        #### FINISHED char td composing ####

        for item_price_tag in self.compose_price():
            item_tag.append(item_price_tag)

        return item_tag


form = cgi.FieldStorage()
if form.has_key("term"):

    result_table = ResultTable(form["term"].value, "catalog")
    
    print "Content-Type: text/html; charset=utf-8\n"
    print str(result_table.compose_table())

# g = ResultTable("Арматура","catalog")
# print g.compose_table().prettify()

# str_class = "йцукен"

# tag = soup.new_tag("div")
# tag["id"] = u"ня"
# tag["class"] = str_class.decode("utf-8")
# tag.append(u"зы")

# print tag.prettify("utf-8")