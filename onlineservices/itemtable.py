#!/web/tdymkru/python/bin/python2.6
# -*- coding: utf-8 -*-
# This Python file uses the following encoding: utf-8
import sys, os
import cgitb; cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))
if ((sys.platform) == "win32"):
    sys.path.insert(0, "../")
else:
    sys.path.insert(0, os.path.expanduser('~/site/www'))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dbclasses import Goods
from secrets import str_conection_to_MySQL

print ("Content-Type: text/html; charset=utf-8")
print ("")

if ((sys.platform) == "win32"):
    engine = create_engine('sqlite:///../new.db')
else:
    engine = create_engine(str_conection_to_MySQL)

Session = sessionmaker(bind=engine)
Session.configure(bind=engine)
session = Session()

q = session.query(Goods).filter(Goods.fullname.like(u"%арма%")).all()

for el in q:
    print "<p>", el.fullname, "</p>"

print "Hello!!!"
