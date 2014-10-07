#!/web/trimetru/python/bin/python2.6
#-*- coding:utf-8 -*-

import cgi
import os
import sys
from bs4 import BeautifulSoup
import urllib2

form = cgi.FieldStorage()

soup = BeautifulSoup()

seo_tag_exists = False

if "catalog" in form:
    json_file_name = "templates/seotags.json"
    json_file = open(json_file_name, "r")
    json_string = json_file.read()
    json_file.close()

    import json
    seo_tags = json.loads(json_string)

    seo_tag_exists = form["catalog"].value.decode("utf-8").replace(" ", "_") in seo_tags

    # print seo_tags.has_key(form["catalog"].value.decode("utf-8"))


def set_title():
    title_tag = soup.new_tag("title")

    if "ref" in form:
        title_string = form["ref"].value + " купить онлайн | Тримет ООО "
    elif seo_tag_exists:
        title_string = seo_tags[form["catalog"].value.decode("utf-8").replace(" ", "_")]["title"]
    else:
        title_string = "Купить Online"

    title_tag.append(title_string)
    return title_tag


def set_keywords():
    key_tag = soup.new_tag("meta")
    key_tag["name"] = "keywords"

    if "ref" in form:
        key_tag["content"] = form["ref"].value.decode(
            "utf-8") + u" купить, онлайн, тюмень"
    else:
        key_words = [
            u"металлопрокат",
            u"профнастил",
            u"металлосайдинг",
            u"купить",
            u"онлайн",
            u"тюмень",
            u"арматура",
            u"балка",
            u"швеллер",
            u"трубы",
            u"угол",
            u"штрипс",
            u"квадрат",
            u"круг",
            u"лист",
            u"проволока"
        ]
        key_tag[
            "content"] = ", ".join(key_words)

    return key_tag


def set_description():
    description_tag = soup.new_tag("meta")
    description_tag["name"] = "description"
    if seo_tag_exists:
        description_tag["content"] = seo_tags[
            form["catalog"].value.decode("utf-8").replace(" ", "_")]["description"]
    else:
        description_tag[
            "content"] = u"Покупка металлосайдинга, профнастила, металлопроката в Тюмени онлайн"

    return description_tag


def set_search_value():
    input_search_item = soup.new_tag("input")
    input_search_item["id"] = "itemName"
    input_search_item["placeholder"] = u"Введите здесь интересующий вас товар"

    if "ref" in form:
        input_search_item["value"] = form["ref"].value.decode("utf-8")

    elif "catalog" in form:
        catalog = urllib2.unquote(form["catalog"].value).decode("utf-8")
        input_search_item["value"] = catalog + " "
    else:
        input_search_item["value"] = ""

    return input_search_item


def set_search_results():
    lib_path = os.path.abspath('../py_scripts/')
    sys.path.append(lib_path)

    # print lib_path
    import imp
    get_items_bs = imp.load_source(
        "get_ncatalog_items", lib_path + "/get_ncatalog_items" + ".py")

    if "ref" in form:
        # form["term"] = form["ref"].value.decode("utf-8")

        result_table = get_items_bs.compose_table(form["ref"].value)

        return result_table
        # r = python_lib.__main__(python_method_name)

    elif "catalog" in form:
        catalog = urllib2.unquote(form["catalog"].value).decode("utf-8")
        result_table = get_items_bs.compose_table(catalog)

        return result_table


def set_show_nexr_prev():
    span_tag = soup.new_tag("div")
    span_tag["id"] = "show_next_prev"
    # if "catalog" not in form:
    #     span_tag["style"] = "display:none"

    prev_a_tag = soup.new_tag("span")
    prev_a_tag["class"] = "prev_result"
    # prev_a_tag["href"] = u"Предыдущие 20"
    # prev_a_tag["onClick"] = "return false"
    prev_a_tag.string = u"Предыдущие 20"

    span_tag.append(prev_a_tag)

    current_span_tag = soup.new_tag("span")
    # current_span_tag["style"] = "display:none;"
    current_span_tag["class"] = "current_page"
    current_span_tag.string = "1"

    span_tag.append(current_span_tag)

    a_tag = soup.new_tag("span")
    a_tag["id"] = "showAll"
    a_tag.string = u"Еще результаты: "
    # if "catalog" not in form:
    #     a_tag["style"] = "display:none"

    span_count_tag = soup.new_tag("span")
    span_count_tag["class"] = "count_all_result"
    # span_count_tag.append("0")

    a_tag.append(span_count_tag)

    span_tag.append(a_tag)

    next_a_tag = soup.new_tag("span")
    next_a_tag["class"] = "next_result"
    # next_a_tag["href"] = u"Следующие 20"
    # next_a_tag["onClick"] = "return false"
    next_a_tag.string = u"Следующие 20"

    span_tag.append(next_a_tag)

    return span_tag


