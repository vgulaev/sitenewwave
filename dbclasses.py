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

class Offers(Base):
    __tablename__ = 'offers'
    id = Column(Integer, primary_key=True)
    name = Column(String(201))
    hash = Column(String(64))
    parent_hash = Column(String(64))
    father_hash = Column(String(64))
    display_name = Column(String(100))
    char_name = Column(String(25))
    weight = Column(String(10))
    length = Column(String(10))
    kf = Column(String(10))
    edIzm = Column(String(10))
    def __init__(self, name, hash, parent_hash, father_hash, display_name, char_name, weight, length, kf, edIzm):
        self.name = name
        self.hash = hash
        self.parent_hash = parent_hash
        self.father_hash = father_hash
        self.display_name = display_name
        self.char_name = char_name
        self.weight = weight
        self.length = length
        self.kf = kf
        self.edIzm = edIzm
    
    def __repr__(self):
        return "<User('%s','%s')>" % (self.name, self.hash)
