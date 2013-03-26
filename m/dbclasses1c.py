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

Base = declarative_base()

class ArticlesNames(Base):
    __tablename__ = 'ArticlesNames'
    id = Column(Integer, primary_key=True)
    Article = Column(String(250, collation = "utf8_general_ci"))
    PartOfSpeech = Column(String(250, collation = "utf8_general_ci"))
    Order = Column(Integer)
    Word = Column(String(250, collation = "utf8_general_ci"))
    def __init__(self, Article, PartOfSpeech, Order, Word):
        self.Article = Article
        self.PartOfSpeech = PartOfSpeech
        self.Order = Order
        self.Word = Word
    
    def __repr__(self):
        return "<User('%s','%s')>" % (self.fullname, self.id1C)

class Dictionary(Base):
    __tablename__ = 'Dictionary'
    id = Column(Integer, primary_key=True)
    ssylka = Column(String(250, collation = "utf8_general_ci"))
    PartOfSpeech = Column(String(250, collation = "utf8_general_ci"))
    naimenovanie = Column(String(250, collation = "utf8_general_ci"))
    def __init__(self, ssylka, PartOfSpeech, naimenovanie):
        self.ssylka = ssylka
        self.PartOfSpeech = PartOfSpeech
        self.naimenovanie = naimenovanie
    
    def __repr__(self):
        return "<User('%s','%s')>" % (self.fullname, self.id1C)

class NamingRules(Base):
    __tablename__ = 'NamingRules'
    id = Column(Integer, primary_key=True)
    ssylka = Column(String(250, collation = "utf8_general_ci"))
    naimenovanie = Column(String(250, collation = "utf8_general_ci"))
    def __init__(self, ssylka, naimenovanie):
        self.ssylka = ssylka
        self.naimenovanie = naimenovanie
    
    def __repr__(self):
        return "<User('%s','%s')>" % (self.fullname, self.id1C)

class NamingRulesshemanazvaniya(Base):
    __tablename__ = 'NamingRulesshemanazvaniya'
    id = Column(Integer, primary_key=True)
    ssylka = Column(String(250, collation = "utf8_general_ci"))
    chastrechi = Column(String(250, collation = "utf8_general_ci"))
    DefaultValue = Column(String(250, collation = "utf8_general_ci"))
    nomerstroki = Column(Integer)
    def __init__(self, ssylka, chastrechi, DefaultValue, nomerstroki):
        self.ssylka = ssylka
        self.chastrechi = chastrechi
        self.DefaultValue = DefaultValue
        self.nomerstroki = nomerstroki
    
    def __repr__(self):
        return "<User('%s','%s')>" % (self.fullname, self.id1C)

class nomenklatura(Base):
    __tablename__ = 'nomenklatura'
    id = Column(Integer, primary_key=True)
    ssylka = Column(String(250, collation = "utf8_general_ci"))
    naimenovanie = Column(String(250, collation = "utf8_general_ci"))
    praviloformirovaniyanazvaniya = Column(String(250, collation = "utf8_general_ci"))
    def __init__(self, ssylka, naimenovanie, praviloformirovaniyanazvaniya):
        self.ssylka = ssylka
        self.naimenovanie = naimenovanie
        self.praviloformirovaniyanazvaniya = praviloformirovaniyanazvaniya
    
    def __repr__(self):
        return "<User('%s','%s')>" % (self.fullname, self.id1C)

class PartOfSpeech(Base):
    __tablename__ = 'PartOfSpeech'
    id = Column(Integer, primary_key=True)
    ssylka = Column(String(250, collation = "utf8_general_ci"))
    naimenovanie = Column(String(250, collation = "utf8_general_ci"))
    def __init__(self, ssylka, naimenovanie):
        self.ssylka = ssylka
        self.naimenovanie = naimenovanie
    
    def __repr__(self):
        return "<User('%s','%s')>" % (self.fullname, self.id1C)