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

secrets_lib_name = "secrets"
secrets_lib_path = "structures/secrets.py"
secrets = imp.load_source(
    secrets_lib_name,
    py_scripts_path + secrets_lib_path
)

myDBC = secrets.myDBC

def get_excluded_all(group_name, params):

    if "pa" in params:
        if params["pa"].__len__() > 1:
            parent = " OR ".join(params["pa"])
        else:
            parent = params["pa"][0]
        parent = "AND ({0})".format(parent)
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

    ret = []
    connector = myDBC("catalog")
    connector.dbConnect()

    pa_array = []
    di_array = []
    th_array = []
    he_array = []

    if height != "" or thickness != "" or diameter != "":

        pa_query = """
                SELECT DISTINCT `item_parent`.`name`
                FROM `item`, `item_parent`, `site_group`
                WHERE
                    `item`.`item_parent_ref`=`item_parent`.`id`
                    AND `item_parent`.`name` NOT IN (
                SELECT `item_parent`.`name`
                FROM `item`, `item_parent`, `site_group`
                WHERE
                    `item`.`item_parent_ref`=`item_parent`.`id`
                    {1}
                    {2}
                    {3}
                    AND `item`.`site_group_ref` = '{0}'
                ) AND `item`.`site_group_ref` = '{0}'
        """.format(group_name, thickness, diameter, height)

        r = connector.dbExecute(pa_query)

        # print(pa_query)
        for row in r:
            pa = "pa_"+str(row[0])
            if not pa in pa_array and row[0] != "":
                pa_array.append(pa)

    if height != "" or thickness != "" or parent != "":

        di_query = """
                SELECT DISTINCT `item`.`diameter`
                FROM `item`, `item_parent`, `site_group`
                WHERE
                    `item`.`item_parent_ref`=`item_parent`.`id`
                    AND `item`.`diameter` NOT IN (
                SELECT `item`.`diameter`
                FROM `item`, `item_parent`, `site_group`
                WHERE
                    `item`.`item_parent_ref`=`item_parent`.`id`
                    {1}
                    {2}
                    {3}
                    AND `item`.`site_group_ref` = '{0}'
                ) AND `item`.`site_group_ref` = '{0}'
        """.format(group_name, thickness, parent, height)

        r = connector.dbExecute(di_query)

        # print(di_query)
        for row in r:
            di = "di_"+str(row[0])
            if not di in di_array and row[0] != "":
                di_array.append(di)

    if height != "" or parent != "" or diameter != "":

        th_query = """
                SELECT DISTINCT `item`.`thickness`
                FROM `item`, `item_parent`, `site_group`
                WHERE
                    `item`.`item_parent_ref`=`item_parent`.`id`
                    AND `item`.`thickness` NOT IN (
                SELECT `item`.`thickness`
                FROM `item`, `item_parent`, `site_group`
                WHERE
                    `item`.`item_parent_ref`=`item_parent`.`id`
                    {1}
                    {2}
                    {3}
                    AND `item`.`site_group_ref` = '{0}'
                ) AND `item`.`site_group_ref` = '{0}'
        """.format(group_name, diameter, parent, height)

        r = connector.dbExecute(th_query)

        # print(th_query)
        for row in r:
            th = "th_"+str(row[0])
            if not th in th_array and row[0] != "":
                th_array.append(th)

    if parent != "" or thickness != "" or diameter != "":

        he_query = """
                SELECT DISTINCT `item`.`height`
                FROM `item`, `item_parent`, `site_group`
                WHERE
                    `item`.`item_parent_ref`=`item_parent`.`id`
                    AND `item`.`height` NOT IN (
                SELECT `item`.`height`
                FROM `item`, `item_parent`, `site_group`
                WHERE
                    `item`.`item_parent_ref`=`item_parent`.`id`
                    {1}
                    {2}
                    {3}
                    AND `item`.`site_group_ref` = '{0}'
                ) AND `item`.`site_group_ref` = '{0}'
        """.format(group_name, diameter, parent, thickness)

        r = connector.dbExecute(he_query)

        # print(he_query)
        for row in r:
            he = "he_"+str(row[0])
            if not he in he_array and row[0] != "":
                he_array.append(he)

    connector.dbClose()

    pa_string = ";".join(pa_array)
    he_string = ";".join(he_array)
    di_string = ";".join(di_array)
    th_string = ";".join(th_array)

    ret = pa_string +";"+ he_string +";"+ di_string +";"+ th_string

    return ret


form = cgi.FieldStorage()
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

        excluded_string = ""

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


            excluded_string = get_excluded_all(form["hash"].value, params)

        print excluded_string

