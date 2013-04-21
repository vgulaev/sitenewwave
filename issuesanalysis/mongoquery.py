#!c:/Python27/python.exe
# -*- coding: utf-8 -*-
# This Python file uses the following encoding: utf-8
import cgi
import sys
import os
import cgitb; cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))

import json
from bson.son import SON
import pprint

from pymongo import *
from github import GitHub
from secrets import github_username, github_password

print ("Content-Type: text/html; charset=utf-8")
print ("")
    
print('<!DOCTYPE html><html lang="ru"><body><pre>')

client = MongoClient()
db = client['trimet_issues']
posts = db.issues

#issues_in_db = posts.find().sort("number", direction = DESCENDING)

issues_in_db = posts.aggregate( [
	{"$group" : {
	"_id": {
		"login" : "$assignee.login", 
		"date_of_created" : "$created_at"},
	#"date_of_created:": { "$substr" : SON(["$created_at", 0, 10])},
	#"date_of_created": "$created_at",
	"task_count": { "$sum" : 1}}
	}
#	{"$project" :
#		{
#		"assignee.login": 1}}
])

pp = pprint.PrettyPrinter(indent=4)
pp.pprint(issues_in_db)
#print(SON([("count", -1), ("_id", -1)]))
#print(json.dumps(issues_in_db[0], sort_keys=True, indent=4, separators=(',', ': ')))

#print(type(issues_in_db[0]))

print('</pre></body></html>')