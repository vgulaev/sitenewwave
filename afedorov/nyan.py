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

				### header&footer erase >>> ###

				preheader = html.find('<div id="header')
				
				header = html.find("/header -->")
				footer = html.find('<div id="footer')
				# body = p2.findall(html)

				preheader = html[0:preheader]

				header = header + 11
				length = footer - header
				preheader = preheader.replace('<?xml version="1.0" encoding="utf-8" ?>','')
				preheader = preheader.replace('<!--?xml version="1.0" encoding="utf-8" ?-->','')
				preheader = preheader.replace('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">','')

				ph = re.compile('<style\stype="text/css"\smedia="all">@import\surl\("[\w/.-]+"\);</style>\n',re.DOTALL)
				delete = ph.findall(preheader)
				for el in delete:
					preheader = preheader.replace(el,'')

				ph = re.compile('<link\srel="stylesheet"\shref="[\w/.-]+"\stype="text/css"\smedia="screen"\s/>\n',re.DOTALL)
				delete = ph.findall(preheader)
				for el in delete:
					preheader = preheader.replace(el,'')

				ph = re.compile('<script\ssrc="[\w/.-]+"></script>\n',re.DOTALL)
				delete = ph.findall(preheader)
				for el in delete:
					preheader = preheader.replace(el,'')

				ph = re.compile('<script\stype="text/javascript"\sasync=""\ssrc="[\w/.-]+"></script>\n',re.DOTALL)
				delete = ph.findall(preheader)
				for el in delete:
					preheader = preheader.replace(el,'')

				preheader = preheader.replace('</head>', '<link rel="stylesheet" type="text/css" href="index.css" media="all" />\n</head>')

				body = html[header:footer]


				### <<< header&footer erase ###

				### css on site >>> ###

				p4 = re.compile('url\("[\w/.]+css', re.DOTALL)

				css = p4.findall(html)

				print css

				for cssfile in css:
					cssurl = cssfile.replace("url(\"", "http://trimet.ru")

					try: 
						fcss = open(dirname+"/index.css",'wb')

						csstext = urllib.urlopen(cssurl).read()

						p6 = re.compile("url\(\"[\w/]+.jpg|url\(\"[\w/]+.png|url\(\"[\w/]+.gif|url\(\"[\w/]+.ico|url\('[\w/]+.jpg|url\('[\w/]+.png|url\('[\w/]+.gif|url\('[\w/]+.ico")

						imgpaths = p6.findall(csstext)

						for path in imgpaths:
							p4 = re.compile("[\w]+\.jpg|[\w]+\.png|[\w]+\.gif|[\w]+\.ico")
							imgname = p4.findall(path)

							for img in imgname:

								csstext = csstext.replace(path, "url('/img/"+img)


						fcss.write(csstext)
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
					p4 = re.compile("[\w]+\.jpg|[\w]+\.png|[\w]+\.gif|[\w]+\.ico")
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

				p6 = re.compile("src=\"[\w/]+.jpg|src=\"[\w/]+.png|src=\"[\w/]+.gif|src=\"[\w/]+.ico")

				imgpaths = p6.findall(body)

				for path in imgpaths:
					p4 = re.compile("[\w]+\.jpg|[\w]+\.png|[\w]+\.gif|[\w]+\.ico")
					imgname = p4.findall(path)

					for img in imgname:

						body = body.replace(path, "src=\""+img)

				### <<< replace img path in body ###

				body = preheader+body+"</div>"

				f.write(body)
				f.close
				print 'wrote down '+filename
				
				for url in urlList:
					url = url.replace("href=\"", "http://trimet.ru")
					url = url.replace("\"","")
					
					
					mySiteParser(url, dirlist)
						

mySiteParser("http://www.trimet.ru/", [])