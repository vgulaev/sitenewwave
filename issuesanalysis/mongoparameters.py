#!c:/Python27/python.exe
# -*- coding: utf-8 -*-
# This Python file uses the following encoding: utf-8
from bson.son import SON

def getparameterforquery(queryname):
	if (queryname == "taskcreated"):
		prm = [
			{"$group" : {
			"_id": {
				"date_of_created" : { "$substr" : ["$created_at", 0, 10]}},
			"task_count": { "$sum" : 1}}
			}
			,{"$sort": SON([("_id.date_of_created", 1)])}
			]
	elif (queryname == "taskclosed"):
		prm = [
			{ "$match" : { "state" : "closed"}},
			{"$group" : {
			"_id": {
				"date_of_created" : { "$substr" : ["$closed_at", 0, 10]}},
			"task_count": { "$sum" : 1}}
			}
			,{"$sort": SON([("_id.date_of_created", 1)])}
			]	
	
	return prm;

#print(getparameterforquery("taskcreated"))