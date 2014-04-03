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

    seo_tag_exists = form["catalog"].value.decode("utf-8") in seo_tags

    # print seo_tags.has_key(form["catalog"].value.decode("utf-8"))


def set_title():
    title_tag = soup.new_tag("title")

    if "ref" in form:
        title_string = form["ref"].value + " купить онлайн | Тримет ООО "
    elif seo_tag_exists:
        title_string = seo_tags[form["catalog"].value.decode("utf-8")]["title"]
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
            u"веллер",
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
            form["catalog"].value.decode("utf-8")]["description"]
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
        # input_search_item["value"] = u'Сало!'
    else:
        input_search_item["value"] = ""

    return input_search_item


def set_search_results():
    lib_path = os.path.abspath('../py_scripts/')
    sys.path.append(lib_path)

    # print lib_path
    import imp
    get_items_bs = imp.load_source(
        "get_items_bs", lib_path + "/get_items_bs" + ".py")

    if "ref" in form:
        # form["term"] = form["ref"].value.decode("utf-8")

        result_table = get_items_bs.ResultTable(form["ref"].value, "strict")

        return result_table.compose_table()
        # r = python_lib.__main__(python_method_name)

    elif "catalog" in form:
        catalog = urllib2.unquote(form["catalog"].value).decode("utf-8")
        result_table = get_items_bs.ResultTable(
            catalog, "catalog")

        return result_table.compose_table()


def set_show_all_result():
    a_tag = soup.new_tag("a")
    a_tag["id"] = "showAll"
    a_tag["href"] = u"Все результаты"
    a_tag["onClick"] = "return false"
    a_tag.string = u"Показать все результаты "
    if "catalog" not in form:
        a_tag["style"] = "display:none"

    span_count_tag = soup.new_tag("span")
    span_count_tag["class"] = "count_all_result"
    # span_count_tag.append("0")

    a_tag.append(span_count_tag)

    return a_tag


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
    current_span_tag["class"] = "current_page"
    current_span_tag.string = "1"

    span_tag.append(current_span_tag)

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
        seo_value = seo_tags[form["catalog"].value.decode("utf-8")]
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
        "get_item_group", lib_path + "/get_item_group" + ".py")

    if "catalog" in form:
        c_catalog = urllib2.unquote(form["catalog"].value).decode("utf-8")

    groups = get_item_group.get_main_groups()

    for group in groups:
        tag_li = soup.new_tag("li")
        tag_li["name"] = group.decode("utf-8")
        if c_catalog in group.decode("utf-8"):
            tag_li["class"] = "main_group active_group"
        else:
            tag_li["class"] = "main_group"
        tag_li.append(group.decode("utf-8"))

        tag_ul.append(tag_li)

    return tag_ul
