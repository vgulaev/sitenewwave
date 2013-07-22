#!/web/trimetru/python/bin/python2.6
# -*- coding: utf-8 -*-

import sys, os
import cgi
import cgitb; cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))
from bs4 import BeautifulSoup


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
        template = template_file.read()
        template_file.close()

        return template


    def compose_head_temlplate(self):
        if self.head_template == "":
            return BeautifulSoup("<html><head></head></html>")

        head = BeautifulSoup(self.head_template)

        #### loading python script ####
        py_nodes = head.find_all("pythonscript")

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

        #### loading python script ####
        py_nodes = header.find_all("pythonscript")

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

        return header.header

    def compose_footer_temlplate(self):
        if self.footer_template == "":
            return BeautifulSoup("<html><body></body></html>")

        footer = BeautifulSoup(self.footer_template)

        #### loading python script ####
        py_nodes = footer.find_all("pythonscript")

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

        return footer.footer

    def compose_content_temlplate(self):
        if self.content_template == "":
            return BeautifulSoup("<html><body></body></html>")

        content = BeautifulSoup(self.content_template)

        #### loading python script ####
        py_nodes = content.find_all("pythonscript")

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

        return content.div


    def show_page(self):
        page = BeautifulSoup("<html><head></head><body class=\"page-main\"></body></html>")

        self.head_template = self.load_template_from_file("templates/head.tpl.html")
        self.header_template = self.load_template_from_file("templates/header.tpl.html")
        self.footer_template = self.load_template_from_file("templates/footer.tpl.html")
        self.content_template = self.load_template_from_file("templates/content.tpl.html")

        self.js_list = [
            "//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js",
            "//ajax.googleapis.com/ajax/libs/jqueryui/1.10.0/jquery-ui.min.js",
            "/lib/frameworks/jqrequired/jquery.blockUI.js",
            "/lib/frameworks/jqrequired/jquery.cookie.js",
            "/1cengine/new_site/js/modern_uiJs.js",
            "/1cengine/new_site/js/modern_ui-goods_handler.js",
            "/lib/frameworks/raf_sha256.js"
        ]

        self.style_list = [
            "/mainpage_template.css",
            "/footer.css",
            "/1cengine/new_site/css/modern_style.css" 
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