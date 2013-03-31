#!c:/Python27/python.exe
# -*- coding: utf-8 -*-
# This Python file uses the following encoding: utf-8
# --  #!/web/trimetru/python/bin/python2.6
import sys, os
import cgi
import cgitb; cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))

def JSONfield(name, value):
    return "\"" + name + "\":\"" + value + "\""

def JSONwrap(name, symbol = "\""):
    return symbol + name + symbol
