#!c:/Python27/python.exe
# -*- coding: utf-8 -*-
# This Python file uses the following encoding: utf-8
import cgi
import sys
import os
#import cgitb; cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))

import json
from bson.son import SON
import pprint

from pymongo import *
from mongoparameters import *
from github import GitHub
from secrets import github_username, github_password

print ("Content-Type: text/html; charset=utf-8")
print ("")
    
#print('<!DOCTYPE html><html lang="ru"><body><pre>')

client = MongoClient()
db = client['trimet_issues']
posts = db.issues

#issues_in_db = posts.find().sort("number", direction = DESCENDING)
queryname = "taskopened"
q = [];

form = cgi.FieldStorage()
if form.has_key("queryname"):
	queryname = form["queryname"].value

if (queryname == "taskcreated")or(queryname == "taskclosed"):
    issues_in_db = posts.aggregate(getparameterforquery(queryname))
    q = json.dumps(issues_in_db)
elif (queryname == "taskopened"):
    issues_in_db1 = posts.aggregate(getparameterforquery("taskcreated"))
    issues_in_db2 = posts.aggregate(getparameterforquery("taskclosed"))
    t = issues_in_db1["result"] + issues_in_db2["result"]
    days = set(map(lambda x: x["_id"]["date_of_created"], t))
    d1 = list(days)
    
    del issues_in_db1["result"][:]
    
    def get_count(x):
        t = posts.find({"created_at": {"$lte" : x},
                        "$or": [{"closed_at": {"$gt": x}}, {"closed_at": {"$type" : 10}}]
                        }).count()
        return t
    
    map(lambda x: issues_in_db1["result"].append({u"_id": {u"date_of_created": x}, u"task_count": get_count(x)}), d1)
    
    q = json.dumps(issues_in_db1)

print(q)

#print('</pre></body></html>')