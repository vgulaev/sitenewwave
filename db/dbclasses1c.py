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