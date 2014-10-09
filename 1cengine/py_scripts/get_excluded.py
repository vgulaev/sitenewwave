#!/usr/bin/python2.6
# -*- coding: utf-8 -*-


import cgi
import cgitb
cgitb.enable()

from secrets import *


def get_excluded_item_params_from_parent(group_name, parent_name, excluded_field):
    ret = []
    connector = myDBC("ncatalog")
    connector.dbConnect()

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
                    AND `item_parent`.`name`='{1}'
                    AND `item`.`item_parent_ref`=`item_parent`.`id`
            )
    """.format(group_name, parent_name, excluded_field)

    r = connector.dbExecute(query)

    for row in r:
        ret.append(str(row[0]))

    connector.dbClose()

    return ret


def get_excluded_item_parents(group_name, param_name, param_value):
    ret = []
    connector = myDBC("ncatalog")
    connector.dbConnect()

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
                    AND `item`.`{1}`='{2}'
            )
    """.format(group_name, param_name, param_value)

    r = connector.dbExecute(query)

    for row in r:
        ret.append(str(row[0]))

    connector.dbClose()

    return ret


def get_excluded_item_parents(group_name, active_param, active_param_value, excluded_param):
    ret = []
    connector = myDBC("ncatalog")
    connector.dbConnect()

    query = """
        SELECT DISTINCT `item`.`{3}`
        FROM `item_parent`, `item`, `site_group`
        WHERE `site_group`.`name`='{0}'
            AND `item`.`site_group_ref`=`site_group`.`id`
            AND `item`.`{3}` NOT IN (
                SELECT DISTINCT `item`.`{3}`
                FROM `item_parent`, `item`, `site_group`
                WHERE `site_group`.`name`='{0}'
                    AND `item`.`site_group_ref`=`site_group`.`id`
                    AND `item`.`{1}`='{2}'
            )
    """.format(group_name, active_param, active_param_value, excluded_param)

    r = connector.dbExecute(query)

    for row in r:
        ret.append(str(row[0]))

    connector.dbClose()

    return ret
