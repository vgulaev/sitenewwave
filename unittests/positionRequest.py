#!/web/trimetru/python/bin/python2.6
#-*- coding:utf-8 -*-


import cgi
import cgitb; cgitb.enable()

import httplib

print ("Content-Type: text/html; charset=utf-8")
print ("")

def printText(txt):
    lines = txt.split('\n')
    for line in lines:
        print line.strip()

httpServ = httplib.HTTPConnection("http://xmlsearch.yandex.ru/xmlsearch?user=Elf607&key=03.13977823:e95167db7719613bbe9c579e723e3c66&lr=55", 80)
httpServ.connect()

quote = """
<?xml version='1.0' encoding='utf-8'?>
<request>
    <query>Профнастил</query>

    <groupings>
        <groupby attr="d" mode="deep" groups-on-page="100"  docs-in-group="1" />
    </groupings>

    <page>$page</page>
</request>
"""

httpServ.request('POST', '/cgi_form.cgi', quote)

response = httpServ.getresponse()
if response.status == httplib.OK:
    print "Output from CGI request"
    printText (response.read())

httpServ.close()