#!/web/trimetru/python/bin/python2.6
# -*- coding: utf-8 -*-

import sys
import os
import cgi
import cgitb
cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))
from bs4 import BeautifulSoup


import imp
import template

lib_path = os.path.abspath('../py_scripts/')

python_lib = imp.load_source(
    "detect_mobile", lib_path + "/detect_mobile" + ".py")

if python_lib.detect() is True:
    form = cgi.FieldStorage()
    if "linkUID" in form:
        # print 1
        print "Status:307\nLocation: \
            http://trimet.ru/1cengine/pda_site/qrorder.php?linkUID=" \
            + form["linkUID"].value


print "Content-Type: text/html; charset=utf-8\n"
print "<!DOCTYPE html>"


# print "hello"

class Index_Page():

    def __init__(self):
        self.head_template = ""
        self.header_template = ""
        self.content_template = ""
        self.footer_template = ""

        self.js_list = []
        self.style_list = []

    def load_template_from_file(self, path):
        template_file = open(path, "r")
        current_template = template_file.read()
        template_file.close()

        # print template
        return current_template


    def compose_head_temlplate(self):
        if self.head_template == "":
            return BeautifulSoup("<html><head></head></html>").head

        head = BeautifulSoup(self.head_template)

        # loading python script ####
        py_nodes = head.find_all("pythonscript")

        for current_element in py_nodes:
            python_lib_name = current_element.contents[
                0].split("{")[1].split("}")[0]


            r = eval(python_lib_name)

            if r is not None:

                # python_replace = BeautifulSoup(r)
                current_element.replaceWith(r)
            else:
                current_element.extract()

        # load js tags ####
        for js in self.js_list:
            js_tag = head.new_tag("script")
            js_tag["type"] = "text/javascript"
            js_tag["src"] = js

            head.head.append(js_tag)

        # load css tags ####
        for style in self.style_list:
            style_tag = head.new_tag("link")
            style_tag["media"] = "all"
            style_tag["rel"] = "stylesheet"
            style_tag["type"] = "text/css"
            style_tag["href"] = style

            head.head.append(style_tag)

        return head.head

    def compose_header_temlplate(self):
        if self.header_template == "":
            return BeautifulSoup("<html><body></body></html>")

        header = BeautifulSoup(self.header_template)

        # loading python script ####
        py_nodes = header.find_all("pythonscript")

        for current_element in py_nodes:
            python_lib_name = current_element.contents[
                0].split("{")[1].split("}")[0]

            r = eval(python_lib_name)

            if r is not None:


                # python_replace = BeautifulSoup(r)
                current_element.replaceWith(r)
            else:
                current_element.extract()

        return header.header

    def compose_footer_temlplate(self):
        if self.footer_template == "":
            return BeautifulSoup("<html><body></body></html>")

        footer = BeautifulSoup(self.footer_template)

        # loading python script ####
        py_nodes = footer.find_all("pythonscript")

        for current_element in py_nodes:
            python_lib_name = current_element.contents[
                0].split("{")[1].split("}")[0]


            r = eval(python_lib_name)

            if r is not None:

                # python_replace = BeautifulSoup(r)
                current_element.replaceWith(r)
            else:
                current_element.extract()

        return footer.footer

    def compose_content_temlplate(self):
        if self.content_template == "":
            return BeautifulSoup("<html><body></body></html>")

        content = BeautifulSoup(self.content_template)

        # loading python script ####
        py_nodes = content.find_all("pythonscript")

        for current_element in py_nodes:
            python_lib_name = current_element.contents[
                0].split("{")[1].split("}")[0]


            r = eval(python_lib_name)

            if r is not None:

                # python_replace = BeautifulSoup(r)
                current_element.replaceWith(r)
            else:
                current_element.extract()

        return content.div

    def show_page(self):
        page = BeautifulSoup(
            "<html><head></head><body class=\"page-main\"></body></html>")

        self.head_template = self.load_template_from_file(
            "templates/head.tpl.html")
        self.header_template = self.load_template_from_file(
            "templates/header.tpl.html")
        self.footer_template = self.load_template_from_file(
            "templates/footer.tpl.html")
        self.content_template = self.load_template_from_file(
            "templates/content.tpl.html")

        self.js_list = [
            "/lib/frameworks/jquery/2.1.1/jquery.min.js",
            "/lib/frameworks/jqueryui/1.11.0/jquery-ui.min.js",
            "/lib/frameworks/jqrequired/tooltipster-master/js/jquery.tooltipster.min.js",
            "/lib/frameworks/jqrequired/jquery.blockUI.js",
            "/lib/frameworks/jqrequired/jquery.cookie.js",
            "/1cengine/site/js/global.js",
            "/1cengine/site/js/moving.js",
            # "/1cengine/site/js/modern_uiJs.js.js",
            # "/1cengine/site/js/modern_ui_goods_handler.js",
            "/1cengine/site/js/basket_class.js",
            "/1cengine/site/js/item_class.js",
            "/1cengine/site/js/rezka_class.js",
            "/1cengine/site/js/ordering.js",
            "/lib/frameworks/sha256.js"
        ]

        self.style_list = [
            "/mainpage_template.css",
            "/footer.css",
            "/lib/frameworks/jqrequired/tooltipster-master/css/tooltipster.css",
            "/1cengine/site/css/modern_style.css"
            # "/1cengine/site/css/kladr.css"
        ]

        head = self.compose_head_temlplate()
        header = self.compose_header_temlplate()
        content = self.compose_content_temlplate()
        footer = self.compose_footer_temlplate()

        page.head.replaceWith(head)
        page.body.append(header)
        page.body.append(content)
        page.body.append(footer)

        print str(page)
        # print page.prettify("utf-8", formatter="minimal")


page = Index_Page()
page.show_page()
