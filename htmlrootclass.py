#!/usr/bin/python2.6
# This Python file uses the following encoding: utf-8
from xml.dom.minidom import DOMImplementation, getDOMImplementation

class htmlroot:
    def initHTML(self):
        impl = getDOMImplementation()
        #root element
        self.html_doc = impl.createDocument(None, "html", None)
        #start head element
        htmlHead = self.html_doc.createElement("head")
        chil = self.html_doc.createElement("meta")
        chil.setAttribute("content", "text/html; charset=utf-8")
        chil.setAttribute("http-equiv", "content-type")
        htmlHead.appendChild(chil)
        chil = self.html_doc.createElement("link")
        chil.setAttribute("rel", "stylesheet")
        chil.setAttribute("href", "mycss.css")
        htmlHead.appendChild(chil)
        self.html_doc.documentElement.appendChild(htmlHead)
        #end head element
        htmlBody = self.html_doc.createElement("body") 
        #self.html_doc.documentElement.appendChild(child)
        divMain = self.html_doc.createElement("div")
        divMain.setAttribute("id", "divmain")
        divHead = self.html_doc.createElement("div")
        divHead.setAttribute("id", "divhead")
        divHead.setAttribute("class", "for_debug_div_blockmodel")
        #chil = self.html_doc.createElement("img")
        #chil = 
        #divMain.appendChild(chil)
        divMain.appendChild(divHead)
        htmlBody.appendChild(divMain)
        self.html_doc.documentElement.appendChild(htmlBody)
        
