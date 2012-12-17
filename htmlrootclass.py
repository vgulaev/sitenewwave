#!/web/tdymkru/python/bin/python
# This Python file uses the following encoding: utf-8
from xml.dom.minidom import DOMImplementation, getDOMImplementation

class htmlroot:
    def initHTML(self):
        impl = getDOMImplementation()
        self.html_doc = impl.createDocument(None, "html", None)
        childHead = self.html_doc.createElement("head")
        chil = self.html_doc.createElement("meta")
        chil.setAttribute("content", "text/html; charset=utf-8")
        chil.setAttribute("http-equiv", "content-type")
        childHead.appendChild(chil)
        chil = self.html_doc.createElement("link")
        chil.setAttribute("rel", "stylesheet")
        chil.setAttribute("href", "mycss.css")
        childHead.appendChild(chil)
        self.html_doc.documentElement.appendChild(childHead)
        child = self.html_doc.createElement("body") 
        self.html_doc.documentElement.appendChild(child)
        childh1 = self.html_doc.createElement("div")
        childh1.setAttribute("id", "divmain")
        childh1.setAttribute("class", "for_debug_div_blockmodel")
        child = self.html_doc.createTextNode("Привет!!!")
        childh1.appendChild(child)
        self.html_doc.documentElement.appendChild(childh1)
