#!/web/tdymkru/python/bin/python
# This Python file uses the following encoding: utf-8
import sys,os
import cgi
import cgitb; cgitb.enable()
from htmlrootclass import htmlroot 

if ((sys.platform) == "win32"):
    print ("")
    sys.stdout = open('temp.html', 'w')
else:
    print ("Content-Type: text/html; charset=utf-8")
    print ("")

result_doc = htmlroot()
result_doc.initHTML()

print (result_doc.html_doc.toxml())