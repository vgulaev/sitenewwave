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

#sys.setdefaultencoding('utf-8')
reload(sys)
sys.setdefaultencoding('utf-8')

print ("Content-Type: text/html; charset=utf-8")
print ("")
    
#print('<!DOCTYPE html><html lang="ru"><body><pre>')

client = MongoClient()
db = client['trimet_issues']
posts = db.issues

#issues_in_db = posts.find().sort("number", direction = DESCENDING)

issues_in_db = posts.aggregate([
	{"$group" : {
	"_id": {
		#"login" : "$assignee.login", 
		"date_of_created" : { "$substr" : ["$created_at", 0, 10]}},
	"task_count": { "$sum" : 1}}
	}
	,{"$sort": SON([("_id.date_of_created", 1)])}
])

pp = pprint.PrettyPrinter(indent=4)
#pp.pprint(issues_in_db)
#sys.stdout = codecs.getwriter("utf-8")(sys.stdout)

#print sys.stdout.encoding

#issues_in_db.encode('utf-8')
print(json.dumps(issues_in_db))

#print(issues_in_db)
#print('</pre></body></html>')