#!/web/tdymkru/python/bin/python2.6
# -*- coding: utf-8 -*-
# This Python file uses the following encoding: utf-8
class urltype:
    urlname = ""
    path = ""
    def __init__(self, urlname, strfolder):
        self.urlname = urlname
        self.path = strfolder
    
trimeturls = list()

trimeturls.append(urltype("mainpage", "htmlstaticcontent/0001mainpage/"))
trimeturls.append(urltype("about", "htmlstaticcontent/002aboutcompany/"))
