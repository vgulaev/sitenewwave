#!/web/trimetru/python/bin/python2.6
# -*- coding: utf-8 -*-
# This Python file uses the following encoding: utf-8
import sys, os
import cgi
import cgitb; cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))
from bs4 import BeautifulSoup
from grab import *

if ((sys.platform) == "win32"):
    print ("")
    #sys.stdout = open('temp.html', 'w')
else:
    print ("Content-Type: text/html; charset=utf-8")
    print ("")
    
print("<!DOCTYPE html>")

soup = BeautifulSoup(open("../sitemap.xml"), "xml")

g = Grab()
nodes = soup.find_all("loc")
nodessize = len(nodes)
print(nodessize)
counter = 0;
incorrectcounter = 0; 
for el in nodes:
    weblink = el.string
    counter = counter + 1
    print(str(counter) + " from " + str(nodessize))
    if (weblink.find("ref") > -1):
        g.go(weblink)
        bodystr = g.response.body
        if (bodystr.find("Извините")>-1):
            incorrectcounter = incorrectcounter + 1;
            print("Incorrect link: " + weblink + " count: " + str(incorrectcounter))
        
        
#g.go("http://www.trimet.ru/1cengine/site/index.php?ref=%D0%90%D1%80%D0%BC%D0%B0%D1%82%D1%83%D1%80%D0%B0%20%D0%B0400%2F%D0%B0500%D1%81%2012%20%D1%81%D1%823%D1%81%D0%BF%2F%D0%BF%D1%81%205%2C85")
#g.go("http://www.trimet.ru/1cengine/site/index.php?ref=%D0%90%D1%80%D0%BC%D0%B0%D1%82%D1%83%D1%80%D0%B0%20%D0%B0400%2F%D0%B0500%D1%81%2012%20%D1%81%D1%823%D1%81%D0%BF%2F%D0%BF%D1%81%205%2C85%BF%D1%81%205%2C85")

#bodystr = g.response.body;

#print(bodystr.find("Извините"))
#g.go("yandex.ru")

print("this py test sitemap")
print("this py test sitemap")
