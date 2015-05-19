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
#from secrets import str_conection_to_MySQL

Base = declarative_base()

class Words(Base):
    __tablename__ = 'words'
    id = Column(Integer, primary_key=True)
    id1C = Column(String(250, collation = "utf8_general_ci"))
    fullname = Column(String(250, collation = "utf8_general_ci"))
    value = Column(String(250, collation = "utf8_general_ci"))
    order = Column(Integer)
    def __init__(self, fullname, id1C, value, order):
        self.fullname = fullname
        self.id1C = id1C
        self.value = value
        self.order = order
    
    def __repr__(self):
        return "<User('%s','%s')>" % (self.fullname, self.id1C)


print ("Content-Type: text/html; charset=utf-8")
print ("")

print ("Hello!!!")

str_conection_to_MySQL = 'mysql+mysqldb://root:mysql@127.0.0.1/WordsBase?charset=utf8'
#engine = create_engine('sqlite:///new.db')

context = etree.iterparse("D:/Bases/_Ert/words.xml")
engine = create_engine(str_conection_to_MySQL)

metadata = MetaData(bind=engine)
metadata.reflect() 

print(metadata.tables.keys())

Base.metadata.drop_all(engine)
Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
Session.configure(bind=engine)
session = Session()

def make_record_in_base_table_words(act, elem):
    dbrecord = Words(elem.get("fullname"), elem.get("id1C"), elem.get("value"), elem.get("order"))
    session.add(dbrecord)

i = 0
for action, elem in context:
    if elem.tag == u"Word":
        make_record_in_base_table_words(action, elem)
        print i
        i = i + 1
    else:
        print "cant make eq"

session.commit()
session.close()
