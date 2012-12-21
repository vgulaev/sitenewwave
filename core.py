#!/web/tdymkru/python/bin/python2.6
# -*- coding: utf-8 -*-
# This Python file uses the following encoding: utf-8
import sys,os
import cgi
import cgitb; cgitb.enable()
from xml.dom.minidom import DOMImplementation, getDOMImplementation
from xml.dom.minidom import parse, parseString
from xml.etree.ElementTree import tostring
from bs4 import BeautifulSoup

if ((sys.platform) == "win32"):
    print ("")
    sys.stdout = open('temp.html', 'w')
else:
    print ("Content-Type: text/html; charset=utf-8")
    print ("")
    
print("<!DOCTYPE html>")

soup = BeautifulSoup(open("mainpage_template.html"))

soupForImport = BeautifulSoup(open("htmlstaticcontent/0001mainpage/index.html"))
nodes = soupForImport.find(id="main")
soup.html.body.append(nodes)

print(soup.prettify())
