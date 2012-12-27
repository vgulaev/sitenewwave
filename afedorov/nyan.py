#!/usr/bin/python2.7
# -*- coding:utf-8 -*-

import re, os
import urllib
from grab import * 

global count

count = 0

def mySiteParser(site_url, dirlist):
	
	dirname = site_url.replace("http://trimet.ru/", "")
	dirname = dirname.replace("/", "_")
	dirname = dirname.replace(":","")
	dirname_origin = dirname
	if not dirname_origin in dirlist and not dirname_origin == '':
		global count
		count = count + 1
		count_len = str(count).__len__()
		if count_len == 1:
			dir_count = "00"+str(count)
		elif count_len == 2:
			dir_count = "0"+str(count)
		elif count_len >= 3:
			dir_count = str(count)

		dirname = dir_count+"_"+dirname
		# filename = filename+'html'
		
		if not os.path.exists(dirname): 
			dirlist.append(dirname_origin)
			os.makedirs(dirname)
			filename = dirname+"/index.html"
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

				p2 = re.compile('<div id="main[\w/]*">', re.DOTALL)

				div = p2.findall(html)
				print div

				body = html[header:footer]

				### css on site >>> ###

				p4 = re.compile('url\("[\w/.]+css', re.DOTALL)

				css = p4.findall(html)

				print css

				for cssfile in css:
					cssurl = cssfile.replace("url(\"", "http://trimet.ru")

					try: 
						fcss = open(dirname+"/index.css",'wb')
						fcss.write(urllib.urlopen(cssurl).read())
						fcss.close()
						print "Success on " + cssurl
					except:
						print "Error on " + cssurl

				### <<< css on site ###

				### img on site >>> ###

				p3 = re.compile('src="[\w/.]+"', re.DOTALL)

				imgs = p3.findall(body)

				print imgs

				for img in imgs:
					img = img.replace("src=\"","http://trimet.ru/")
					img = img.replace("\"", "") 

					# imgname = 
					p4 = re.compile("[\w]+\.jpg|[\w]+\.png|[\w]+\.gif")
					imgname = p4.findall(img)

					for imgnameiterator in imgname:
						imgnameiterator = dirname+"/"+imgnameiterator



						try: 
							fimage = open(imgnameiterator,'wb')
							fimage.write(urllib.urlopen(img).read())
							fimage.close()
							print "Success on " + imgnameiterator
						except:
							print "Error on " + imgnameiterator

				### <<< img on site ###

					
				### replace img path in body >>> ###

				p6 = re.compile("src=\"[\w/]+.jpg|src=\"[\w/]+.png|src=\"[\w/]+.gif")

				imgpaths = p6.findall(body)

				for path in imgpaths:
					p4 = re.compile("[\w]+\.jpg|[\w]+\.png|[\w]+\.gif")
					imgname = p4.findall(path)

					for img in imgname:

						body = body.replace(path, "src=\""+img)

				### <<< replace img path in body ###

				body = div[0]+body+"</div>"

				f.write(body)
				f.close
				print 'wrote down '+filename
				
				for url in urlList:
					url = url.replace("href=\"", "http://trimet.ru")
					url = url.replace("\"","")
					
					
					mySiteParser(url, dirlist)
						

mySiteParser("http://www.trimet.ru/", [])