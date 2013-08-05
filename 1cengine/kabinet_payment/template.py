#!/web/trimetru/python/bin/python2.6
# -*- coding:utf-8 -*-

import sys, os
import cgi
import cgitb; cgitb.enable()
import imp

from bs4 import BeautifulSoup

soup = BeautifulSoup()

lib_path = os.path.abspath('1cengine/py_scripts/')
sys.path.append(lib_path)
_PATH_ = os.path.abspath(os.path.dirname(__file__))

def get_payments_list(uid):

    python_lib_name = "get_payments_list"
    payment_lib = imp.load_source(python_lib_name, lib_path+"/"+python_lib_name+".py")

    return payment_lib.get_orders_list(uid) 

    return "<div>nya</div>"

def show_payments():

    python_lib_name = "user"
    user_lib = imp.load_source(python_lib_name, lib_path+"/"+python_lib_name+".py")

    user = user_lib.User()

    if user.check_SID() == False:
        return """
            <div>
            <script type="text/javascript">
                $(document).ready( function(){
                        window.location = "/kabinet/authorization/"
                    })
            </script>
            </div>
        """
    else:

        cookie = Cookie.SimpleCookie(os.environ["HTTP_COOKIE"])
        sid = cookie["sid"].value
        uid_1c = user_lib.__main__("get_1c_sid('"+sid+"')")
        
        return get_payments_list(uid_1c)       

def __main__(funkt):
    return eval(funkt)