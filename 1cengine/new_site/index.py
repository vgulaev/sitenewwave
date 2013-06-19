#!/web/trimetru/python/bin/python2.6
# -*- coding: utf-8 -*-

import sys, os
import cgi
import cgitb; cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))
from bs4 import BeautifulSoup


print "Content-Type: text/html; charset=utf-8\n"

# print "hello"

class Index_Page():
    def __init__(self):
        self.head_template = ""
        self.content_template = ""
        self.footer_template = ""

        self.js_list = []
        self.style_list = []

    def load_template_from_file(self, path):
        template_file = open(path, "r")
        template = template_file.read()
        template_file.close()

        return template


    def compose_head_temlplate(self):
        if self.head_template == "":
            return BeautifulSoup("<html><head></head></html>")

        head = BeautifulSoup(self.head_template)

        #### loading python script ####
        py_nodes = head.html.head.find_all("pythonscript")

        for current_element in py_nodes:
            python_lib_name = current_element.contents[0].split("{")[1].split("}")[0]
#            python_method_name = current_element.contents[0].split("|")[1].split("}")[0]
            
            import template
            r = eval(python_lib_name)
#            python_lib = imp.load_source(python_lib_name, path+python_lib_name+".py")
#            
#            r = python_lib.__main__(python_method_name)
#
            if r != None:
                # python_replace = BeautifulSoup(r)
                current_element.replaceWith(r)
            else:
               current_element.extract()

        #### load js tags ####
        for js in self.js_list:
            js_tag = head.new_tag("script")
            js_tag["type"] = "text/javascript"
            js_tag["src"] = js

            head.head.append(js_tag)


        #### load css tags ####
        for style in self.style_list:
            style_tag = head.new_tag("link")
            style_tag["rel"] = "stylesheet"
            style_tag["type"] = "text/css"
            style_tag["src"] = style

            head.head.append(style_tag)


        return head
            

page = Index_Page()
page.head_template = page.load_template_from_file("templates/head.tpl.html")
page.js_list = [
    "/lib/frameworks/jqrequired/jquery.blockUI.js",
    "/lib/frameworks/jqrequired/jquery.cookie.js",
    "/1cengine/site/js/modern_uiJs.js",
    "/1cengine/site/js/modern_ui_goods_handler.js",
    "/lib/frameworks/raf_sha256.js"
]

page.style_list = ["/1cengine/site/modern_style.css"]

head = page.compose_head_temlplate()

print(head.prettify("utf-8"))