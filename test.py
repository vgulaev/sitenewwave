#!/web/tdymkru/python/bin/python
# This Python file uses the following encoding: utf-8
import sys,os
import cgi
import cgitb; cgitb.enable()
#sys.path.insert(0, os.path.expanduser('~/site/python'))
from xml.dom.minidom import DOMImplementation, getDOMImplementation

if ((sys.platform) == "win32"):
    print ("")
    sys.stdout = open('temp.html', 'w')
else:
    print ("Content-Type: text/html; charset=utf-8")
    print ("")

impl = getDOMImplementation()

html_doc = impl.createDocument(None, "html", None)

childHead = html_doc.createElement("head")

chil = html_doc.createElement("meta")
chil.setAttribute("content", "text/html; charset=utf-8")
chil.setAttribute("http-equiv", "content-type")
childHead.appendChild(chil)

chil = html_doc.createElement("link")
chil.setAttribute("rel", "stylesheet")
chil.setAttribute("href", "mycss.css")
childHead.appendChild(chil)

html_doc.documentElement.appendChild(childHead)

child = html_doc.createElement("body") 
html_doc.documentElement.appendChild(child)

childh1 = html_doc.createElement("div")
childh1.setAttribute("id", "divmain")
childh1.setAttribute("class", "for_debug_div_blockmodel") 

child = html_doc.createTextNode("Привет!!!")
childh1.appendChild(child)

html_doc.documentElement.appendChild(childh1)

print (html_doc.toxml())