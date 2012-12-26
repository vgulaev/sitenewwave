#!/web/tdymkru/python/bin/python2.6
# -*- coding: utf-8 -*-
# This Python file uses the following encoding: utf-8
import sys, os
import cgitb; cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))
import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String
from sqlalchemy.dialects.mysql import VARCHAR
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

print ("Content-Type: text/html; charset=utf-8")
print ("")
    
print("<!DOCTYPE html>")

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(VARCHAR(250))
    fullname = Column(VARCHAR(250))
    password = Column(VARCHAR(250))
    def __init__(self, name, fullname, password):
        self.name = name
        self.fullname = fullname
        self.password = password
    
    def __repr__(self):
        return "<User('%s','%s', '%s')>" % (self.name, self.fullname, self.password)

print(sqlalchemy.__version__)
print(User.__table__)
print(User.__mapper__)

engine = create_engine('mysql://tdymkru:8awzVTe1@localhost:3306/tdymkru?charset=utf8')

#engine = create_engine('sqlite:///new.db')

Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
Session.configure(bind=engine)
session = Session()

for i in range(0, 1000):
    ed_user = User('ed', 'Ed Jones', 'edspassword')
    session.add(ed_user)
    
session.commit()
print("Finish")