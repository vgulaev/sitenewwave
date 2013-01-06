#!/web/tdymkru/python/bin/python2.6
# -*- coding: utf-8 -*-
# This Python file uses the following encoding: utf-8
import sys, os
import cgitb; cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import MetaData, Column, Integer, String

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
        return "<User('%s','%s')>" % (self.fullname, self.id1C)

class Words(Base):
    __tablename__ = 'words'
    id = Column(Integer, primary_key=True)
    id1C = Column(String(250))
    fullname = Column(String(250))
    value = Column(String(250))
    order = Column(Integer)
    def __init__(self, fullname, id1C, value, order):
        self.fullname = fullname
        self.id1C = id1C
        self.value = value
        self.order = order
    
    def __repr__(self):
        return "<User('%s','%s')>" % (self.fullname, self.id1C)