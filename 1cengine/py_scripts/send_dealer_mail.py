#!/web/trimetru/python/bin/python2.6
# -*- coding:utf-8 -*-

import sys
import os
import string
import random
import hashlib
import smtplib
from email.mime.text import MIMEText

import cgitb
cgitb.enable()

sys.path.insert(0, os.path.expanduser('~/site/python'))
reload(sys)
sys.setdefaultencoding('utf-8')

print ("Content-Type: text/html; charset=utf-8\n")



def mail_dealer_offer(email, offer):
    me = "admin@trimet.ru"
    you = email

    msg = MIMEText("""
        Добрый день, <br />
        <p>Это интернет-каталог компании Тримет.</p>
        <p>Вы, или кто-то действующий от Вашего имени запросили сброс пароля входа в Личный Кабинет.<br />
        Ваш новый пароль: <strong>"""+passwd+"""</strong><br />
        Вы можете сменить пароль в Настройках в Личном Кабинете.</p>
        <hr color=lightgrey />
        <font color=grey><small><i><tt>С уважением, роботы сайта trimet.ru</tt></i></small></font>
        """, "html")

    msg["From"] = me
    msg["To"] = you
    msg["Subject"] = "Сброс пароля личного кабинета сайта trimet.ru"
    msg.set_charset("utf-8")


    s = smtplib.SMTP('localhost')
    s.sendmail(me, [you], msg.as_string())
    s.quit()



post = {}

if "POST_DATA" in os.environ:
    raw_post = os.environ["POST_DATA"]
else:
    raw_post = sys.stdin.read()

if raw_post != "":
    pre_post = raw_post.split("&")
    # print pre_post
    for variables in pre_post:
        # print variables
        key_var = str(variables).split("=")
        # print key_var
        post[key_var[0]] = key_var[1]

if "email" in post:
    email = post["email"]
    email = email.replace("%40", "@")
else:
    email = False

if "offer" in post:
    offer = post["offer"]
else:
    offer = False

if email:
    passwd = form_new_passwd()
    print reset_passwd(email, passwd)
