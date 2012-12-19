#!/usr/bin/python2.7
# -*- coding:utf-8 -*-

import re, os
from grab import * 


def mySiteParser(site_url):
	filename = site_url.replace(":", "")
	filename = filename.replace("/", ".")
	filename = filename+'html'

	if not os.path.exists(filename):
	
		f = open(filename, "w+")
		c = 0
		try:	
			g = Grab()
			g.go(site_url)
			html = g.response.body
		except:
			c = 1
			pass

		# print html
		if c!=1:
			p = re.compile('href="[\w/]+"', re.DOTALL)

			urlList = p.findall(html)

			header = html.find("/header -->")
			footer = html.find('<div id="footer')
			# body = p2.findall(html)

			header = header + 11
			length = footer - header

			body = html[header:footer]

			body = body.replace("/bitrix/templates/trimet/img/default/", "/afedorov/img/")
			body = body.replace("/upload/medialibrary/658/", "/afedorov/img/")
			body = body.replace("/upload/medialibrary/51b/", "/afedorov/img/")
			body = body.replace("/images/", "/afedorov/images/")

			f.write(body)
			f.close
			print 'wrote down '+filename
			for url in urlList:
				url = url.replace("href=\"", "http://trimet.ru")
				url = url.replace("\"","")
				mySiteParser(url)

mySiteParser("http://www.trimet.ru/")