#!/web/tdymkru/python/bin/python2.6
# -*- coding: utf-8 -*-
# This Python file uses the following encoding: utf-8
import sys,os
import cgi
import cgitb; cgitb.enable()
from htmlrootclass import htmlroot
from xml.dom.minidom import DOMImplementation, getDOMImplementation
from xml.dom.minidom import parse, parseString
import xml.etree.ElementTree as ET
import html5lib

if ((sys.platform) == "win32"):
    print ("")
    sys.stdout = open('temp.html', 'w')
else:
    print ("Content-Type: text/html; charset=utf-8")
    print ("")

f = open("mainpage_template.html")
doc = html5lib.parse(f)
print(doc.toxml())
#domHeader = parse("mainpage_template.html")
# headReceiver = domHeader.getElementsByTagName('head')[0];
# bodyReceiver = domHeader.getElementsByTagName('body')[0];

# dom1 = parse("htmlstaticcontent/002aboutcompany/index.html")

# name = dom1.getElementsByTagName('link')
# for x in name:
    # x.setAttribute("href", "htmlstaticcontent/002aboutcompany/" + x.getAttribute("href"))

# name = dom1.getElementsByTagName('img')
# for x in name:
     # x.setAttribute("src", "htmlstaticcontent/002aboutcompany/" + x.getAttribute("src"))

# bodyForImport = dom1.getElementsByTagName('body')[0]

# for x in bodyForImport.childNodes:
    # bodyReceiver.appendChild(x)

# name = dom1.getElementsByTagName("link")
# for x in name:
    # headReceiver.appendChild(x)
    
#print domHeader.toxml("utf-8")

#tree = ET.parse('mainpage_template.html')
#print(ET.tostring(tree.getroot(), "utf-8"))