#!/usr/bin/python
# -*- coding: utf-8 -*-
# This Python file uses the following encoding: utf-8
import sys,os
import cgi
import cgitb; cgitb.enable()
from htmlrootclass import htmlroot
from xml.dom.minidom import DOMImplementation, getDOMImplementation
from xml.dom.minidom import parse, parseString 

if ((sys.platform) == "win32"):
    print ("")
    sys.stdout = open('temp.html', 'w')
else:
    print ("Content-Type: text/html; charset=utf-8")
    print ("")

#result_doc = htmlroot()
#result_doc.initHTML()

#print (result_doc.html_doc.toxml())

#f = open("htmlstaticcontent/0001mainpage/index.html", "r")
dom1 = parse("htmlstaticcontent\\0001mainpage\\index.xml")

name = dom1.getElementsByTagName('link')
for x in name:
    x.setAttribute("href", "htmlstaticcontent/0001mainpage/" + x.getAttribute("href"))

name = dom1.getElementsByTagName('img')
for x in name:
    x.setAttribute("src", "htmlstaticcontent/0001mainpage/" + x.getAttribute("src"))

print(dom1.toxml())
#print (f.read())
#form = cgi.FieldStorage()

#print "<p>name:", form["name"].value
