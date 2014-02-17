#!/web/trimetru/python/bin/python2.6
# -*- coding:utf-8 -*-

import sys
import os
import cgi
import cgitb
cgitb.enable()

print("Content-Type: text/xml; charset=utf-8\n")

print("""<?xml version='1.0' encoding='UTF-8'?>
    <register-payment-response>
       <result>
          <code>1</code>
          <desc>OK</desc>
       </result>
</register-payment-response>
""")