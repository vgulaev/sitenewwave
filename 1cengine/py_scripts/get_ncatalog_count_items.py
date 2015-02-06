#!/web/trimetru/python/bin/python2.6
# -*- coding: utf-8 -*-


import sys
import os
import cgi
import cgitb
cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))


import imp
# py_scripts_path = os.path.expanduser('~/web/sitenewwave/1cengine/py_scripts/') #development
py_scripts_path = os.path.expanduser('~/site/www/1cengine/py_scripts/') #production

_PATH_ = os.path.abspath(os.path.dirname(__file__))

secrets_lib_name = "secrets"
secrets_lib_path = "structures/secrets.py"
secrets = imp.load_source(
    secrets_lib_name,
    _PATH_ + "/" + secrets_lib_path
)

myDBC = secrets.myDBC


def count_items_hash(ghash, params={}):

    connector = myDBC("catalog")
    connector.dbConnect()

    if "pa" in params:
        if params["pa"].__len__() > 1:
            parent = " OR ".join(params["pa"])
        else:
            parent = params["pa"][0]
        parent = "AND ({0}) AND `item`.`item_parent_ref`=`item_parent`.`id`".format(parent)
    else:
        parent = ""

    if "th" in params:
        if params["th"].__len__() > 1:
            thickness = " OR ".join(params["th"])
        else:
            thickness = params["th"][0]
        thickness = "AND ({0})".format(thickness)
    else:
        thickness = ""

    if "di" in params:
        if params["di"].__len__() > 1:
            diameter = " OR ".join(params["di"])
        else:
            diameter = params["di"][0]
        diameter = "AND ({0})".format(diameter)
    else:
        diameter = ""

    if "he" in params:
        if params["he"].__len__() > 1:
            height = " OR ".join(params["he"])
        else:
            height = params["he"][0]
        height = "AND ({0})".format(height)
    else:
        height = ""

    query = """
        SELECT count(`item`.`name`)
            FROM `item`, `item_parent`
            WHERE `item`.`site_group_ref`='{0}'
            {1}
            {2}
            {3}
            {4}
            AND `item_parent`.`id` = `item`.`item_parent_ref`
    """.format(ghash, parent, thickness, diameter, height)

    r = connector.dbExecute(query)

    connector.dbClose()

    return r[0][0]


form = cgi.FieldStorage()

if "term" in form:

    print "Content-Type: text/html; charset=utf-8\n"
    print str(count_items(form["term"].value))

if "hash" in form:

    print "Content-Type: text/html; charset=utf-8\n"

    if "params" in form and form["params"].value != ";":
        # print "|"+form["params"].value+"|"
        params = {}
        param_string = form["params"].value
        param_arr = param_string.replace(
            "'", "", 1
        ).replace(
            "',;", ""
        ).split("','")

        for param in param_arr:
            if "pa_" in param:
                if "pa" in params:
                    params["pa"].append("`item_parent`.`name`='"+param.replace("pa_", "", 1)+"'")
                else:
                    params["pa"] = []
                    params["pa"].append("`item_parent`.`name`='"+param.replace("pa_", "", 1)+"'")

            if "th_" in param:
                if "th" in params:
                    params["th"].append("`item`.`thickness`='"+param.replace("th_", "", 1)+"'")
                else:
                    params["th"] = []
                    params["th"].append("`item`.`thickness`='"+param.replace("th_", "", 1)+"'")

            if "di_" in param:
                if "di" in params:
                    params["di"].append("`item`.`diameter`='"+param.replace("di_", "", 1)+"'")
                else:
                    params["di"] = []
                    params["di"].append("`item`.`diameter`='"+param.replace("di_", "", 1)+"'")

            if "he_" in param:
                if "he" in params:
                    params["he"].append("`item`.`height`='"+param.replace("he_", "", 1)+"'")
                else:
                    params["he"] = []
                    params["he"].append("`item`.`height`='"+param.replace("he_", "", 1)+"'")

        # print param_string
        print str(count_items_hash(form["hash"].value.decode("utf-8"), params))

    else:
        print str(count_items_hash(form["hash"].value.decode("utf-8")))
