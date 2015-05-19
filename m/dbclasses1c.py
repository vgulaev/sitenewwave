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
from sqlalchemy import MetaData, Column, ForeignKey, ForeignKeyConstraint, Integer, String, Float
from sqlalchemy.dialects.mysql import DOUBLE
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, relationship

Base = declarative_base()

ssylka_len = 36

class ArticlesNames(Base):
    __tablename__ = 'ArticlesNames'
    id = Column(Integer, primary_key=True)
    Article = Column(String(ssylka_len, collation = "utf8_general_ci"), index = True)
    PartOfSpeech = Column(String(ssylka_len, collation = "utf8_general_ci"), index = True)
    Order = Column(Integer)
    Word = Column(String(ssylka_len, collation = "utf8_general_ci"), index = True)
    #ForeignKeyConstraint(["Article"], ["nomenklatura.ssylka"])
    def __init__(self, Article, PartOfSpeech, Order, Word):
        self.Article = Article
        self.PartOfSpeech = PartOfSpeech
        self.Order = Order
        self.Word = Word
    
    def __repr__(self):
        return "<User('%s','%s')>" % (self.fullname, self.id1C)

class Dictionary(Base):
    __tablename__ = 'Dictionary'
    #id = Column(Integer, primary_key=True)
    ssylka = Column(String(ssylka_len, collation = "utf8_general_ci"), primary_key=True)
    PartOfSpeech = Column(String(ssylka_len, collation = "utf8_general_ci"), index = True)
    naimenovanie = Column(String(25, collation = "utf8_general_ci"), index = True)
    Order = Column(Integer)
    def __init__(self, ssylka, PartOfSpeech, naimenovanie, Order):
        self.ssylka = ssylka
        self.PartOfSpeech = PartOfSpeech
        self.naimenovanie = naimenovanie
        self.Order = Order
    
    def __repr__(self):
        return "<User('%s','%s')>" % (self.fullname, self.id1C)

class NamingRules(Base):
    __tablename__ = 'NamingRules'
    #id = Column(Integer, primary_key=True)
    ssylka = Column(String(ssylka_len, collation = "utf8_general_ci"), primary_key=True)
    naimenovanie = Column(String(250, collation = "utf8_general_ci"))
    def __init__(self, ssylka, naimenovanie):
        self.ssylka = ssylka
        self.naimenovanie = naimenovanie
    
    def __repr__(self):
        return "<User('%s','%s')>" % (self.fullname, self.id1C)

class NamingRulesshemanazvaniya(Base):
    __tablename__ = 'NamingRulesshemanazvaniya'
    id = Column(Integer, primary_key=True)
    ssylka = Column(String(ssylka_len, collation = "utf8_general_ci"))
    chastrechi = Column(String(ssylka_len, collation = "utf8_general_ci"))
    DefaultValue = Column(String(ssylka_len, collation = "utf8_general_ci"))
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
    #id = Column(Integer, primary_key=True)
    ssylka = Column(String(ssylka_len, collation = "utf8_general_ci"), primary_key=True)
    naimenovanie = Column(String(250, collation = "utf8_general_ci"), index = True)
    praviloformirovaniyanazvaniya = Column(String(250, collation = "utf8_general_ci"), index = True)
    def __init__(self, ssylka, naimenovanie, praviloformirovaniyanazvaniya):
        self.ssylka = ssylka
        self.naimenovanie = naimenovanie
        self.praviloformirovaniyanazvaniya = praviloformirovaniyanazvaniya
    
    def __repr__(self):
        return "<User('%s','%s')>" % (self.fullname, self.id1C)

class PartOfSpeech(Base):
    __tablename__ = 'PartOfSpeech'
    #id = Column(Integer, primary_key=True)
    ssylka = Column(String(ssylka_len, collation = "utf8_general_ci"), primary_key=True)
    naimenovanie = Column(String(250, collation = "utf8_general_ci"))
    def __init__(self, ssylka, naimenovanie):
        self.ssylka = ssylka
        self.naimenovanie = naimenovanie
    
    def __repr__(self):
        return "<User('%s','%s')>" % (self.fullname, self.id1C)

class harakteristikinomenklatury(Base):
    __tablename__ = 'harakteristikinomenklatury'
    #id = Column(Integer, primary_key=True)
    ssylka = Column(String(ssylka_len, collation = "utf8_general_ci"), primary_key=True)
    naimenovanie = Column(String(250, collation = "utf8_general_ci"))
    vladelets = Column(String(ssylka_len, collation = "utf8_general_ci"), index = True)
    kratnostedinitsy = Column(DOUBLE)
    vesvkilogramah = Column(DOUBLE)
    koeffitsientgost = Column(DOUBLE)
    def __init__(self, ssylka, naimenovanie, vladelets, kratnostedinitsy, vesvkilogramah, koeffitsientgost):
        self.ssylka = ssylka
        self.naimenovanie = naimenovanie
        self.vladelets = vladelets
        self.kratnostedinitsy = kratnostedinitsy
        self.vesvkilogramah = vesvkilogramah
        self.koeffitsientgost = koeffitsientgost
    
    def __repr__(self):
        return "<User('%s','%s')>" % (self.fullname, self.id1C)

class tsenynomenklatury(Base):
    __tablename__ = 'tsenynomenklatury'
    id = Column(Integer, primary_key=True)
    nomenklatura = Column(String(ssylka_len, collation = "utf8_general_ci"), index=True)
    vidtseny = Column(String(ssylka_len, collation = "utf8_general_ci"), index=True)
    harakteristika = Column(String(ssylka_len, collation = "utf8_general_ci"), index=True)
    tsena = Column(DOUBLE)
    def __init__(self, nomenklatura, vidtseny, harakteristika, tsena):
        self.nomenklatura = nomenklatura
        self.vidtseny = vidtseny
        self.harakteristika = harakteristika
        self.tsena = tsena
    
    def __repr__(self):
        return "<User('%s','%s')>" % (self.fullname, self.id1C)

class vidytsen(Base):
    __tablename__ = 'vidytsen'
    ssylka = Column(String(ssylka_len, collation = "utf8_general_ci"), primary_key=True)
    naimenovanie = Column(String(250, collation = "utf8_general_ci"))
    def __init__(self, ssylka, naimenovanie):
        self.ssylka = ssylka
        self.naimenovanie = naimenovanie
    def __repr__(self):
        return "<User('%s','%s')>" % (self.fullname, self.id1C)        