#!c:/Python27/python.exe
# -*- coding: utf-8 -*-
# This Python file uses the following encoding: utf-8
# -- #!/web/trimetru/python/bin/python2.6
import sys, os
import cgi
import cgitb; cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))
from bs4 import BeautifulSoup
from urllist import trimeturls

print ("Content-Type: text/html; charset=utf-8")
print ("")

print("Hello!!!")

def mobile_detect():
    print("<br/>")
    print(((os.environ['HTTP_USER_AGENT'].find("Android") > -1) or (os.environ['HTTP_USER_AGENT'].find("Mobile") > -1)))
    print("<br/>")
    print(os.environ['HTTP_USER_AGENT'])

print(mobile_detect())

#cgi.print_environ()