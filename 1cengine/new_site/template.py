#-*- coding:utf-8 -*-

import cgi, os, sys
from bs4 import BeautifulSoup

form = cgi.FieldStorage()

soup = BeautifulSoup()

seo_tag_exists = False

if form.has_key("catalog"):
    json_file_name = "templates/seotags.json"
    json_file = open(json_file_name,"r")
    json_string = json_file.read()
    json_file.close()

    import json
    seo_tags = json.loads(json_string)

    seo_tag_exists = seo_tags.has_key(form["catalog"].value.decode("utf-8"))

    # print seo_tags.has_key(form["catalog"].value.decode("utf-8"))

def set_title():
    title_tag = soup.new_tag("title")
    
    if form.has_key("ref"):
        title_string = form["ref"].value+" купить онлайн | Тримет ООО " 
    elif seo_tag_exists:
        title_string = seo_tags[form["catalog"].value.decode("utf-8")]["title"]
    else:
        title_string = "Купить Online"

    title_tag.append(title_string)
    return title_tag


def set_keywords():
    key_tag = soup.new_tag("meta")
    key_tag["name"] = "keywords"

    if form.has_key("ref"):
        key_tag["content"] = form["ref"].value.decode("utf-8") + u" купить, онлайн, тюмень"
    else:
        key_tag["content"] = u"металлопрокат, профнастил, металлосайдинг, купить, онлайн, тюмень, арматура, балка, швеллер, трубы, угол, штрипс, квадрат, круг, лист, проволока"

    return key_tag

def set_description():
    description_tag = soup.new_tag("meta")
    description_tag["name"] = "description"
    if seo_tag_exists:
        description_tag["content"] = seo_tags[form["catalog"].value.decode("utf-8")]["description"]
    else:
        description_tag["content"] = u"Покупка металлосайдинга, профнастила, металлопроката в Тюмени онлайн"

    return description_tag

def set_search_value():
    input_search_item = soup.new_tag("input")
    input_search_item["id"] = "itemName"
    input_search_item["placeholder"] = u"Введите здесь интересующий вас товар"

    if form.has_key("ref"):
        input_search_item["value"] = form["ref"].value.decode("utf-8")

    elif form.has_key("catalog"):
        input_search_item["value"] = form["catalog"].value.decode("utf-8")    
    else:
        input_search_item["value"] = ""

    return input_search_item

def set_search_results():
    lib_path = os.path.abspath('../py_scripts/')
    sys.path.append(lib_path)

    # print lib_path
    import imp
    get_items_bs = imp.load_source("get_items_bs", lib_path+"/get_items_bs"+".py")

    if form.has_key("ref"):
        # form["term"] = form["ref"].value.decode("utf-8")

        result_table = get_items_bs.ResultTable(form["ref"].value, "strict")
  
        return result_table.compose_table()
        # r = python_lib.__main__(python_method_name)

    elif form.has_key("catalog"):
        result_table = get_items_bs.ResultTable(form["catalog"].value, "catalog")
  
        return result_table.compose_table()


def set_show_all_result():
    a_tag = soup.new_tag("a")
    a_tag["id"] = "showAll"
    a_tag["href"] = u"Все результаты"
    a_tag["onClick"] = "return false"
    a_tag.string = u"Показать все результаты"
    if not form.has_key("catalog"):
        a_tag["style"] = "display:none"

    return a_tag

def set_tags_div():
    path_to_table = "templates/groups.tpl.html"
    tag_div = soup.new_tag("div")
    tag_div["id"] = "tags"

    tag_div.append(BeautifulSoup(open(path_to_table)).table)

    if form.has_key("catalog"):
        tag_div["style"] = "display:none"

    return tag_div

def show_seo_text():
    if seo_tag_exists and seo_tags[form["catalog"].value.decode("utf-8")].has_key("text"):
        return BeautifulSoup(seo_tags[form["catalog"].value.decode("utf-8")]["text"])