def set_tags_div():
    path_to_table = "templates/groups.tpl.html"
    tag_div = soup.new_tag("div")
    tag_div["id"] = "tags"

    tag_div.append(BeautifulSoup(open(path_to_table)).table)

    if "catalog" in form:
        tag_div["style"] = "display:none"

    if "ref" in form:
        tag_div["style"] = "display:none"

    return tag_div


def show_seo_text():
    if seo_tag_exists is True:
        seo_value = seo_tags[form["catalog"].value.decode("utf-8").replace(" ", "_")]
        if "text" in seo_value:
            return BeautifulSoup(seo_value["text"])


def set_groups():
    tag_ul = soup.new_tag("ul")
    tag_ul["id"] = "groups_list"

    lib_path = os.path.abspath('../py_scripts/')
    sys.path.append(lib_path)

    # print lib_path
    import imp
    get_item_group = imp.load_source(
        "get_item_group", lib_path + "/get_ncatalog_item_group" + ".py")

    c_catalog = None
    if "catalog" in form:
        c_catalog = urllib2.unquote(form["catalog"].value).decode("utf-8")

    groups = get_item_group.get_main_groups()

    for group in groups:
        tag_li = soup.new_tag("li")
        tag_li["name"] = group[0].decode("utf-8")
        tag_li["inid"] = group[1].decode("utf-8")
        tag_li.append(group[0].decode("utf-8"))

        if c_catalog is not None and c_catalog in group[0].decode("utf-8"):
            tag_li["class"] = "main_group active_group"

            subgroups = get_item_group.get_subgroups(group[1].decode("utf-8"))

            if subgroups.__len__() > 0:
                tag_div_sg = soup.new_tag("div")
                tag_div_sg["class"] = "subgroup_c"

                tag_div_parents = soup.new_tag("div")
                tag_div_parents["class"] = "parents_choice"

                tag_div_parents_header = soup.new_tag("span")
                tag_div_parents_header["class"] = "choice_header"
                tag_div_parents_header.append(u"Марка стали")
                tag_div_parents.append(tag_div_parents_header)

                for parent in subgroups["parents"]:
                    tag_choice_container = soup.new_tag("span")
                    tag_choice_container["class"] = "choice_container"

                    tag_checkbox = soup.new_tag("input")
                    tag_checkbox["type"] = "checkbox"
                    tag_checkbox["id"] = parent[0].decode("utf-8")

                    tag_checkbox_label = soup.new_tag("label")
                    tag_checkbox_label["for"] = parent[0].decode("utf-8")
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
                    tag_div_thickness_header.append(u"Толщина стали")
                    tag_div_thickness.append(tag_div_thickness_header)

                    for thickness in subgroups["thickness"]:
                        tag_choice_container = soup.new_tag("span")
                        tag_choice_container["class"] = "choice_container"

                        tag_checkbox = soup.new_tag("input")
                        tag_checkbox["type"] = "checkbox"
                        tag_checkbox["id"] = thickness.decode("utf-8")

                        tag_checkbox_label = soup.new_tag("label")
                        tag_checkbox_label["for"] = thickness.decode("utf-8")
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
                    tag_div_diameter_header.append(u"Внешний диаметр")
                    tag_div_diameter.append(tag_div_diameter_header)

                    for diameter in subgroups["diameter"]:
                        tag_choice_container = soup.new_tag("span")
                        tag_choice_container["class"] = "choice_container"

                        tag_checkbox = soup.new_tag("input")
                        tag_checkbox["type"] = "checkbox"
                        tag_checkbox["id"] = diameter.decode("utf-8")

                        tag_checkbox_label = soup.new_tag("label")
                        tag_checkbox_label["for"] = diameter.decode("utf-8")
                        tag_checkbox_label.append(diameter.decode("utf-8"))

                        tag_choice_container.append(tag_checkbox)
                        tag_choice_container.append(tag_checkbox_label)

                        tag_div_diameter.append(tag_choice_container)

                    tag_div_sg.append(tag_div_diameter)

                # for sgroup in subgroups:


                #     if sgroup[0].decode("utf-8") != group[0].decode("utf-8"):
                #         tag_li_sg = soup.new_tag("li")
                #         tag_li_sg["class"] = "subgroup"
                #         tag_li_sg["name"] = sgroup[0].decode("utf-8")
                #         tag_li_sg["inid"] = sgroup[1].decode("utf-8")
                #         tag_li_sg.append(sgroup[0].decode("utf-8"))

                

                tag_li.append(tag_div_sg)

        else:
            tag_li["class"] = "main_group"

        tag_ul.append(tag_li)

    return tag_ul
