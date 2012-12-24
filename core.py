#!/web/tdymkru/python/bin/python2.6
# -*- coding: utf-8 -*-
# This Python file uses the following encoding: utf-8
import sys,os
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
    soup = BeautifulSoup(open("mainpage_template.html"))
    soupForImport = BeautifulSoup(open(path + "index.html"))
    nodes = soupForImport.find_all("img")
    for currentelement in nodes:
        currentelement["src"] = path + currentelement["src"]
    nodes = soupForImport.html.body.contents
    for currentelement in nodes:
        if str(type(currentelement)) == "<class 'bs4.element.Tag'>":
            soup.html.body.append(currentelement)
            nodes = soupForImport.find_all("link")
    for currentelement in nodes:
        currentelement["href"] = path + currentelement["href"] 
        soup.html.head.append(currentelement)
    print(soup.prettify("utf-8"))

form = cgi.FieldStorage()

if form.has_key("name"):
    pathtohtml = findpath(form["name"].value)
else:
    pathtohtml = "htmlstaticcontent/0001mainpage/"
    #pathtohtml = "htmlstaticcontent/002aboutcompany/"

makecontent(pathtohtml)
#if form.has_key("name"):