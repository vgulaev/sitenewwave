#!/web/trimetru/python/bin/python2.6
# -*- coding: utf-8 -*-
# This Python file uses the following encoding: utf-8
 
import string
import os
import sys
import gzip
import cStringIO
 
def compressBuf(buf):
    zbuf = cStringIO.StringIO()
    zfile = gzip.GzipFile(mode = 'wb',  fileobj = zbuf, compresslevel = 6)
    zfile.write(buf)
    zfile.close()
    return zbuf.getvalue()
 
def testAcceptsGzip():
    acceptsGzip = 0
    try:
        if string.find(os.environ["HTTP_ACCEPT_ENCODING"], "gzip") != -1:
            acceptsGzip = 1
    except:
        pass
    return acceptsGzip
 
def sendHtml(buf):
    sys.stdout.write("Content-type: text/html\r\n")
    if testAcceptsGzip():
        zbuf = compressBuf(buf)
        sys.stdout.write("Content-Encoding: gzip\r\n")
        sys.stdout.write("Content-Length: %d\r\n" % (len(zbuf)))
        sys.stdout.write("\r\n")
        sys.stdout.write(zbuf)
    else:
        sys.stdout.write("\r\n")
        sys.stdout.write(buf)
 
myHtml = """<html><body><h1>hello compressed world!</h1></body></html>"""
sendHtml(myHtml)