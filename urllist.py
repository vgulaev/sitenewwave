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
trimeturls.append(urltype("about", "htmlstaticcontent/0002aboutcompany/"))
trimeturls.append(urltype("metalwork", "htmlstaticcontent/0003metalwork/"))
trimeturls.append(urltype("about/history", "/htmlstaticcontent/010_about_history_/"))
trimeturls.append(urltype("services", "/htmlstaticcontent/003_services_/"))
trimeturls.append(urltype("products", "/htmlstaticcontent/004_products_/"))
trimeturls.append(urltype("suppliers", "/htmlstaticcontent/005_suppliers_/"))
trimeturls.append(urltype("contacts", "/htmlstaticcontent/006_contacts_/"))
trimeturls.append(urltype("contacts/feedback", "/htmlstaticcontent/008_contacts_feedback_/"))
trimeturls.append(urltype("about/awards", "/htmlstaticcontent/011_about_awards_/"))
trimeturls.append(urltype("about/leaderships", "/htmlstaticcontent/013_about_leaderships_/"))
