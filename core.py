#!/web/trimetru/python/bin/python2.6
# -*- coding: utf-8 -*-
# This Python file uses the following encoding: utf-8
# -- #!c:/Python27/python.exe
import sys, os
import cgi
import cgitb; cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))
from bs4 import BeautifulSoup
from urllist import trimeturls
import Cookie

debugmode = False
if ((sys.platform) == "win32"):
    #print ("")
    #sys.stdout = open('temp.html', 'w')
    print ("Content-Type: text/html; charset=utf-8")
    print ("")
else:
    print ("Content-Type: text/html; charset=utf-8")
    print ("")
    
print("<!DOCTYPE html>")

def findpath(pagename):
    result = "htmlstaticcontent/0001mainpage/"
    for element in trimeturls:
        if element.urlname == pagename:
            result = element.path  
    return(result)

def makecontent(path):
    # print path
    soup = BeautifulSoup(open("locate/ru/templates/mainpage_template.html"))
    if (debugmode == True):
        soup.html.noscript.extract()
        nodes = soup.html.body("script")
        for currentelement in nodes:
            currentelement.extract()
    soupForImport = BeautifulSoup(open(path + "index.html"))
    # print soupForImport
    soupFooter = BeautifulSoup(open("locate/ru/templates/mainfooter_template.html"))
    # change path for img tag to correct path
    nodes = soupForImport.find_all("img")
    for currentelement in nodes:
        if not currentelement["src"][0] == "/":
            currentelement["src"] = "/"+path + currentelement["src"]
    # change path for script tag to correct path
    nodes = soupForImport.find_all("script")
    for currentelement in nodes:
        if currentelement.has_key("src"):
            if not currentelement["src"][0] == "/": 
                currentelement["src"] = "/"+path + currentelement["src"]
                soup.html.head.append(currentelement)
            #scripttag.string = scripttag.string + "loadfile(\"" + "/"+path + currentelement["src"]+"\", \"script\");"
    nodes = soupForImport.find_all("link")
    for currentelement in nodes:
       currentelement["href"] = "/"+path + currentelement["href"] 
       soup.html.head.append(currentelement)
    #for Eclipse debugging
    if ((sys.platform) == "win32"):
         nodes = soup.find_all("script")
         for currentelement in nodes:
             if currentelement.has_key("src"):
                 currentelement["src"] = "/sitenewwave" + currentelement["src"]
    
    # set title
    title = soupForImport.find("title")
    soup.html.head.title.replaceWith(title)
    
    nodes = soupForImport.html.body.contents
    for currentelement in nodes:
        if str(type(currentelement)) == "<class 'bs4.element.Tag'>":
            soup.html.body.append(currentelement)
            #print("Hello")
    # add footer
    node = soupFooter.find("footer", {"id": "footer"})
    soup.html.body.append(node)
    print(soup.prettify("utf-8"))

form = cgi.FieldStorage()

if form.has_key("page"):
    pathtohtml = findpath(form["page"].value)
else:
    if ((sys.platform) == "win32"): 
        #string for debug
        pathtohtml = "htmlstaticcontent/005_suppliers_/"
    else:
        #at server always use main page 
        pathtohtml = "htmlstaticcontent/0001mainpage/"

makecontent(pathtohtml)
#print("Hello!!!");
