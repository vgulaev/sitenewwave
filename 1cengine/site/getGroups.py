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

	print row