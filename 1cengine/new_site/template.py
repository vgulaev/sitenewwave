#-*- coding:utf-8 -*-

import cgi
from bs4 import BeautifulSoup

form = cgi.FieldStorage()

def set_title():
    
    if form.has_key("ref"):
        return form["ref"].value+" купить онлайн | Тримет ООО "
    else:
        return "Купить Online"


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