#!/web/trimetru/python/bin/python2.6
# -*- coding:utf-8 -*-

import sys
import os
import cgi
import cgitb
cgitb.enable()
import imp

from bs4 import BeautifulSoup

soup = BeautifulSoup()

lib_path = os.path.abspath('1cengine/py_scripts/')
sys.path.append(lib_path)
_PATH_ = os.path.abspath(os.path.dirname(__file__))


menu_list = {
    "authorized": {
        0: ["/kabinet/orders", "Мои заказы"],
        1: ["/kabinet/payment", "Мои платежи"],
        2: ["/kabinet/shipping", "Мои отгрузки"],
        3: ["/kabinet/settlement", "Мои взаиморасчеты"],
        4: ["/1cengine/site/", "Создать новый заказ"],
        5: ["/kabinet/personal", "Мои настройки"]
    },
    "not-authorized": {
        0: ["authorization", "Авторизация"]
    }
}


def show_menu(active_element):

    python_lib_name = "user"
    user_lib = imp.load_source(
        python_lib_name, lib_path + "/" + python_lib_name + ".py")

    ul_tag = soup.new_tag("ul")

    if user_lib.__main__("check_SID()") is True:

        menu_authorized = menu_list["authorized"]
        authorized_length = menu_authorized.__len__()
        i = 0

        while i < authorized_length:
            li_tag = soup.new_tag("li")
            if not menu_authorized[i][0] == active_element:
                a_tag = soup.new_tag("a")
                a_tag["href"] = menu_authorized[i][0]
                a_tag["title"] = menu_authorized[i][1]
                a_tag.append(menu_authorized[i][1])
                li_tag.append(a_tag)
            else:
                li_tag["class"] = "active"
                li_tag.append(menu_authorized[i][1])

            ul_tag.append(li_tag)

            i = i + 1

            ul_tag.append(li_tag)

        li_tag = soup.new_tag("li")
        a_tag = soup.new_tag("a")
        a_tag["href"] = "javascript:logout()"
        a_tag.append("Выход")

        li_tag.append(a_tag)

        ul_tag.append(li_tag)
    else:

        menu_not_authorized = menu_list["not-authorized"]
        authorized_length = menu_not_authorized.__len__()
        i = 0

        while i < authorized_length:
            li_tag = soup.new_tag("li")
            if not menu_not_authorized[i][0] == active_element:
                a_tag = soup.new_tag("a")
                a_tag["href"] = menu_not_authorized[i][0]
                a_tag["title"] = menu_not_authorized[i][1]
                a_tag.append(menu_not_authorized[i][1])
                li_tag.append(a_tag)
            else:
                li_tag["class"] = "active"
                li_tag.append(menu_not_authorized[i][1])

            ul_tag.append(li_tag)

            i = i + 1

            ul_tag.append(li_tag)

    return "<div>" + str(ul_tag) + "</div>"
