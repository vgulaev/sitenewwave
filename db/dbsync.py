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

from dbclasses1c import Base, ArticlesNames
#from secrets import str_conection_to_MySQL

print ("Content-Type: text/html; charset=utf-8")
print ("")

str_conection_to_MySQL = 'mysql+mysqldb://root:mysql@127.0.0.1/DB1C?charset=utf8'
#engine = create_engine('sqlite:///new.db')

context = etree.iterparse("D:/_Del/ArticlesNames.xml")
engine = create_engine(str_conection_to_MySQL)

Base.metadata.drop_all(engine)
Base.metadata.create_all(engine)

print ("Hello")