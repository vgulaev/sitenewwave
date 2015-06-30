#!/web/trimetru/python/bin/python2.6
# -*- coding: utf-8 -*-

import sys
import os
import cgi

import cgitb
cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))
reload(sys)
sys.setdefaultencoding('utf-8')

print("Content-Type: text/html; charset=utf-8\n")

from bs4 import BeautifulSoup

import datetime

import json


class PrintOrder():

    def __init__(self, order_json):
        print_template = ""

        pt = open("../site/templates/print.tpl.html", "r")
        print_template = pt.read()
        pt.close()

        self.print_soup = BeautifulSoup(print_template, 'html.parser')

        self.order_json = order_json

        self.set_date()
        self.populate_table()

    def set_date(self):
        date = self.print_soup.find(id="today")
        date.string = str(datetime.datetime.today().strftime('%d.%m.%Y'))

    def populate_table(self):

        soup = BeautifulSoup()

        order_item_list = self.print_soup.find(id="item_list")

        num = 1

        for item in self.order_json["order"]:

            tr_tag = soup.new_tag("tr")

            td_num = soup.new_tag("td")
            td_num["class"] = "disgits"
            td_num.append(str(num))
            num = num + 1
            tr_tag.append(td_num)

            td_name = soup.new_tag("td")
            td_name.append(item[0] + " " + item[1])
            tr_tag.append(td_name)

            td_count = soup.new_tag("td")
            td_count.append(item[2])
            tr_tag.append(td_count)

            td_edizm = soup.new_tag("td")
            td_edizm.append(item[3])
            tr_tag.append(td_edizm)

            td_price = soup.new_tag("td")
            td_price["class"] = "digits"
            td_price.append(item[4])
            tr_tag.append(td_price)

            td_sum = soup.new_tag("td")
            td_sum["class"] = "digits"
            td_sum.append(item[5])
            tr_tag.append(td_sum)

            order_item_list.append(tr_tag)

        tr_total = soup.new_tag("tr")
        tr_total["class"] = "overall"

        td_total_text = soup.new_tag("td")
        td_total_text["colspan"] = "5"
        td_total_text.append(u"Итого")
        tr_total.append(td_total_text)

        td_total_s = soup.new_tag("td")
        td_total_s["class"] = "digits"
        td_total_s.append(str(self.order_json["total"]))
        tr_total.append(td_total_s)

        order_item_list.append(tr_total)


    def output(self):
        print(self.print_soup.prettify())


post = {}

if "POST_DATA" in os.environ:
    raw_post = os.environ["POST_DATA"]
else:
    raw_post = sys.stdin.read()

if raw_post != "":
    pre_post = raw_post.split("&")
    # print pre_post
    for variables in pre_post:
        # print variables
        key_var = str(variables).split("=")
        # print key_var
        post[key_var[0]] = key_var[1]

if "order_json" in post:
    order_json = json.loads(post["order_json"])

    # print order_json["order"][0][0]

else:
    order_json = {u"order": [], u"total": 0}


MyOrder = PrintOrder(order_json)
MyOrder.output()
