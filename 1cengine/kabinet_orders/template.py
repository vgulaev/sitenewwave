#!/web/trimetru/python/bin/python2.6
# -*- coding:utf-8 -*-

import sys, os
import cgi
import cgitb; cgitb.enable()
import imp
import Cookie


lib_path = os.path.abspath('1cengine/kabinet_authorization/')
sys.path.append(lib_path)
_PATH_ = os.path.abspath(os.path.dirname(__file__))

def show_authorization_page():
    pass

def show_orders():
    
    python_lib_name = "user"
    user_lib = imp.load_source(python_lib_name, lib_path+"/"+python_lib_name+".py")

    if user_lib.__main__("check_SID()") == True:
        cookie = Cookie.SimpleCookie(os.environ["HTTP_COOKIE"])
        sid = cookie["sid"].value
        
        uid_1c = user_lib.__main__("get_1c_sid('"+sid+"')")
        python_lib_name = "get_orders_list"
        get_orders_list_lib = imp.load_source(python_lib_name, _PATH_+"/"+python_lib_name+".py")
        
        try:
            data = get_orders_list_lib.__main__("get_orders_list('"+uid_1c+"')")
        except:
            data = "Контрагент не назначен"
        
        return data
    else:
        return "(("
    

def __main__(funkt):
    return eval(funkt)