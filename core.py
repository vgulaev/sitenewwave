#!/web/trimetru/python/bin/python2.6
# -*- coding: utf-8 -*-
# This Python file uses the following encoding: utf-8
# -- #!c:/Python27/python.exe
import sys
import os
import cgi
import cgitb
cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))
from bs4 import BeautifulSoup
from urllist import trimeturls
import Cookie
# from htmlmin.minify import html_minify
import re

debugmode = False
# core_in_request = re.compile("/core\.py$")

if "dev" in os.environ["SERVER_NAME"]:
    debugmode = True

if (debugmode is False):
    if os.environ['REQUEST_URI'] == "/core.py":
        print "Status:301\nLocation: https://trimet.ru"
    elif "?page" in os.environ['REQUEST_URI']:
        new_location = os.environ['REQUEST_URI'].split('?page=')[1]
        print "Status:301\nLocation: https://trimet.ru/" + new_location
    # elif os.environ['SERVER_PORT'] == '80':
    #     print "Status:301\nLocation: https://trimet.ru/"


def findpath(pagename):
    result = "404"
    for element in trimeturls:
        if element.urlname == pagename:
            result = element.path
        elif "*" in element.urlname:
            if element.urlname.replace("*", "") in pagename:
                result = element.path
    return(result)


def insertcontent(path):
    try:
        soupForInsert = BeautifulSoup(open(path))
        return soupForInsert
    except:
        return BeautifulSoup("")


def makecontent(path):
    # print path
    soup = BeautifulSoup(open("locate/ru/templates/mainpage_template.html"))
    if (debugmode is True):
        soup.html.noscript.extract()
        nodes = soup.html.body("script")
        for currentelement in nodes:
            currentelement.extract()
    soupForImport = BeautifulSoup(open(path + "index.html"))
    # print soupForImport
    soupFooter = BeautifulSoup(
        open("locate/ru/templates/mainfooter_template.html"))
    # change path for img tag to correct path
    nodes = soupForImport.find_all("img")
    for currentelement in nodes:
        if not currentelement["src"][0] == "/":
            currentelement["src"] = "/" + path + currentelement["src"]
    # change path for script tag to correct path
    nodes = soupForImport.find_all("script")
    for currentelement in nodes:
        if currentelement.has_key("src"):
            if not currentelement["src"][0] == "/":
                currentelement["src"] = "/" + path + currentelement["src"]
            soup.html.head.append(currentelement)

    nodes = soupForImport.find_all("link")
    for currentelement in nodes:
        currentelement["href"] = "/" + path + currentelement["href"]
        soup.html.head.append(currentelement)
    # for Eclipse debugging
    if ((sys.platform) == "win32"):
        nodes = soup.find_all("script")
        for currentelement in nodes:
            if "src" in currentelement:
                currentelement["src"] = "/sitenewwave" + currentelement["src"]

    #change links to a pictures
    nodes = soupForImport.find_all("a")
    for currentelement in nodes:
        if currentelement.has_key("href"):
            if ".png" in currentelement["href"]:
                currentelement["href"] = "/" + path + currentelement["href"]

    # set title
    title = soupForImport.find("title")
    soup.html.head.title.replaceWith(title)

    # set meta tags
    meta = soupForImport.find("meta", {"name": "description"})
    if meta is not None:
        meta_for_replace = soup.find("meta", {"name": "description"})
        meta_for_replace.replaceWith(meta)

    # loading python script
    nodes = soupForImport.html.find_all("pythonscript")
    # print nodes.__len__()
    for currentelement in nodes:
        python_lib_name = currentelement.contents[
            0].split("|")[0].split("{")[1]
        python_method_name = currentelement.contents[
            0].split("|")[1].split("}")[0]

        import imp
        python_lib = imp.load_source(
            python_lib_name, path + python_lib_name + ".py")

        r = python_lib.__main__(python_method_name)

        if r is not None:
            python_replace = BeautifulSoup(r)
            redirect = python_replace.find("redirectme")
            if redirect is not None:
                print "Status:307\nLocation: \
                    https://trimet.ru" + str(redirect.string).strip()

            currentelement.replaceWith(python_replace.div)
        else:
            currentelement.extract()

    # loading template content

    nodes = soupForImport.html.find_all("templatetag")

    for currentelement in nodes:
        template_content = insertcontent("locate/ru/templates/"+currentelement.contents[0])

        currentelement.replaceWith(template_content)

    nodes = soupForImport.html.body.contents
    for currentelement in nodes:
        if str(type(currentelement)) == "<class 'bs4.element.Tag'>":
            soup.html.body.append(currentelement)
            # print("Hello")
    # add footer
    node = soupFooter.find("footer", {"id": "footer"})
    soup.html.body.append(node)

    # print(unicode(soup))

    print_headers()

    print(soup.prettify("utf-8"))
    # print(html_minify(soup.prettify("utf-8")))


def print_headers():
    print("Content-Type: text/html; charset=utf-8")
    print("")

    print("<!DOCTYPE html>")


if os.environ.get('REQUEST_METHOD', '') == "POST":
    # print os.environ.get('REQUEST_METHOD','')
    raw_post = sys.stdin.read()
    # print raw_post

    os.environ["POST_DATA"] = raw_post

form = cgi.FieldStorage()
# print os.environ.get('REQUEST_METHOD','')

if "page" in form:
    pathtohtml = findpath(form["page"].value)
    if pathtohtml == "404":
        # print "Content-Type: text/html; charset=utf-8\n"
        print "Status:307\nLocation: https://trimet.ru/404.py\n"
else:
    if ((sys.platform) == "win32"):
        # string for debug
        pathtohtml = "htmlstaticcontent/005_suppliers_/"
    else:
        # at server always use main page
        pathtohtml = "htmlstaticcontent/0001mainpage/"

# Редирект должен осуществляться до вывода чего либо на страницу


# подозреваю, что это условие боле не важно, раз
#   столько времени висит в комментариях
#
# if ((sys.platform) == "win32"):
# print ("")
# sys.stdout = open('temp.html', 'w')
#     print ("Content-Type: text/html; charset=utf-8")
#     print ("")
# else:
#     print ("Content-Type: text/html; charset=utf-8")
#     print ("")

# print("<!DOCTYPE html>")

makecontent(pathtohtml)
