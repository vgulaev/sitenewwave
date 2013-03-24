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

from lxml import etree
from dbclasses1c import Base, NamingRulesshemanazvaniya
#from secrets import str_conection_to_MySQL

def JSONfield(name, value):
    return "\"" + name + "\":\"" + value + "\""

print ("Content-Type: text/html; charset=utf-8")
print ("")

form = cgi.FieldStorage()

str_conection_to_MySQL = 'mysql+mysqldb://root:mysql@127.0.0.1/DB1C?charset=utf8'
#engine = create_engine('sqlite:///new.db')

engine = create_engine(str_conection_to_MySQL)

Session = sessionmaker(bind=engine)
Session.configure(bind=engine)
session = Session()

q = session.query(NamingRulesshemanazvaniya)

q = q.filter(NamingRulesshemanazvaniya.ssylka == form["ssylka"].value)

q = q.all()

result = "{\"records\":[";
for el in q:
    result = result + "{" + JSONfield("chastrechi", el.chastrechi) + ", " +  JSONfield("ssylka", el.ssylka) + " },"
    #result = result + "{" \"naimenovanie\": \"" + el.naimenovanie + "\" },"

result = result[:-1] + "]}";
print(form["ssylka"])
print(result.lstrip().encode("utf-8"))