#!c:/Python27/python.exe
# -*- coding: utf-8 -*-
# This Python file uses the following encoding: utf-8
# --  #!/web/trimetru/python/bin/python2.6
import sys, os
import cgi
import cgitb; cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))

import json

print ("Content-Type: text/html; charset=utf-8")
print ("")

form = cgi.FieldStorage()

r = json.loads('{"eeabd8c1-9498-11e2-b2ec-e569e5e79087":"null","eeabd8c2-9498-11e2-b2ec-e569e5e79087":"null","eeabd8c3-9498-11e2-b2ec-e569e5e79087":"null"}')

f = ["dfds" , "dfdf"]

f.append("dffd")

print(len(f))
	
print("Hello")