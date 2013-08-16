#!/web/trimetru/python/bin/python2.6
# -*- coding:utf-8 -*-

import sys, os
import cgi
import cgitb; cgitb.enable()
import imp
import Cookie

from bs4 import BeautifulSoup

soup = BeautifulSoup()

lib_path = os.path.abspath('1cengine/py_scripts/')
sys.path.append(lib_path)
_PATH_ = os.path.abspath(os.path.dirname(__file__))

def get_shipping_list(uid):

    python_lib_name = "get_shipping_list"
    payment_lib = imp.load_source(python_lib_name, lib_path+"/"+python_lib_name+".py")

    return "<div>"+str(payment_lib.get_shipping_list(uid))+"</div>" 


def show_shipping():

    python_lib_name = "user"
    user_lib = imp.load_source(python_lib_name, lib_path+"/"+python_lib_name+".py")

    user = user_lib.User()

    if user.check_SID() == False:
        return """
        <redirectme>
            /kabinet/authorization/
        </redirectme>
        """
    else:

        cookie = Cookie.SimpleCookie(os.environ["HTTP_COOKIE"])
        sid = cookie["sid"].value
        uid_1c = user_lib.__main__("get_1c_sid('"+sid+"')")
        
        try:
            return get_shipping_list(uid_1c)       
        except:
            return "<div>Контрагент не назначен или что-то пошло не так</div>"

def show_menu():

    python_lib_name = "kabinet_menu"
    kabinet_menu_lib = imp.load_source(python_lib_name, lib_path+"/"+python_lib_name+".py")

    menu = kabinet_menu_lib.show_menu("shipping")

    return menu

def __main__(funkt):
    return eval(funkt)