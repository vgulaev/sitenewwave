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

Base = declarative_base()

class Goods(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    id1C = Column(String(250))
    fullname = Column(String(250))
    password = Column(String(250))
    def __init__(self, name, fullname, password):
        self.name = name
        self.fullname = fullname
        self.password = password
    
    def __repr__(self):
        return "<User('%s','%s', '%s')>" % (self.name, self.fullname, self.password)

print ("Content-Type: text/html; charset=utf-8")
print ("")
print("<!DOCTYPE html>")

print(sqlalchemy.__version__)
print(User.__table__)
print(User.__mapper__)

# engine = create_engine('mysql://tdymkru:8awzVTe1@localhost:3306/tdymkru?charset=utf8')

engine = create_engine('sqlite:///new.db')

#check that tables exist
metadata = MetaData(bind = engine)
metadata.reflect() 
if 'users' in metadata.tables.keys():
    print("yes")

print(metadata.tables.keys())
#Base.metadata.create_all(engine)
Base.metadata.create(User)
 
#===============================================================================
# Session = sessionmaker(bind=engine)
# Session.configure(bind=engine)
# session = Session()
# 
# for i in range(0, 1000):
#    ed_user = User('ed', 'Ed Jones', 'edspassword')
#    session.add(ed_user)
#    
# session.commit()
#===============================================================================
#print(Base.metadata.tables.keys())

print("Finish")
