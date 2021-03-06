#!/web/trimetru/python/bin/python2.6
#-*- coding:utf-8 -*-

# Import smtplib for the actual sending function
import smtplib
import cgi
import cgitb; cgitb.enable()

from mail_addresses import *

print ("Content-Type: text/html; charset=utf-8")
print ("")

# Import the email modules we'll need
from email.mime.text import MIMEText

form = cgi.FieldStorage()

if form.has_key("from"):
    from_sender = form["from"].value
else:
    from_sender = ""

if form.has_key("message"):
    from_message = form["message"].value
else:
    from_message = ""

if form.has_key("name"):
    from_name = form["name"].value
else:
    from_name = ""

text = """Пришло сообщение с сайта trimet.ru\n
Пользователь указал адрес почты: """+from_sender+"""\n
Представился как: """+from_name+"""\n
Его сообщение: \n """+from_message+"""
"""

msg = MIMEText(text, "plain", "utf-8")

sender = "webmaster@trimet.ru"
receiver = [main_mail, market_mail, admin_mail1, admin_mail2]
msg['Subject'] = 'Отзыв/вопрос с trimet.ru'
msg['From'] = sender
msg['To'] =  ', '.join( receiver )

# msg = "From: "+sender+"\r\nTo: "+', '.join( receiver )+"\r\nSubject: "+"Отзыв/вопрос с trimet.ru"+"\r\n"+text

# Send the message via our own SMTP server, but don't include the
# envelope header.
s = smtplib.SMTP('localhost')
try:
    s.sendmail(sender, receiver, msg.as_string())
    print "True"
except:
    print "False"
s.quit()
