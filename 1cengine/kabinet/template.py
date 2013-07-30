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
            <body>
            <script type="text/javascript">
                $(document).ready( function(){
                        window.location = "/kabinet/orders/"
                    })
            </script>
            </body>
        """
    else:
        return """
            <body>
            <script type="text/javascript">
                $(document).ready( function(){
                        window.location = "/kabinet/authorization/"
                    })
            </script>
            </body>
        """
    

def __main__(funkt):
    return eval(funkt)