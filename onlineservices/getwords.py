#!/web/tdymkru/python/bin/python2.6
# -*- coding: utf-8 -*-
# This Python file uses the following encoding: utf-8
import sys, os
import cgi
import cgitb; cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))
if ((sys.platform) == "win32"):
    sys.path.insert(0, "../")
else:
    sys.path.insert(0, os.path.expanduser('~/site/www'))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dbclasses import Words, Goods
from secrets import str_conection_to_MySQL

print ("Content-Type: text/html; charset=utf-8")
print ("")

form = cgi.FieldStorage()

if ((sys.platform) == "win32"):
    engine = create_engine('sqlite:///../new.db')
else:
    engine = create_engine(str_conection_to_MySQL)

Session = sessionmaker(bind=engine)
Session.configure(bind=engine)
session = Session()

#likeex = "%" + form["likecondition"].value + "%"
#print "<p>", likeex, "</p>"
#q = session.query(Goods).filter(Goods.fullname.like(u"%арма%")).all()
q = session.query(Words)

#for i in range(1,3):
    #q = q.filter(Words.order == 1)
    #print i

q = q.filter(Words.order == 1).group_by(Words.value).all()

result = "";
for el in q:
    result = result + el.value + " " 

print result.lstrip()