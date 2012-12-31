#!/web/tdymkru/python/bin/python2.6
# -*- coding: utf-8 -*-
# This Python file uses the following encoding: utf-8
import sys, os
import cgitb; cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))
import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import MetaData, Column, Integer, String
from sqlalchemy.dialects.mysql import VARCHAR
from sqlalchemy.orm import sessionmaker
from lxml import etree 

Base = declarative_base()

class Goods(Base):
    __tablename__ = 'goods'
    id = Column(Integer, primary_key=True)
    id1C = Column(String(250))
    fullname = Column(String(250))
    def __init__(self, fullname, id1C):
        self.fullname = fullname
        self.id1C = id1C
    
    def __repr__(self):
        return "<User('%s','%s', '%s')>" % (self.name, self.fullname, self.password)

print ("Content-Type: text/html; charset=utf-8")
print ("")
print("<!DOCTYPE html>")

print "<html><head></head><body>"
print(sqlalchemy.__version__)

if ((sys.platform) == "win32"):
    engine = create_engine('sqlite:///new.db')
    context = etree.iterparse("import/goods.xml")
else:
    engine = create_engine('mysql://tdymkru:8awzVTe1@localhost:3306/tdymkru?charset=utf8')
    context = etree.iterparse(os.path.expanduser("~/site/www/import/goods.xml"))

# check that tables exist
metadata = MetaData(bind=engine)
metadata.reflect() 
if 'users' in metadata.tables.keys():
    print("yes")

print(metadata.tables.keys())

Base.metadata.drop_all(engine)
Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
Session.configure(bind=engine)
session = Session()

i = 0;

def make_record_in_base(act, elem):
    print "<p>", "%s: %s" % (act, elem.tag), elem.get("fullname"), "</p>"
    article = Goods(elem.get("fullname"), elem.get("id1C"))
    session.add(article)
    session.commit()

for action, elem in context:
    if elem.tag == "Номенклатура":
        make_record_in_base(action, elem)
        print i
        i = i + 1
    else:
        print "cant make eq"

session.close()

print("Finish")

print "</body></html>"