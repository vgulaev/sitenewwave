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


def show_personal():

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
        
        table_tag = soup.new_tag("table")
        table_tag["id"] = "personal_tab"

        passwd_tr = soup.new_tag("tr")
        
        passwd_label_td = soup.new_tag("td")
        passwd_label_td.append("Пароль")

        passwd_input_td = soup.new_tag("td")
        passwd_input = soup.new_tag("input")
        passwd_input["type"] = "password"
        passwd_input["id"] = "passwd_input"
        passwd_input_td.append(passwd_input)

        passwd_button_td = soup.new_tag("td")
        passwd_button_div = soup.new_tag("div")
        passwd_button_div["id"] = "passwd_button"
        passwd_button_div.append("Изменить")
        passwd_button_td.append(passwd_button_div)

        passwd_tr.append(passwd_label_td)
        passwd_tr.append(passwd_input_td)
        passwd_tr.append(passwd_button_td)

        table_tag.append(passwd_tr)

        return "<div>"+str(table_tag)+"</div>"        

def __main__(funkt):
    return eval(funkt)