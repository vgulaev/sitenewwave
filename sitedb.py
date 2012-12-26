#!/web/tdymkru/python/bin/python2.6
# -*- coding: utf-8 -*-
# This Python file uses the following encoding: utf-8
import sys, os
import cgitb; cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))
import sqlalchemy
from sqlalchemy import create_engine

print ("Content-Type: text/html; charset=utf-8")
print ("")
    
print("<!DOCTYPE html>")

print(sqlalchemy.__version__)

engine = create_engine('mysql://tdymkru:8awzVTe1@localhost:3306/tdymkru')


# conn = sqlite3.connect('example.db')
# c = conn.cursor()

# # Create table
# c.execute('''CREATE TABLE stocks
             # (date text, trans text, symbol text, qty real, price real)''')

# # Insert a row of data
# c.execute("INSERT INTO stocks VALUES ('2006-01-05','BUY','RHAT',100,35.14)")

# # Save (commit) the changes
# conn.commit()

# # We can also close the connection if we are done with it.
# # Just be sure any changes have been committed or they will be lost.
# conn.close()