#!/usr/bin/python2.6
# -*- coding: utf-8 -*-


import cgi
import cgitb
cgitb.enable()

from bs4 import BeautifulSoup
soup = BeautifulSoup()

# print("Content-Type: text/html; charset=utf-8\n")

# import json
from secrets import *

# get = cgi.FieldStorage()
# if "term" in get:
#     term = get["term"].value
# else:
#     term = ""

def get_main_groups():
    ret = []
    connector = myDBC("ncatalog")
    connector.dbConnect()
    r = connector.dbExecute("""
            SELECT DISTINCT `site_group`.`name`, `site_group`.`id`
            FROM `site_group`
        """)

    # r = connector.dbExecute("""
    #         SELECT DISTINCT SUBSTRING_INDEX(`display_name`, ' ', 1)
    #         FROM `offers`
    #         WHERE `display_name` LIKE '%'
    #     """)

    for row in r:
        ret.append([str(row[0]), str(row[1])])

    connector.dbClose()

    return ret


def get_subgroups(group_hash):
    ret = {}
    connector = myDBC("ncatalog")
    connector.dbConnect()

    r = connector.dbExecute("""
            SELECT DISTINCT `item_parent`.`name`, `item_parent`.`id`
            FROM `item_parent`, `item`, `site_group`
            WHERE `site_group`.`id`='"""+group_hash+"""'
            AND `item`.`site_group_ref`=`site_group`.`id`
            AND `item_parent`.`id`=`item`.`item_parent_ref`
            ORDER BY `item_parent`.`name`
        """)

    for row in r:
        if "parents" in ret:
            ret["parents"].append([str(row[0]), str(row[1])])
        else:
            ret["parents"] = []
            ret["parents"].append([str(row[0]), str(row[1])])

    r = connector.dbExecute("""
        SELECT DISTINCT `item`.`thickness`
        FROM `item`, `site_group`
        WHERE `site_group`.`id`='"""+group_hash+"""'
        AND `item`.`site_group_ref`=`site_group`.`id`
        ORDER BY `item`.`thickness`
    """)

    for row in r:
        if not row[0] == 0.0:
            if "thickness" in ret:
                ret["thickness"].append(str(row[0]))
            else:
                ret["thickness"] = []
                ret["thickness"].append(str(row[0]))

    r = connector.dbExecute("""
        SELECT DISTINCT `item`.`diameter`
        FROM `item`, `site_group`
        WHERE `site_group`.`id`='"""+group_hash+"""'
        AND `item`.`site_group_ref`=`site_group`.`id`
        ORDER BY `item`.`diameter`
    """)

    for row in r:
        if not row[0] == 0.0:
            if "diameter" in ret:
                ret["diameter"].append(str(row[0]))
            else:
                ret["diameter"] = []
                ret["diameter"].append(str(row[0]))


    connector.dbClose()

    return ret



