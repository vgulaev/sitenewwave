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
#from secrets import str_conection_to_MySQL

def getquerybyname(session, form, queryname):
	if (queryname == "get_words_by_filter"):
		q = session.query(ArticlesNames, nomenklatura)
		q = q.join(nomenklatura, ArticlesNames.Article == nomenklatura.ssylka)
		q = q.group_by(ArticlesNames.Article)
		
	return q

def resultbyname(el, queryname):
	if (queryname == "get_words_by_filter"):
		r = JSONfield("Article", el.nomenklatura.naimenovanie) + ", " + JSONfield("ssylka", el.ArticlesNames.Article)
		
	return r