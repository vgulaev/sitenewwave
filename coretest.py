#!/web/trimetru/python/bin/python2.6
# -*- coding: utf-8 -*-
# This Python file uses the following encoding: utf-8

import cgi
import sys, os
#from flup.server.fcgi import WSGIServer

print ("Content-Type: text/html; charset=utf-8")
print ("")

cgi.print_environ()