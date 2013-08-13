#!/web/trimetru/python/bin/python2.6
# -*- coding:utf-8 -*-

import sys, os
import cgi
import cgitb; cgitb.enable()
import imp
import Cookie


lib_path = os.path.abspath('1cengine/py_scripts/')
sys.path.append(lib_path)
_PATH_ = os.path.abspath(os.path.dirname(__file__))

def show_authorization_page():
    pass

def authorized_redirect():
    
    python_lib_name = "user"
    user_lib = imp.load_source(python_lib_name, lib_path+"/"+python_lib_name+".py")

    if user_lib.__main__("check_SID()") == True:
        return """
            <div>
            <script type="text/javascript">
                $(document).ready( function(){
                        window.location = "/kabinet/orders/"
                    })
            </script>
            </div>
        """
    else:
        return """
            <div>
            <script type="text/javascript">
                $(document).ready( function(){
                    
                        window.location = "/kabinet/authorization/"
                    })
            </script>
            </div>
        """
def show_menu():

    python_lib_name = "kabinet_menu"
    kabinet_menu_lib = imp.load_source(python_lib_name, lib_path+"/"+python_lib_name+".py")

    menu = kabinet_menu_lib.show_menu("main")

    return menu

def __main__(funkt):
    return eval(funkt)