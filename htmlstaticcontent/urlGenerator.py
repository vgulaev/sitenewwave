#!/usr/bin/python2.7
# -*- coding:utf-8 -*-

import os

path = "/home/saur/web/sitenewwave/htmlstaticcontent/"

dirs = os.listdir(path)

for dirname in dirs:
	if not dirname == "urlGenerator.py":
		true_dirname = dirname[4:]
		true_dirname = true_dirname.replace("_", "/")
		true_dirname = true_dirname[:-1]
		
		print 'trimeturls.append(urltype("'+true_dirname+'", "htmlstaticcontent/'+dirname+'/"))'

