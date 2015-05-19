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

#print(issuesdict[0].number)

def getnewissues(start_id):
    client = MongoClient()
    db = client['trimet_issues']
    posts = db.issues

    issues_in_db = posts.find().sort("number", direction = DESCENDING)

    if db['issues'].count() > 0:
        print(issues_in_db[0]["number"])
        i_from = issues_in_db[0]["number"] + 1
    else:
        i_from = 1

    for i in range(i_from, start_id + 1):
        currentissue = gh.repos("vgulaev")("trimet_it").issues(i).get()
        posts.insert(currentissue)
        print(i)

getnewissues(issuesdict[0].number)

issuesdict = gh.repos("vgulaev")("trimet_it").issues.get(sort="updated", filter="all", state = "closed")
#issuesdict = gh.repos("vgulaev")("trimet_it").issues.get(sort="updated", filter="all", state = "open")

def updateissues(curissue):
    client = MongoClient()
    db = client['trimet_issues']
    posts = db.issues
    
    dbissues = posts.find({"number": curissue["number"]}) 
    #print dbissues[0]["updated_at"]
    #print curissue["number"], " ", curissue["updated_at"]
    if (dbissues.count() > 0):
        if (dbissues[0]["updated_at"] != curissue["updated_at"]):
            print "update ", curissue["number"]
            posts.update({"number": curissue["number"]}, curissue)

for i in range(0, len(issuesdict)):
    updateissues(issuesdict[i])
    #print issuesdict[i]["number"]

#for i in range(0, 1):    

#print issuesdict[30]["number"], " ",issuesdict[30]["updated_at"]
print(len(issuesdict))