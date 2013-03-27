﻿#!c:/Python27/python.exe
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

from sqlalchemy import create_engine, and_
from sqlalchemy.orm import sessionmaker, aliased

from lxml import etree
from dbclasses1c import Base, ArticlesNames, nomenklatura, PartOfSpeech, Dictionary
from wsfunction import JSONfield, JSONwrap
#from secrets import str_conection_to_MySQL

def getquerybyname(session, form, queryname):
	if (queryname == "get_words_by_filter"):
		curentfield = form["curentfield"].value
		#curentfield = "bd1b34a7-9537-11e2-b2ec-e569e5e79087"
		#q = session.query(nomenklatura).subquery()
		q = session.query(ArticlesNames, Dictionary).join(Dictionary, ArticlesNames.Word == Dictionary.ssylka)
		q = q.filter(ArticlesNames.PartOfSpeech == curentfield)
		q = q.group_by(Dictionary.naimenovanie, Dictionary.ssylka)
		# aliased_1 = aliased(ArticlesNames)
		# aliased_2 = aliased(ArticlesNames)
		# q = q.outerjoin(aliased_1, and_(nomenklatura.ssylka == aliased_1.Article, aliased_1.Article == "ddd"))
		# q = q.outerjoin(aliased_2, and_(nomenklatura.ssylka == aliased_2.Article, aliased_2.Article == "ddd"))
		# q = q.filter(aliased_1.Article == "")
		#q = q.join(ArticlesNames, nomenklatura.ssylka == ArticlesNames.Article)
		# q = session.query(q).subquery()
		# q = session.query(q)
		# q = q.join(nomenklatura, ArticlesNames.Article == nomenklatura.ssylka)
		# q = q.group_by(ArticlesNames.Article)
		
	return q

def resultbyname(el, queryname):
	if (queryname == "get_words_by_filter"):
		#r = JSONfield("naimenovanie", "tetete")
		r = JSONfield("naimenovanie", el.Dictionary.naimenovanie) + ", " + JSONfield("ssylka", el.Dictionary.ssylka)
		
	return r