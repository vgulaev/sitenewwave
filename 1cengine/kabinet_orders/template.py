#!/web/trimetru/python/bin/python2.6
# -*- coding:utf-8 -*-

import sys
import os
import cgi
import cgitb
cgitb.enable()
import imp
import Cookie


lib_path = os.path.abspath('1cengine/py_scripts/')
sys.path.append(lib_path)
_PATH_ = os.path.abspath(os.path.dirname(__file__))


def show_authorization_page():
    pass


def show_orders():

    python_lib_name = "user"
    user_lib = imp.load_source(
        python_lib_name, lib_path + "/" + python_lib_name + ".py")

    if user_lib.__main__("check_SID()") is True:
        cookie = Cookie.SimpleCookie(os.environ["HTTP_COOKIE"])
        sid = cookie["sid"].value
        # print sid
        uid_1c = user_lib.__main__("get_1c_sid('" + sid + "')")
        python_lib_name2 = "get_orders_list"
        get_orders_list_lib = imp.load_source(
            python_lib_name2, lib_path + "/" + python_lib_name2 + ".py")

        try:
            data = "<div>" + get_orders_list_lib.__main__(
                "get_orders_list('" + uid_1c + "')") + "</div>"
        except:
            data = "<div>Контрагент не назначен или что-то пошло не так</div>"

        # data = "<div>" + get_orders_list_lib.__main__(
        #     "get_orders_list('" + uid_1c + "')") + "</div>"


        return data
    else:
        return """
        <div>
        <redirectme>
            /kabinet/authorization/
        </redirectme>
        </div>
        """


def show_menu():

    python_lib_name = "kabinet_menu"
    kabinet_menu_lib = imp.load_source(
        python_lib_name, lib_path + "/" + python_lib_name + ".py")

    menu = kabinet_menu_lib.show_menu("orders")

    return menu


def __main__(funkt):
    return eval(funkt)
