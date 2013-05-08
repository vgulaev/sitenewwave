#!/web/trimetru/python/bin/python2.6
# -*- coding:utf-8 -*-

import sys, os
import cgi
import cgitb; cgitb.enable()
import imp
import Cookie


lib_path = os.path.abspath('1cengine/payment/')
sys.path.append(lib_path)
_PATH_ = os.path.abspath(os.path.dirname(__file__))

def show_order():
    python_lib_name = "get_order"
    order_lib = imp.load_source(python_lib_name, lib_path+"/"+python_lib_name+".py")

    post = {}

    if "POST_DATA" in os.environ:
        raw_post = os.environ["POST_DATA"]
    else:
        raw_post = sys.stdin.read()

    if raw_post != "":
        pre_post = raw_post.split("&")
        # print pre_post
        for variables in pre_post:
            # print variables
            key_var = str(variables).split("=")
            # print key_var
            post[key_var[0]] = key_var[1]

    get = cgi.FieldStorage()
    print get
    if "uid" in get:
        uid = get["uid"].value
        print uid
    else:
        uid = "f4801240-b7a3-11e2-af3e-00163e25bdbe"

    return order_lib.get_order(uid)
    

def __main__(funkt):
    return eval(funkt)