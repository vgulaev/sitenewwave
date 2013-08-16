#!/web/trimetru/python/bin/python2.6
# -*- coding:utf-8 -*-

import sys, os
import cgi
import cgitb; cgitb.enable()
import imp

from bs4 import BeautifulSoup

soup = BeautifulSoup()

lib_path = os.path.abspath('1cengine/py_scripts/')
sys.path.append(lib_path)
_PATH_ = os.path.abspath(os.path.dirname(__file__))

def compose_personal_part():
    fieldset_tag = soup.new_tag("fieldset")
    fieldset_tag["title"] = "Личные данные"
    legend_tag = soup.new_tag("legend")
    legend_tag.append("Личные данные")

    fieldset_tag.append(legend_tag)

    table_tag = soup.new_tag("table")
    table_tag["id"] = "personal_tab"

    #########
    
    fullname_tr = soup.new_tag("tr")

    fullname_label_td = soup.new_tag("td")
    fullname_label_td["id"] = "fullname_label"
    fullname_label_td.append("Ваше текущее ФИО:")
    


def compose_password_part():
    fieldset_tag = soup.new_tag("fieldset")
    fieldset_tag["title"] = "Смена пароля"
    legend_tag = soup.new_tag("legend")
    legend_tag.append("Сменить пароль")
    
    fieldset_tag.append(legend_tag)
    
    table_tag = soup.new_tag("table")
    table_tag["id"] = "passwd_tab"

    #########

    old_passwd_tr = soup.new_tag("tr")

    old_passwd_label_td = soup.new_tag("td")
    old_passwd_label_td.append("Старый пароль")
    old_passwd_input_td = soup.new_tag("td")
    old_passwd_input = soup.new_tag("input")
    old_passwd_input["type"] = "password"
    old_passwd_input["id"] = "old_passwd_input"
    old_passwd_input_td.append(old_passwd_input)

    old_passwd_tr.append(old_passwd_label_td)
    old_passwd_tr.append(old_passwd_input_td)

    table_tag.append(old_passwd_tr)

    #########

    passwd_tr = soup.new_tag("tr")
    
    passwd_label_td = soup.new_tag("td")
    passwd_label_td.append("Новый пароль")
    passwd_input_td = soup.new_tag("td")
    passwd_input = soup.new_tag("input")
    passwd_input["type"] = "password"
    passwd_input["id"] = "passwd_input"
    passwd_input_td.append(passwd_input)

    passwd_tr.append(passwd_label_td)
    passwd_tr.append(passwd_input_td)

    table_tag.append(passwd_tr)

    ##########

    repeat_passwd_tr = soup.new_tag("tr")
    
    repeat_passwd_label_td = soup.new_tag("td")
    repeat_passwd_label_td.append("Повторите пароль")
    repeat_passwd_input_td = soup.new_tag("td")
    repeat_passwd_input = soup.new_tag("input")
    repeat_passwd_input["type"] = "password"
    repeat_passwd_input["id"] = "repeat_passwd_input"
    repeat_passwd_input_td.append(repeat_passwd_input)

    repeat_passwd_tr.append(repeat_passwd_label_td)
    repeat_passwd_tr.append(repeat_passwd_input_td)

    table_tag.append(repeat_passwd_tr)

    ##########
    
    passwd_button_div = soup.new_tag("div")
    passwd_button_div["id"] = "passwd_button"
    passwd_button_div.append("Изменить")

    #########
    
    fieldset_tag.append(table_tag)
    fieldset_tag.append(passwd_button_div)

    return "<div>"+str(fieldset_tag)+"</div>"

def show_personal():

    python_lib_name = "user"
    user_lib = imp.load_source(python_lib_name, lib_path+"/"+python_lib_name+".py")

    user = user_lib.User()

    if user.check_SID() == False:
        return """
        <div>
        <redirectme>
            /kabinet/authorization/
        </redirectme>
        </div>
        """
    else:

         return compose_password_part()       

def show_menu():

    python_lib_name = "kabinet_menu"
    kabinet_menu_lib = imp.load_source(python_lib_name, lib_path+"/"+python_lib_name+".py")

    menu = kabinet_menu_lib.show_menu("personal")

    return menu

def __main__(funkt):
    return eval(funkt)