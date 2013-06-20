#-*- coding:utf-8 -*-

import cgi, os, sys
from bs4 import BeautifulSoup

form = cgi.FieldStorage()

def set_title():
    soup = BeautifulSoup()
    title_tag = soup.new_tag("title")
    
    if form.has_key("ref"):
        title_string = form["ref"].value+" купить онлайн | Тримет ООО " 
    else:
        title_string = "Купить Online"

    title_tag.append(title_string)
    return title_tag


def set_keywords():
    soup = BeautifulSoup()
    key_tag = soup.new_tag("meta")
    key_tag["name"] = "keywords"

    if form.has_key("ref"):
        key_tag["content"] = form["ref"].value.decode("utf-8") + u" купить, онлайн, тюмень"
    else:
        key_tag["content"] = u"металлопрокат, профнастил, металлосайдинг, купить, онлайн, тюмень, арматура, балка, швеллер, трубы, угол, штрипс, квадрат, круг, лист, проволока"

    return key_tag

def set_description():
    soup = BeautifulSoup()
    description_tag = soup.new_tag("meta")
    description_tag["name"] = "description"
    description_tag["content"] = u"Покупка металлосайдинга, профнастила, металлопроката в Тюмени онлайн"

    return description_tag

def set_search_value():
    soup = BeautifulSoup()
    input_search_item = soup.new_tag("input")
    input_search_item["id"] = "itemName"
    input_search_item["placeholder"] = u"Введите здесь интересующий вас товар"

    if form.has_key("ref"):
        input_search_item["value"] = form["ref"].value.decode("utf-8")

    elif form.has_key("catalog"):
        input_search_item["value"] = form["catalog"].value.decode("utf-8")    
    else:
        input_search_item["value"] = ""

    return input_search_item

def set_search_results():
    if form.has_key("ref"):
        # form["term"] = form["ref"].value.decode("utf-8")

        lib_path = os.path.abspath('../py_scripts/')
        sys.path.append(lib_path)

        # print lib_path
        import imp
        get_items_cl = imp.load_source("get_items_cl", lib_path+"/get_items_cl"+".py")
        get = "strict"
        return get_items_cl.showItems(form["ref"].value)
        # r = python_lib.__main__(python_method_name)