#!/web/trimetru/python/bin/python2.6
# -*- coding:utf-8 -*-

import sys
import os
import cgitb
cgitb.enable()
import imp


lib_path = os.path.abspath('1cengine/payment_success/')
sys.path.append(lib_path)
_PATH_ = os.path.abspath(os.path.dirname(__file__))


def report_success():
    python_lib_name = "report_success"
    success_lib = imp.load_source(
        python_lib_name, lib_path + "/" + python_lib_name + ".py")

    import Cookie

    cookie = Cookie.SimpleCookie(os.environ["HTTP_COOKIE"])
    # print cookie
    if "uid" in cookie:
        uid = cookie["uid"].value
    else:
        uid = None

    return "<div>" + success_lib.report_1c(uid) + "</div>"


def __main__(funkt):
    return eval(funkt)
