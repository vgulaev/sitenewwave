#-*- coding:utf-8 -*-

from lxml import etree

doc = etree.parse('price.xml')

root = doc.getroot()

group = root.getchildren()

print group[1][3].text.encode('utf-8')

for mainGroup in group:
	print mainGroup[0].text.encode('utf-8')
	for subGroup in mainGroup[1]:
		if (subGroup[0]!=False and subGroup[0].tag.encode('utf-8')) == 'НаименованиеГруппы':
			print sunGroup[0].text.encode('utf-8')