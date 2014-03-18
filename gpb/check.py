#!/web/trimetru/python/bin/python2.6
# -*- coding:utf-8 -*-

import sys
import os
import cgi
import cgitb
cgitb.enable()

print("Content-Type: text/xml; charset=utf-8\n")

print("""<?xml version='1.0' encoding='UTF-8'?>
    <payment-avail-response>
      <result>
        <code>1</code>
        <desc>426669</desc>
      </result>
      <purchase>
        <shortDesc> </shortDesc>
        <longDesc>Zakaz #426669</longDesc>
        <account-amount>
          <id>CB4E2E881BEC16145B7DA0AB2278A19D</id>
          <amount>10000</amount>
          <currency>643</currency>
          <exponent>2</exponent>
        </account-amount>
      </purchase>
    </payment-avail-response>
""")

form = cgi.FieldStorage()

f = open('/web/trimetru/site/www/gpbtest.txt', 'w')

if "o.uid" in form:
    f.write(form["o.uid"].value)
else:
    f.write("Hell No!")

f.close
