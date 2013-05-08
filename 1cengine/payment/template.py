#!/web/trimetru/python/bin/python2.6
# -*- coding:utf-8 -*-

import sys, os
import cgi
import cgitb; cgitb.enable()
import imp
import Cookie


lib_path = os.path.abspath('1cengine/payment/')
sys.path.append(lib_path)
_PATH_ = os.path.abspath(os.path.dirname(__file__))

def show_order():
    python_lib_name = "get_order"
    order_lib = imp.load_source(python_lib_name, lib_path+"/"+python_lib_name+".py")


    get = cgi.FieldStorage()
    # print get
    if "page" in get:
        page = get["page"].value
        page_array = page.split("/")
        if page_array.__len__() == 2:
            uid = page_array[1]
            # print uid
    else:
        uid = None

    return order_lib.get_order(uid)
    

def __main__(funkt):
    return eval(funkt)