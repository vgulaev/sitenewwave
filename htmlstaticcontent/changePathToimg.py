# -*- coding: utf-8 -*-

import sys,os,re

_PATH = os.path.abspath(os.path.dirname(__file__))

dirList = os.listdir(_PATH)
# print dirList

for dirname in dirList: 
 	dirpath = os.path.join(_PATH, dirname)
	filename = os.path.join(dirpath, 'index.html')
	# print filename
	if os.path.exists(filename):
		# print filename
		html_file_name = filename
		html_file = open(html_file_name,'r')
		html_file_string = html_file.read()
		html_file.close()

		stringToReplace = "/images/img-4.jpg"
		stringForReplace = "/img/img-4.jpg"

		html_file_string = html_file_string.replace(stringToReplace, stringForReplace)

		print "done on ", filename

		# p6 = re.compile("/upload[\w\-\s_/\.]+jpg|/upload[\w\-\s_/\.]+png|/upload[\w\-\s_/\.]+gif|/upload[\w\-\s_/\.]+ico")

		# imgpaths = p6.findall(html_file_string)

		# for path in imgpaths:
		#     p4 = re.compile("[\w\-_\s\.]+jpg|[\w\-_\s\.]+png|[\w\-_\s\.]+gif|[\w\-_\s\.]+ico")
		#     imgname = p4.findall(path)

		#     for img in imgname:

		#         html_file_string = html_file_string.replace(path, "/htmlstaticcontent/unknown_images/"+img)

		#         print path, " --> ", img


		html_file_name = filename
		html_file = open(html_file_name,'w')

		html_file.write(html_file_string)
		html_file.close()