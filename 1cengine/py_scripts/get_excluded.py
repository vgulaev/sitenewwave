#!/usr/bin/python2.6
# -*- coding: utf-8 -*-


import cgi
import cgitb
cgitb.enable()

from secrets import *


def get_excluded_item_params_from_parent(group_name, parent_array, excluded_field):
    ret = []
    connector = myDBC("ncatalog")
    connector.dbConnect()

    parent_name = " OR ".join(parent_array)
    # print parent_name

    query = """
        SELECT DISTINCT `item`.`{2}`
        FROM `item`, `item_parent`, `site_group`
        WHERE `site_group`.`name`='{0}'
            AND `item`.`site_group_ref`=`site_group`.`id`
            AND `item`.`{2}` NOT IN
            (
                SELECT DISTINCT `item`.`{2}`
                FROM `item`, `item_parent`, `site_group`
                WHERE `site_group`.`name`='{0}'
                    AND `item`.`site_group_ref`=`site_group`.`id`
                    AND ({1})
                    AND `item`.`item_parent_ref`=`item_parent`.`id`
            )
    """.format(group_name, parent_name, excluded_field)

    r = connector.dbExecute(query)

    for row in r:
        ret.append(excluded_field[:2]+"_"+str(row[0]))

    connector.dbClose()

    return ret


def get_excluded_item_parents(group_name, param_array):
    ret = []
    connector = myDBC("ncatalog")
    connector.dbConnect()

    param_value = " OR ".join(param_array)

    query = """
        SELECT DISTINCT `item_parent`.`name`
        FROM `item_parent`, `item`, `site_group`
        WHERE `site_group`.`name`='{0}'
            AND `item`.`site_group_ref`=`site_group`.`id`
            AND `item_parent`.`id`=`item`.`item_parent_ref`
            AND `item_parent`.`name` NOT IN
            (
                SELECT DISTINCT `item_parent`.`name`
                FROM `item_parent`, `item`, `site_group`
                WHERE `site_group`.`name`='{0}'
                    AND `item`.`site_group_ref`=`site_group`.`id`
                    AND `item_parent`.`id`=`item`.`item_parent_ref`
                    AND ({1})
            )
    """.format(group_name, param_value)

    r = connector.dbExecute(query)

    for row in r:
        ret.append("pa_"+str(row[0]))

    connector.dbClose()

    return ret


def get_excluded_item_params(group_name, param_array, excluded_param):
    ret = []
    connector = myDBC("ncatalog")
    connector.dbConnect()

    active_param_value = " OR ".join(param_array)

    query = """
        SELECT DISTINCT `item`.`{2}`
        FROM `item_parent`, `item`, `site_group`
        WHERE `site_group`.`name`='{0}'
            AND `item`.`site_group_ref`=`site_group`.`id`
            AND `item`.`{2}` NOT IN (
                SELECT DISTINCT `item`.`{2}`
                FROM `item_parent`, `item`, `site_group`
                WHERE `site_group`.`name`='{0}'
                    AND `item`.`site_group_ref`=`site_group`.`id`
                    AND ({1})
            )
    """.format(group_name, active_param_value, excluded_param)

    r = connector.dbExecute(query)

    for row in r:
        ret.append(excluded_param[:2]+"_"+str(row[0]))

    connector.dbClose()
    # print ret
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

        if "pa" in params:
            excluded_string = excluded_string + " ; ".join(get_excluded_item_params_from_parent(form["hash"].value, params["pa"], "diameter")) + " ; "
            excluded_string = excluded_string + " ; ".join(get_excluded_item_params_from_parent(form["hash"].value, params["pa"], "thickness")) + " ; "

        if "th" in params:
            excluded_string = excluded_string + " ; ".join(get_excluded_item_parents(form["hash"].value, params["th"])) + " ; "
            excluded_string = excluded_string + " ; ".join(get_excluded_item_params(form["hash"].value, params["th"], "diameter")) + " ; "

        if "di" in params:
            excluded_string = excluded_string + " ; ".join(get_excluded_item_parents(form["hash"].value, params["di"])) + " ; "
            excluded_string = excluded_string + " ; ".join(get_excluded_item_params(form["hash"].value, params["di"], "thickness")) + " ; "



        print excluded_string
