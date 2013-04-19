#!c:/Python27/python.exe
# -*- coding: utf-8 -*-
# This Python file uses the following encoding: utf-8
import cgi
import sys
import os
import cgitb; cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))

import json
from pymongo import MongoClient

from github import GitHub

print ("Content-Type: text/html; charset=utf-8")
print ("")
    
print("hello!!!")

gh = GitHub()

issuesdict = gh.repos("vgulaev")("trimet_it").issues.get(sort="created", filter="all")

client = MongoClient()

db = client['trimet_issues']

posts = db.issues

posts.insert(issuesdict)

print(issuesdict[0].number)