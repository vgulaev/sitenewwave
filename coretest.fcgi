#!/web/trimetru/python/bin/python2.6
# -*- coding: utf-8 -*-
# This Python file uses the following encoding: utf-8

from cgi import escape
import sys, os
from flup.server.fcgi import WSGIServer

def app(environ, start_response):
    start_response('200 OK', [('Content-Type', 'text/html')])

    yield 'hello!!!'
    # yield '<table>'
    # for k, v in sorted(environ.items()):
         # yield '<tr><th>%s</th><td>%s</td></tr>' % (escape(k), escape(v))
    # yield '</table>'

WSGIServer(app).run()