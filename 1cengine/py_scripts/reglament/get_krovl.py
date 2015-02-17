#!/web/trimetru/python/bin/python2.6
# -*- coding:utf-8 -*-

import sys
import os

import cgitb
cgitb.enable()

sys.path.insert(0, os.path.expanduser('~/site/python'))
reload(sys)
sys.setdefaultencoding('utf-8')

print ("Content-Type: text/html; charset=utf-8\n")

def get_krovl():

    print "trying get pdf file<br />"

    file_krovl_server = "http://195.239.221.58:30080/download/krovl_price.pdf"
    file_krovl_site = "/web/trimetru/site/www/download/files/krovl_price.pdf"
    # file_csv_site = "/home/saur/web/sitenewwave/import/price.csv"

    import requests

    r = requests.get(file_krovl_server)
    with open(file_krovl_site, "wb") as krovl:
        krovl.write(r.content)

    print "Krovl successfully loaded"

get_krovl()
