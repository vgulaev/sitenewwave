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
from secrets import str_conection_to_MySQL
from dbclasses import Goods

Base = declarative_base()

print ("Content-Type: text/html; charset=utf-8")
print ("")
print("<!DOCTYPE html>")

print "<html><head></head><body>"
print(sqlalchemy.__version__)

if ((sys.platform) == "win32"):
    engine = create_engine('sqlite:///new.db')
    context = etree.iterparse("import/goods.xml")
else:
    engine = create_engine(str_conection_to_MySQL)
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
    #print "<p>", "%s: %s" % (act, elem.tag), elem.get("fullname"), "</p>"
    article = Goods(elem.get("fullname"), elem.get("id1C"))
    session.add(article)

for action, elem in context:
    if elem.tag == u"Номенклатура":
        make_record_in_base(action, elem)
        print i
        i = i + 1
    else:
        print "cant make eq"

session.commit()
session.close()

print("Finish")

print "</body></html>"