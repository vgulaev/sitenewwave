#!/web/tdymkru/python/bin/python
import sys,os
import cgi
import cgitb; cgitb.enable()
#sys.path.insert(0, os.path.expanduser('~/site/python'))
from xml.dom.minidom import DOMImplementation, getDOMImplementation

print ("Content-Type: text/html")
print ("")
#print ("Hello!!!")
#print (sys.version)
#x = htmltag()
#print (x.tagName)

impl = getDOMImplementation()

html_doc = impl.createDocument(None, "html", None)

child = html_doc.createElement("head")
html_doc.documentElement.appendChild(child)

child = html_doc.createElement("body") 
html_doc.documentElement.appendChild(child)

childh1 = html_doc.createElement("h1")
childh1.setAttribute("id", "idh1") 

child = html_doc.createTextNode("Hello word!!!")
childh1.appendChild(child)

html_doc.documentElement.appendChild(childh1)

#html_doc.appendChild(child)
print (html_doc.toxml())

#print ("6ef8395fecf207165f1a82178ae1b984".__len__())
#f02901f3e39e2e6131c4bf00db7aa726