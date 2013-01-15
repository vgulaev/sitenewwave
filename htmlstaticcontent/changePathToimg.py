# -*- coding: utf-8 -*-

import sys,os,re

_PATH = os.path.abspath(os.path.dirname(__file__))

filename = "028_products_krovl_vodostochnye_sistemy_/index.html"

html_file_name = os.path.join(_PATH, filename)
html_file = open(html_file_name,'r')
html_file_string = html_file.read()
html_file.close()

p6 = re.compile("/upload[\w\-\s_/\.]+jpg|/upload[\w\-\s_/\.]+png|/upload[\w\-\s_/\.]+gif|/upload[\w\-\s_/\.]+ico")

imgpaths = p6.findall(html_file_string)

for path in imgpaths:
    p4 = re.compile("[\w\-_\s\.]+jpg|[\w\-_\s\.]+png|[\w\-_\s\.]+gif|[\w\-_\s\.]+ico")
    imgname = p4.findall(path)

    for img in imgname:

        html_file_string = html_file_string.replace(path, "/htmlstaticcontent/unknown_images/"+img)

        print path, " --> ", img


html_file_name = os.path.join(_PATH, filename)
html_file = open(html_file_name,'w')

html_file.write(html_file_string)
html_file.close()