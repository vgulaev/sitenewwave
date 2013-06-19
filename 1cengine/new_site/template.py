#-*- coding:utf-8 -*-

import cgi

def set_title():
    form = cgi.FieldStorage()
    if form.has_key("ref"):
        return form["ref"].value+" купить онлайн | Тримет ООО "
    else:
        return "Тримет"