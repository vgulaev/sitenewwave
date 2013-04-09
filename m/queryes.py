#!c:/Python27/python.exe
# -*- coding: utf-8 -*-
# This Python file uses the following encoding: utf-8
# --  #!/web/trimetru/python/bin/python2.6
from dbclasses1c import Base, ArticlesNames, nomenklatura, PartOfSpeech, Dictionary, NamingRules, NamingRulesshemanazvaniya, harakteristikinomenklatury
from sqlalchemy import MetaData, Column, Integer, String, and_, or_, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, aliased
from wsfunction import JSONfield, JSONwrap
import cgi
import json
import sys
import os
import cgitb; cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))

#from sqlalchemy.sql.functions import 

#from secrets import str_conection_to_MySQL

def getquerybyname(session, form, queryname):
	if (queryname == "get_words_by_filter"):
		addfilters = False
		curentfield = form["curentfield"].value
		#curentfield = "bd1b34a7-9537-11e2-b2ec-e569e5e79087"
		q = session.query(ArticlesNames)
		if form.has_key("filters"):
			filters = json.loads(form["filters"].value)
			conditions = []
			#print("have")
			for el in filters:
				#print((filters[el] <> "null"))
				if ((filters[el] <> "null")and(el <> curentfield)):
					addfilters = True
					conditions.append(and_(ArticlesNames.PartOfSpeech == el, ArticlesNames.Word == filters[el]))
			
			if (addfilters):
				q = q.filter(or_(*conditions))
				q = q.having(func.count(ArticlesNames.Order) == len(conditions))
				
		q = q.group_by(ArticlesNames.Article)
		
		subq = q.subquery()
		#print(len(q.all()))
		adalias = aliased(ArticlesNames, subq)
		
		q = session.query(ArticlesNames, Dictionary).join(adalias, adalias.Article == ArticlesNames.Article).join(Dictionary, ArticlesNames.Word == Dictionary.ssylka)
		q = q.filter(ArticlesNames.PartOfSpeech == curentfield)
		q = q.group_by(Dictionary.naimenovanie, Dictionary.ssylka, Dictionary.Order)
		if form.has_key("NamingRules"):
			if (form["NamingRules"].value <> "null"):
				q = q.join(nomenklatura, ArticlesNames.Article == nomenklatura.ssylka).filter(nomenklatura.praviloformirovaniyanazvaniya == form["NamingRules"].value)

		q = q.order_by(Dictionary.Order)
		# aliased_1 = aliased(ArticlesNames)
		# aliased_2 = aliased(ArticlesNames)
		# q = q.outerjoin(aliased_1, and_(nomenklatura.ssylka == aliased_1.Article, aliased_1.Article == "ddd"))
		# q = q.outerjoin(aliased_2, and_(nomenklatura.ssylka == aliased_2.Article, aliased_2.Article == "ddd"))
		# q = q.filter(aliased_1.Article == "")
		#q = q.join(ArticlesNames, nomenklatura.ssylka == ArticlesNames.Article)
		# q = q.join(nomenklatura, ArticlesNames.Article == nomenklatura.ssylka)
	elif (queryname == "get_nomenklatura"):
		addfilters = False
		q = session.query(ArticlesNames, nomenklatura)
		q = q.join(nomenklatura, ArticlesNames.Article == nomenklatura.ssylka)
		if form.has_key("filters"):
			filters = json.loads(form["filters"].value)
			conditions = []
			for el in filters:
				#print(filters[el])
				if (filters[el] <> "null"):
					addfilters = True
					conditions.append(and_(ArticlesNames.PartOfSpeech == el, ArticlesNames.Word == filters[el]))
			if (addfilters):
				q = q.filter(or_(*conditions))
				#q = q.filter(ArticlesNames.PartOfSpeech == el)
				#print(q)
			#print(el)
			#print(form["filters"].value)
		q = q.group_by(ArticlesNames.Article)
		
		if (addfilters):
			q = q.having(func.count(ArticlesNames.Order) == len(conditions))

		if form.has_key("NamingRules"):
			if (form["NamingRules"].value <> "null"):
				q = q.filter(nomenklatura.praviloformirovaniyanazvaniya == form["NamingRules"].value)
		q = q.order_by(nomenklatura.naimenovanie)
	elif (queryname == "get_filter_selectors"):
		q = session.query(NamingRulesshemanazvaniya, PartOfSpeech)
		q = q.filter(NamingRulesshemanazvaniya.ssylka == form["ssylka"].value)
		q = q.filter(NamingRulesshemanazvaniya.DefaultValue == "00000000-0000-0000-0000-000000000000")
		q = q.outerjoin(PartOfSpeech, NamingRulesshemanazvaniya.chastrechi == PartOfSpeech.ssylka)
		q = q.order_by(NamingRulesshemanazvaniya.nomerstroki)
	elif (queryname == "get_vesvkilogramah"):
		#print("Hey!!!")
		vladelets = form["vladelets"].value;
		#vladelets = "76b96b74-d29e-11df-a323-00155dc20a16"
		q = session.query(harakteristikinomenklatury)
		q = q.filter(harakteristikinomenklatury.vladelets == vladelets)
		q = q.order_by(harakteristikinomenklatury.vesvkilogramah.desc())

	#print(queryname)
	return q

def resultbyname(el, queryname):
	if (queryname == "get_words_by_filter"):
		r = JSONfield("naimenovanie", el.Dictionary.naimenovanie) + ", " + JSONfield("ssylka", el.Dictionary.ssylka)
	elif (queryname == "get_nomenklatura"):
		r = JSONfield("Article", el.nomenklatura.naimenovanie) + ", " + JSONfield("ssylka", el.ArticlesNames.Article)
	elif (queryname == "get_filter_selectors"):
		r = JSONfield("chastrechi", el.NamingRulesshemanazvaniya.chastrechi) + ", " +  JSONfield("ssylka", el.NamingRulesshemanazvaniya.ssylka) + ", "+ JSONfield("naimenovanie", el.PartOfSpeech.naimenovanie)
	elif (queryname == "get_vesvkilogramah"):
		r = JSONfield("ssylka", el.ssylka) + ", " + JSONfield("naimenovanie", el.naimenovanie) + ", " + JSONfield("vesvkilogramah", str(el.vesvkilogramah)) + ", " + JSONfield("kratnostedinitsy", str(el.kratnostedinitsy)) + ", " + JSONfield("koeffitsientgost", str(el.koeffitsientgost))

	return r