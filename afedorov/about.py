#!/usr/bin/python2.7
# -*- coding: utf-8 -*-


import sys,os
import cgi
import cgitb; cgitb.enable()

print ("Content-Type: text/html; charset=utf-8\n")

get = cgi.FieldStorage()
if "tpl" in get:
	get_template = "."+get["tpl"].value
else:
	get_template = ""
# print get_template

template = str(get_template).replace("/", ".")
template = "http..trimet.ru"+template+".html"

_PATH = os.path.abspath(os.path.dirname(__file__))

h_file = os.path.join(_PATH, 'mainheader_template.tpl')
header = open(h_file,'r')
header_string = header.read()
header.close()

a_file = os.path.join(_PATH, template)
about = open(a_file,'r')
about_string = about.read()
about.close()

f_file = os.path.join(_PATH, 'mainfooter_template.html')
footer = open(f_file,'r')
footer_string = footer.read()
footer.close()

print header_string
print about_string
print footer_string