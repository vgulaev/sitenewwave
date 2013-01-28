#!c:/Python27/python.exe
# -*- coding: utf-8 -*-
# This Python file uses the following encoding: utf-8
# -- #!/web/trimetru/python/bin/python2.6
import sys, os
import cgi
import cgitb; cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))
from bs4 import BeautifulSoup

debugmode = True
if ((sys.platform) == "win32"):
    # print ("")
    # sys.stdout = open('temp.html', 'w')
    print ("Content-Type: text/html; charset=utf-8")
    print ("")
else:
    print ("Content-Type: text/html; charset=utf-8")
    print ("")
    
print("<!DOCTYPE html>")

def makecontent(path=None):
    # print path
    soup = BeautifulSoup(open("locate/ru/templates/mainpage_template.html"))
    if (debugmode == True):
        soup.html.noscript.extract()
        nodes = soup.html.body("script")
        for currentelement in nodes:
            currentelement.extract()
    soupForImport = BeautifulSoup("""<html><div id="main" style="width: 972px;margin: 0 auto;"><table><thead>
<th>№</th>
<th>Link</th>
<th>Changefreq</th>
</thead>
<tbody>
</tbody>
</table></div></html>""")
    soupSiteMap = BeautifulSoup(open("sitemap.xml"), "xml")
    nodes = soupSiteMap.find_all("url")
    counter = 0;
    tbody = soupForImport.html.table.tbody
    for el in nodes:
        counter = counter + 1
        tag_tr = soupForImport.new_tag("tr")
        tag_td = soupForImport.new_tag("td")
        tag_td.append(str(counter))
        tag_tr.append(tag_td)
        tag_td = soupForImport.new_tag("td")
        tag_a =  soupForImport.new_tag("a", href = el.loc.string)
        tag_a.append(str(counter))
        tag_td.append(tag_a)
        tag_tr.append(tag_td)
        tag_td = soupForImport.new_tag("td")
        tag_changefreq = el.find("changefreq")
        changefreq = "None"
        if tag_changefreq != None:
            changefreq = el.changefreq.string
        tag_td.append(changefreq)
        tag_tr.append(tag_td)
        tbody.append(tag_tr)       
    
    # table = soupForImport.new_tag("table")
    
    soup.html.body.append(soupForImport.html.div)
    # soupForImport.append()
    soupFooter = BeautifulSoup(open("locate/ru/templates/mainfooter_template.html"))
    node = soupFooter.find("footer", {"id": "footer"})
    soup.html.body.append(node)
    #print(soupForImport.prettify("utf-8"))
    print(soup.prettify("utf-8"))

makecontent()
# print("Hello!!!");
