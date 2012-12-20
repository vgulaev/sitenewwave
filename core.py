#!/web/tdymkru/python/bin/python2.6
# -*- coding: utf-8 -*-
# This Python file uses the following encoding: utf-8
import sys,os
import cgi
import cgitb; cgitb.enable()
from xml.dom.minidom import DOMImplementation, getDOMImplementation
from xml.dom.minidom import parse, parseString

if ((sys.platform) == "win32"):
    print ("")
    #sys.stdout = open('temp.html', 'w')
else:
    print ("Content-Type: text/html; charset=utf-8")
    print ("")

domHeader = parse("mainpage_template.html")

nodes = domHeader.getElementsByTagName('div')
for element in nodes:
    if element.hasAttribute("id"):
         element.setIdAttribute("id")
         
elem = domHeader.getElementById("main")

print(domHeader.toxml("utf-8"))