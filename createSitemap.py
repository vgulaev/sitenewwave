#!/usr/bin/python2.6
# -*- coding: utf-8 -*-


import sys,os
import cgi
import cgitb; cgitb.enable()
import urllib

print ("Content-Type: text/html; charset=utf-8\n")

lib_path = os.path.abspath('1cengine/site/')
sys.path.append(lib_path)

from secrets import *

def getItems():
    connector = myDBC("goods")
    connector.dbConnect()
    row = connector.dbExecute("""
            SELECT `offers`.`display_name`, `offers`.`char_name` FROM `offers`
        """)
    
    connector.dbClose()

    return row

def writeItemsToFile(row):

    addRow = ""
    for x in row:

        addRow = addRow + "<url>\n\
                  <loc>http://trimet.ru/1cengine/site/?ref="+urllib.quote(x[0]+" "+x[1])+"</loc>\n\
                  <priority>0.7</priority>\n\
                  <changefreq>daily</changefreq>\n\
               </url>\n\
               "
        # print addRow
        
    addRow = addRow + '</urlset>'

    _PATH = os.path.abspath(os.path.dirname(__file__))

    sitemapBaseFilepath = os.path.join(_PATH, 'sitemapBase.xml')
    sitemapFilepath = os.path.join(_PATH, 'sitemap.xml')

    sitemapBase = open(sitemapBaseFilepath,'r')
    sitemapBase_string = sitemapBase.read()
    sitemapBase.close()

    sitemapFile = open(sitemapFilepath,'w+')
    sitemap = sitemapBase_string + addRow
    sitemapFile.write(sitemap)
    sitemapFile.close()

    print "sitemap generated"

row = getItems()
writeItemsToFile(row)