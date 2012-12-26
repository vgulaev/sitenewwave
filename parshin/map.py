#!/web/tdymkru/python/bin/python2.6
# -*- coding: utf-8 -*-
# This Python file uses the following encoding: utf-8
import sys, os
import cgitb; cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))

print ("Content-Type: text/html; charset=utf-8")
print ("")
    
print("<!DOCTYPE html>")
print "Hello world!"
