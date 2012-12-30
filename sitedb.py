#!/web/tdymkru/python/bin/python2.6
# -*- coding: utf-8 -*-
# This Python file uses the following encoding: utf-8
import sys, os
import cgitb; cgitb.enable()
from xml.sax.xmlreader import XMLReader
sys.path.insert(0, os.path.expanduser('~/site/python'))
import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import MetaData, Column, Integer, String
from sqlalchemy.dialects.mysql import VARCHAR
from sqlalchemy.orm import sessionmaker
import xml.sax as saxparser

Base = declarative_base()

class Goods(Base):
    __tablename__ = 'goods'
    id = Column(Integer, primary_key=True)
    id1C = Column(String(250))
    fullname = Column(String(250))
    def __init__(self, name, fullname):
        self.id1C = name
        self.fullname = fullname
    
    def __repr__(self):
        return "<User('%s','%s', '%s')>" % (self.name, self.fullname, self.password)

print ("Content-Type: text/html; charset=utf-8")
print ("")
print("<!DOCTYPE html>")

print "<html><head></head><body>"
print(sqlalchemy.__version__)

# engine = create_engine('mysql://tdymkru:8awzVTe1@localhost:3306/tdymkru?charset=utf8')
engine = create_engine('sqlite:///new.db')

#check that tables exist
metadata = MetaData(bind = engine)
metadata.reflect() 
if 'users' in metadata.tables.keys():
    print("yes")

print(metadata.tables.keys())

Base.metadata.drop_all(engine)
Base.metadata.create_all(engine)

import xml.sax.xmlreader
import xml.sax.saxutils

Session = sessionmaker(bind=engine)
Session.configure(bind=engine)
session = Session()

#session.commit()
# 
# for i in range(0, 1000):
#    ed_user = User('ed', 'Ed Jones', 'edspassword')
#    session.add(ed_user)
#    
# session.commit()
#===============================================================================
#print(Base.metadata.tables.keys())

sys.path.insert(0, os.path.expanduser('~/site/python'))

from lxml import etree 
#from bs4 import BeautifulSoup
#soup = BeautifulSoup(open("import/goods.xml"), "xml")
#goodsarray = soup.find_all("Номенклатура")
#help(xml.sax.xmlreader)
#context = etree.iterparse(os.path.expanduser("~/site/www/import/goods.xml"))
context = etree.iterparse("import/goods.xml")

i = 0;

def make_record_in_base(act, elem):
    print "%s: %s" % (act, elem.tag), elem.get("fullname")
    article = Goods(elem.get("fullname"), "")
    session.add(article)
    session.commit()

for action, elem in context:
    if elem.tag == "Номенклатура":
        make_record_in_base(action, elem)
        print i
        i = i + 1
    
session.close()

print("Finish")

print "</body></html>"