#!/web/trimetru/python/bin/python2.6
# -*- coding: utf-8 -*-

import sys
import os
import cgi
import cgitb
cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))
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
    connector = myDBC("catalog")
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
    param_flags = get_param_flags(group_hash)
    ret = {}
    connector = myDBC("catalog")
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


    if param_flags["th"][0]:
        r = connector.dbExecute("""
            SELECT DISTINCT `item`.`thickness`
            FROM `item`, `site_group`
            WHERE `site_group`.`id`='"""+group_hash+"""'
            AND `item`.`site_group_ref`=`site_group`.`id`
            ORDER BY `item`.`thickness`
        """)

        for row in r:
            if not (row[0] == "" or row[0] == "0"):
                if "thickness" in ret:
                    ret["thickness"].append(str(row[0]))
                else:
                    ret["thickness"] = []
                    ret["thickness"].append(str(row[0]))

    if param_flags["di"][0]:
        r = connector.dbExecute("""
            SELECT DISTINCT `item`.`diameter`
            FROM `item`, `site_group`
            WHERE `site_group`.`id`='"""+group_hash+"""'
            AND `item`.`site_group_ref`=`site_group`.`id`
            ORDER BY `item`.`diameter`
        """)

        for row in r:
            if not (row[0] == "" or row[0] == "0"):
                if "diameter" in ret:
                    ret["diameter"].append(str(row[0]))
                else:
                    ret["diameter"] = []
                    ret["diameter"].append(str(row[0]))


    if param_flags["he"][0]:

        r = connector.dbExecute("""
            SELECT DISTINCT `item`.`height`
            FROM `item`, `site_group`
            WHERE `site_group`.`id`='"""+group_hash+"""'
            AND `item`.`site_group_ref`=`site_group`.`id`
            ORDER BY `item`.`height`
        """)

        for row in r:
            if not (row[0] == "" or row[0] == "0"):
                if "height" in ret:
                    ret["height"].append(str(row[0]))
                else:
                    ret["height"] = []
                    ret["height"].append(str(row[0]))



    connector.dbClose()

    ret["names"] = [
        param_flags["th"][1], param_flags["di"][1], param_flags["he"][1]
    ]

    return ret

def get_param_flags(group_hash):

    ret = {}
    connector = myDBC("catalog")
    connector.dbConnect()

    r = connector.dbExecute("""
            SELECT `site_group`.`show_height`, `site_group`.`height_name`,
                `site_group`.`show_thickness`, `site_group`.`thickness_name`,
                `site_group`.`show_diameter`, `site_group`.`diameter_name`
            FROM `site_group`
            WHERE `site_group`.`id`='"""+group_hash+"""'
        """)

    for row in r:
        ret["he"] = [row[0], row[1]]
        ret["th"] = [row[2], row[3]]
        ret["di"] = [row[4], row[5]]

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

        if subgroups["parents"].__len__() > 1:
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
            tag_div_thickness_header.append(subgroups["names"][0])
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
            tag_div_diameter_header.append(subgroups["names"][1])
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

        if "height" in subgroups:

            tag_div_height = soup.new_tag("div")
            tag_div_height["class"] = "height_choice"

            tag_div_height_header = soup.new_tag("span")
            tag_div_height_header["class"] = "choice_header"
            tag_div_height_header.append(subgroups["names"][2])
            tag_div_height.append(tag_div_height_header)

            for height in subgroups["height"]:
                tag_choice_container = soup.new_tag("span")
                tag_choice_container["class"] = "choice_container"

                tag_checkbox = soup.new_tag("input")
                tag_checkbox["class"] = "sidebar_checkbox"
                tag_checkbox["type"] = "checkbox"
                tag_checkbox["name"] = u"he_{0}".format(height.decode("utf-8"))
                tag_checkbox["id"] = u"he_{0}".format(height.decode("utf-8"))

                tag_checkbox_label = soup.new_tag("label")
                tag_checkbox_label["for"] = u"he_{0}".format(height.decode("utf-8"))
                tag_checkbox_label.append(height.decode("utf-8"))

                tag_choice_container.append(tag_checkbox)
                tag_choice_container.append(tag_checkbox_label)

                tag_div_height.append(tag_choice_container)

            tag_div_sg.append(tag_div_height)

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
