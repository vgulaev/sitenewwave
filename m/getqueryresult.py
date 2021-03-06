﻿#!c:/Python27/python.exe
# -*- coding: utf-8 -*-
# This Python file uses the following encoding: utf-8
# --  #!/web/trimetru/python/bin/python2.6
from dbclasses1c import Base, ArticlesNames, nomenklatura
from queryes import getquerybyname, resultbyname
from sqlalchemy import MetaData, Column, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from wsfunction import JSONfield, JSONwrap
import cgi
import json
import sys
import os
import cgitb; cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))

#from secrets import str_conection_to_MySQL

print ("Content-Type: text/html; charset=utf-8")
print ("")

form = cgi.FieldStorage()

str_conection_to_MySQL = 'mysql+mysqldb://root:mysql@127.0.0.1/DB1C?charset=utf8'
#engine = create_engine('sqlite:///new.db')

engine = create_engine(str_conection_to_MySQL)

Session = sessionmaker(bind=engine)
Session.configure(bind=engine)
session = Session()

#form = {"queryname" : {"value":"get_words_by_filter"}}

if form.has_key("queryname"):
	queryname = form["queryname"].value
	#queryname = "get_vesvkilogramah"
	q = getquerybyname(session, form, queryname)
	q = q.all()
	result = "{" + JSONwrap("count") + ":"
	result = result + JSONwrap(str(len(q))) + ","
	if (len(q) < 30)and(0 < len(q)):
		result = result + JSONwrap("records") + ":["
		for el in q:
			result = result + "{" + resultbyname(el, queryname) + " },"
		
		result = result[:-1] + "],"
	result = result[:-1] + "}";
else:
	result = "{}";

print(result.lstrip().encode("utf-8"))