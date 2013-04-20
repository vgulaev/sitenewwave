#!c:/Python27/python.exe
# -*- coding: utf-8 -*-
# This Python file uses the following encoding: utf-8
import cgi
import sys
import os
#import cgitb; cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))

import json
from pymongo import *
from github import GitHub
from secrets import github_username, github_password

print ("Content-Type: text/html; charset=utf-8")
print ("")
    
print("hello!!!")

gh = GitHub(username=github_username, password=github_password)

issuesdict = gh.repos("vgulaev")("trimet_it").issues.get(sort="created", filter="all")
print(issuesdict[0].number)

client = MongoClient()
db = client['trimet_issues']
posts = db.issues

issues_in_db = posts.find().sort("number", direction = DESCENDING)
print(issues_in_db[0]["number"])

for i in range(issues_in_db[0]["number"] + 1, issuesdict[0].number+1):
	currentissue = gh.repos("vgulaev")("trimet_it").issues(i).get()
	posts.insert(currentissue)
	print(i)