#!/web/trimetru/python/bin/python2.6
# -*- coding: utf-8 -*-
# This Python file uses the following encoding: utf-8
import sys, os
import cgi
import cgitb; cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))
from bs4 import BeautifulSoup
from grab import *
import urllib

if ((sys.platform) == "win32"):
    print ("")
    sys.stdout = open('temp.html', 'w')
else:
    print ("Content-Type: text/html; charset=utf-8")
    print ("")
    
print("""<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<script src="/lib/frameworks/www.kryogenix.org/sorttable.js"></script>
</head>
<body>
<table class="sortable">
<thead>
<th class="">№</th>
<th class="">Link</th>
<th class="">Is correct</th>
</thead>
<tbody>""")

soup = BeautifulSoup(open("../sitemap.xml"), "xml")

g = Grab()
nodes = soup.find_all("loc")
#nodes =  soup.find_all("loc2222")
nodessize = len(nodes)
#print(nodessize)
counter = 0;
incorrectcounter = 0; 
for el in nodes:
    weblink = el.string
    counter = counter + 1
    if (weblink.find("ref") > -1):
        #g.go(weblink)
        #bodystr = g.response.body
        f = urllib.urlopen(weblink)
        bodystr = f.read() 
        print("<tr><td>" + str(counter) + "</td>")
        print("<td>"+weblink+"</td>")
        #bodystr = "Извините"
        if (bodystr.find("Извините")>-1):
            incorrectcounter = incorrectcounter + 1;
            print("<td>No " + str(incorrectcounter) + "</td>")
        else:
            print("<td>Yes</td>")

#g.go("http://www.trimet.ru/1cengine/site/index.php?ref=%D0%90%D1%80%D0%BC%D0%B0%D1%82%D1%83%D1%80%D0%B0%20%D0%B0400%2F%D0%B0500%D1%81%2012%20%D1%81%D1%823%D1%81%D0%BF%2F%D0%BF%D1%81%205%2C85")
#g.go("http://www.trimet.ru/1cengine/site/index.php?ref=%D0%90%D1%80%D0%BC%D0%B0%D1%82%D1%83%D1%80%D0%B0%20%D0%B0400%2F%D0%B0500%D1%81%2012%20%D1%81%D1%823%D1%81%D0%BF%2F%D0%BF%D1%81%205%2C85%BF%D1%81%205%2C85")

print(f.read())
#bodystr = g.response.body;

#print(bodystr.find("Извините"))
#g.go("yandex.ru")

#print("this py test sitemap")
print("""</tbody>
</body>
</html>
""")