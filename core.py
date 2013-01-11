#!/usr/bin/python2.6
# -*- coding: utf-8 -*-
# This Python file uses the following encoding: utf-8
import sys, os
import cgi
import cgitb; cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))
from bs4 import BeautifulSoup
from urllist import trimeturls

if ((sys.platform) == "win32"):
    print ("")
    sys.stdout = open('temp.html', 'w')
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
    soupForImport = BeautifulSoup(open(path + "index.html"))
    # print soupForImport
    soupFooter = BeautifulSoup(open("locate/ru/templates/mainfooter_template.html"))
    # change path for img tag to correct path
    nodes = soupForImport.find_all("img")
    for currentelement in nodes:
        currentelement["src"] = "/"+path + currentelement["src"]
    # change path for script tag to correct path
    nodes = soupForImport.find_all("script")
    for currentelement in nodes:
        if "src" in currentelement:
            currentelement["src"] = "/"+path + currentelement["src"]
            soup.html.head.append(currentelement)
    nodes = soupForImport.find_all("link")
    for currentelement in nodes:
       currentelement["href"] = "/"+path + currentelement["href"] 
       soup.html.head.append(currentelement)
    
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
    pathtohtml = "htmlstaticcontent/0001mainpage/"

makecontent(pathtohtml)
# if form.has_key("name"):
