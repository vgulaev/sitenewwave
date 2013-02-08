#!/web/trimetru/python/bin/python2.6
# -*- coding:utf-8 -*-

import sys, os
import cgi
import cgitb; cgitb.enable()

lib_path = os.path.abspath('1cengine/kabinet_authorization/')
sys.path.append(lib_path)

def show_authorization_page():
    import imp
    python_lib_name = "user"
    user_lib = imp.load_source(python_lib_name, lib_path+"/"+python_lib_name+".py")
    
    _PATH_ = os.path.abspath(os.path.dirname(__file__))
    template_dir = "authorization_templates"

    if user_lib.__main__("check_SID()") == True:
        
        file_template = open(_PATH_+"/"+template_dir+"/authorized.html","r")
        template = file_template.read()
        file_template.close()

        return template
    else:
        file_template = open(_PATH_+"/"+template_dir+"/login.html","r")
        template = file_template.read()
        file_template.close()
        
        return template

def __main__(funkt):
    return eval(funkt)