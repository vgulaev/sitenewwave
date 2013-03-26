#!c:/Python27/python.exe
# -*- coding: utf-8 -*-
# This Python file uses the following encoding: utf-8
# --  #!/web/trimetru/python/bin/python2.6
import sys, os
import cgi
import cgitb; cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))
from bs4 import BeautifulSoup

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import MetaData, Column, Integer, String

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from lxml import etree
from dbclasses1c import Base, ArticlesNames, nomenklatura
from wsfunction import JSONfield, JSONwrap

from queryes import getquerybyname
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

q = getquerybyname(session, form, "get_words_by_filter")

q = q.all()

result = "{" + JSONwrap("count") + ":"
result = result + JSONwrap(str(len(q))) + ","

if (len(q) < 200):
	result = result + JSONwrap("records") + ":["
	for el in q:
		result = result + "{" + JSONfield("Article", el.nomenklatura.naimenovanie) + ", " + JSONfield("ssylka", el.ArticlesNames.Article) + " },"
	
	result = result[:-1] + "],"

result = result[:-1] + "}";
#print(form["ssylka"])
print(result.lstrip().encode("utf-8"))