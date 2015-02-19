#!/web/trimetru/python/bin/python2.6
# -*- coding:utf-8 -*-

import sys
import os
import cgi
import cgitb
cgitb.enable()
import imp
import Cookie
import json

_PATH_ = os.path.abspath(os.path.dirname(__file__))

def check_user():
    python_lib_name = "user"
    user_lib = imp.load_source(
        python_lib_name, _PATH_ + "/" + python_lib_name + ".py")

    if user_lib.__main__("check_SID()") is True:
        cookie = Cookie.SimpleCookie(os.environ["HTTP_COOKIE"])
        sid = cookie["sid"].value
        # print sid
        uid_1c = user_lib.__main__("get_1c_sid('" + sid + "')")

        python_lib_name = "1c_user_interaction"
        user_1c_lib = imp.load_source(
            python_lib_name, _PATH_ + "/" + python_lib_name + ".py")

        user_1c = user_1c_lib.User1C()
        user_data = user_1c.get_user_information(uid_1c)

        user_fj = {}
        user_fj["Email"] = user_data["Email"]
        user_fj["Fullname"] = user_data["Fullname"]
        user_fj["Counterparty"] = []
        for cp in user_data["CounterpartyList"][0]:
            user_fj["Counterparty"].append(cp)

        return json.dumps(user_fj)

    else:
        return None

    #     cookie = Cookie.SimpleCookie(os.environ["HTTP_COOKIE"])
    #     sid = cookie["sid"].value
    #     # print sid
    #     uid_1c = user_lib.__main__("get_1c_sid('" + sid + "')")
    #     python_lib_name2 = "get_orders_list"
    #     get_orders_list_lib = imp.load_source(
    #         python_lib_name2, lib_path + "/" + python_lib_name2 + ".py")

    #     try:
    #         data = "<div>" + get_orders_list_lib.__main__(
    #             "get_orders_list('" + uid_1c + "')") + "</div>"
    #     except:
    #         data = "<div>Контрагент не назначен или что-то пошло не так</div>"

    #     return data
    # else:
    #     return """
    #     <div>
    #     <redirectme>
    #         /kabinet/authorization/
    #     </redirectme>
    #     </div>
    #     """


print ("Content-Type: application/json; charset=utf-8\n")

print check_user()
