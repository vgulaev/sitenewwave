#!/web/trimetru/python/bin/python2.6
# -*- coding:utf-8 -*-

import sys, os
import cgi
import cgitb; cgitb.enable()
import imp
import Cookie


lib_path = os.path.abspath('1cengine/payment_success/')
sys.path.append(lib_path)
_PATH_ = os.path.abspath(os.path.dirname(__file__))

def report_success():
    python_lib_name = "report_success"
    success_lib = imp.load_source(python_lib_name, lib_path+"/"+python_lib_name+".py")

    import Cookie

    cookie = Cookie.SimpleCookie(os.environ["HTTP_COOKIE"])
    if cookie.has_key("uid"):
        uid = cookie["uid"].value
    else:
        uid = "none"

    return success_lib.report_1c(uid)
    

def __main__(funkt):
    return eval(funkt)