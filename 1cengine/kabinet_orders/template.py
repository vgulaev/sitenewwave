#!/web/trimetru/python/bin/python2.6
# -*- coding:utf-8 -*-

import sys, os
import cgi
import cgitb; cgitb.enable()

import Cookie

lib_path = os.path.abspath('1cengine/kabinet_authorization/')
sys.path.append(lib_path)

def show_authorization_page():
    pass

def show_orders():
    import imp
    python_lib_name = "user"
    user_lib = imp.load_source(python_lib_name, lib_path+"/"+python_lib_name+".py")

    if user_lib.__main__("check_SID()") == True:
        return "Nya"
    else:
        return "(("
    

def __main__(funkt):
    return eval(funkt)