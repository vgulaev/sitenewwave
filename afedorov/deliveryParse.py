#-*- coding:utf-8 -*-

import os

delivery = {}
towns = []

filename = "deliveryCost.txt"

_PATH = os.path.abspath(os.path.dirname(__file__))
f_file = os.path.join(_PATH, filename)

f = open(f_file, "r")

newTown = True

for line in f.readlines():

	if newTown == True:
		town = line.replace("\n", "")
		delivery[town] = []
		towns.append(town)
		newTown = False

	elif line == "\n":
		newTown = True

	else:
		delivery[town].append(line.replace("\n", ""))

f.close()
i = 0
for town in towns:
	if i%2 == 0:
		print "<tr>"
	else:
		print "<tr class=\"odd\">"
	print "<td>"+town+"</td>"
	print "<td>"+delivery[town][0]+"&nbsp;руб.</td>"
	print "<td>"+delivery[town][1]+"&nbsp;руб.</td>"
	print "<td>"+delivery[town][2]+"&nbsp;руб.</td>"
	print "<td>"+delivery[town][3]+"&nbsp;руб.</td>"
	print "</tr>"
	i = i + 1