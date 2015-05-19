#!c:/Python27/python.exe
# -*- coding: utf-8 -*-
# This Python file uses the following encoding: utf-8
# --  #!/web/trimetru/python/bin/python2.6
import sys, os
import cgi
import cgitb; cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))
from bs4 import BeautifulSoup
from lxml import etree
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import MetaData, Column, Integer, String

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from dbclasses1c import Base, ArticlesNames, Dictionary, NamingRules, NamingRulesshemanazvaniya, nomenklatura, PartOfSpeech, harakteristikinomenklatury, tsenynomenklatury, vidytsen
#from secrets import str_conection_to_MySQL

print ("Content-Type: text/html; charset=utf-8")
print ("")

str_conection_to_MySQL = 'mysql+mysqldb://root:mysql@127.0.0.1/DB1C?charset=utf8'
#engine = create_engine('sqlite:///new.db')

engine = create_engine(str_conection_to_MySQL)

Base.metadata.drop_all(engine)
Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
Session.configure(bind=engine)
session = Session()

soup = BeautifulSoup(open("D:/_Del/nomenklatura.xml"), "xml")
nodes = soup.find_all("Record")

for currentelement in nodes:
    dbrecord = nomenklatura(currentelement.ssylka["Value"], currentelement.naimenovanie["Value"], currentelement.praviloformirovaniyanazvaniya["Value"])
    session.add(dbrecord)

soup = BeautifulSoup(open("D:/_Del/ArticlesNames.xml"), "xml")
nodes = soup.find_all("Record")

for currentelement in nodes:
    dbrecord = ArticlesNames(currentelement.Article["Value"], currentelement.PartOfSpeech["Value"], currentelement.Order["Value"], currentelement.Word["Value"])
    session.add(dbrecord)

soup = BeautifulSoup(open("D:/_Del/Dictionary.xml"), "xml")
nodes = soup.find_all("Record")

for currentelement in nodes:
    dbrecord = Dictionary(currentelement.ssylka["Value"], currentelement.PartOfSpeech["Value"], currentelement.naimenovanie["Value"], currentelement.Order["Value"])
    session.add(dbrecord)

soup = BeautifulSoup(open("D:/_Del/NamingRules.xml"), "xml")
nodes = soup.find_all("Record")

for currentelement in nodes:
    dbrecord = NamingRules(currentelement.ssylka["Value"], currentelement.naimenovanie["Value"])
    session.add(dbrecord)

soup = BeautifulSoup(open("D:/_Del/NamingRulesshemanazvaniya.xml"), "xml")
nodes = soup.find_all("Record")

for currentelement in nodes:
    dbrecord = NamingRulesshemanazvaniya(currentelement.ssylka["Value"], currentelement.chastrechi["Value"], currentelement.DefaultValue["Value"], currentelement.nomerstroki["Value"])
    session.add(dbrecord)

soup = BeautifulSoup(open("D:/_Del/PartOfSpeech.xml"), "xml")
nodes = soup.find_all("Record")

for currentelement in nodes:
    dbrecord = PartOfSpeech(currentelement.ssylka["Value"], currentelement.naimenovanie["Value"])
    session.add(dbrecord)
	
soup = BeautifulSoup(open("D:/_Del/harakteristikinomenklatury.xml"), "xml")
nodes = soup.find_all("Record")

for currentelement in nodes:
    dbrecord = harakteristikinomenklatury(currentelement.ssylka["Value"], currentelement.naimenovanie["Value"], currentelement.vladelets["Value"], float(currentelement.kratnostedinitsy["Value"]), float(currentelement.vesvkilogramah["Value"]), float(currentelement.koeffitsientgost["Value"]))
    session.add(dbrecord)

soup = BeautifulSoup(open("D:/_Del/tsenynomenklatury.xml"), "xml")
nodes = soup.find_all("Record")

for currentelement in nodes:
    dbrecord = tsenynomenklatury(currentelement.nomenklatura["Value"], currentelement.vidtseny["Value"], currentelement.harakteristika["Value"], float(currentelement.tsena["Value"]))
    session.add(dbrecord)

soup = BeautifulSoup(open("D:/_Del/vidytsen.xml"), "xml")
nodes = soup.find_all("Record")

for currentelement in nodes:
    dbrecord = vidytsen(currentelement.ssylka["Value"], currentelement.naimenovanie["Value"])
    session.add(dbrecord)

session.commit()
session.close()

print ("Hello")