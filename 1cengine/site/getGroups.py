#!/usr/bin/python2.6
# -*- coding: utf-8 -*-


import sys,os
import cgi
import cgitb; cgitb.enable()

print ("Content-Type: text/html; charset=utf-8\n")

from secrets import *

def getGroups():
	connector = myDBC("goods")
	connector.dbConnect()
	row = connector.dbExecute("""
			SELECT `name`
			FROM `groups`
			WHERE `hash` = `parent_hash`
		""")
	
	connector.dbClose()

	return row

def showGroups(row):

	print "<ul>"
	for x in row:
		print "<li><a href=\"javascript:showGroup2('"+x[0]+"')\"><strong>"+x[0]+"</strong></a></li>"
		
	print "</ul>"

row = getGroups()
showGroups(row)