def get_ajax_subgroups(g_hash):
    subgroups = get_subgroups(g_hash)

    if subgroups.__len__() > 0:
        tag_div_sg = soup.new_tag("div")
        tag_div_sg["class"] = "subgroup_c"

        back_span = soup.new_tag("span")
        back_span["class"] = "menu_back_button"
        back_span.append(u" ⮪ назад")
        tag_div_sg.append(back_span)

        tag_div_parents = soup.new_tag("div")
        tag_div_parents["class"] = "parents_choice"

        tag_div_parents_header = soup.new_tag("span")
        tag_div_parents_header["class"] = "choice_header"
        tag_div_parents_header.append(u"Подгруппа")
        tag_div_parents.append(tag_div_parents_header)

        for parent in subgroups["parents"]:
            tag_choice_container = soup.new_tag("span")
            tag_choice_container["class"] = "choice_container"

            tag_checkbox = soup.new_tag("input")
            tag_checkbox["type"] = "checkbox"
            tag_checkbox["class"] = "sidebar_checkbox"
            tag_checkbox["name"] = u"pa_{0}".format(parent[0].decode("utf-8"))
            tag_checkbox["id"] = u"pa_{0}".format(parent[0].decode("utf-8"))

            tag_checkbox_label = soup.new_tag("label")
            tag_checkbox_label["for"] = u"pa_{0}".format(parent[0].decode("utf-8"))
            tag_checkbox_label.append(parent[0].decode("utf-8"))

            tag_choice_container.append(tag_checkbox)
            tag_choice_container.append(tag_checkbox_label)

            tag_div_parents.append(tag_choice_container)

        tag_div_sg.append(tag_div_parents)

        if "thickness" in subgroups:

            tag_div_thickness = soup.new_tag("div")
            tag_div_thickness["class"] = "thickness_choice"
            tag_div_thickness_header = soup.new_tag("span")
            tag_div_thickness_header["class"] = "choice_header"
            tag_div_thickness_header.append(u"Толщина")
            tag_div_thickness.append(tag_div_thickness_header)

            for thickness in subgroups["thickness"]:
                tag_choice_container = soup.new_tag("span")
                tag_choice_container["class"] = "choice_container"

                tag_checkbox = soup.new_tag("input")
                tag_checkbox["class"] = "sidebar_checkbox"
                tag_checkbox["type"] = "checkbox"
                tag_checkbox["name"] = "th_{0}".format(thickness.decode("utf-8"))
                tag_checkbox["id"] = "th_{0}".format(thickness.decode("utf-8"))

                tag_checkbox_label = soup.new_tag("label")
                tag_checkbox_label["for"] = "th_{0}".format(thickness.decode("utf-8"))
                tag_checkbox_label.append(thickness.decode("utf-8"))

                tag_choice_container.append(tag_checkbox)
                tag_choice_container.append(tag_checkbox_label)

                tag_div_thickness.append(tag_choice_container)

            tag_div_sg.append(tag_div_thickness)

        if "diameter" in subgroups:

            tag_div_diameter = soup.new_tag("div")
            tag_div_diameter["class"] = "diameter_choice"

            tag_div_diameter_header = soup.new_tag("span")
            tag_div_diameter_header["class"] = "choice_header"
            tag_div_diameter_header.append(u"Диаметр/Ширина")
            tag_div_diameter.append(tag_div_diameter_header)

            for diameter in subgroups["diameter"]:
                tag_choice_container = soup.new_tag("span")
                tag_choice_container["class"] = "choice_container"

                tag_checkbox = soup.new_tag("input")
                tag_checkbox["class"] = "sidebar_checkbox"
                tag_checkbox["type"] = "checkbox"
                tag_checkbox["name"] = "di_{0}".format(diameter.decode("utf-8"))
                tag_checkbox["id"] = "di_{0}".format(diameter.decode("utf-8"))

                tag_checkbox_label = soup.new_tag("label")
                tag_checkbox_label["for"] = "di_{0}".format(diameter.decode("utf-8"))
                tag_checkbox_label.append(diameter.decode("utf-8"))

                tag_choice_container.append(tag_checkbox)
                tag_choice_container.append(tag_checkbox_label)

                tag_div_diameter.append(tag_choice_container)

            tag_div_sg.append(tag_div_diameter)

        show_button = soup.new_tag("span")
        show_button["class"] = "sungroup_show_button"
        show_button.append(u"Выбрать")

        tag_div_sg.append(show_button)

        return tag_div_sg

    else:

        return ""


form = cgi.FieldStorage()
if "term" in form:
    print "Content-Type: text/html; charset=utf-8\n"
    print str(get_ajax_subgroups(form["term"].value.decode("utf-8")))
    # print form["term"].value
    # result_table = compose_table(form["term"].value.decode("utf-8"))

    # print result_table

if "hash" in form:

    print "Content-Type: text/html; charset=utf-8\n"
    print str(get_ajax_subgroups(form["hash"].value.decode("utf-8")))
