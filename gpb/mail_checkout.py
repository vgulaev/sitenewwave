#!/web/trimetru/python/bin/python2.6
# -*- coding:utf-8 -*-

import sys
import os

import smtplib
from email.mime.text import MIMEText

import cgitb
cgitb.enable()

sys.path.insert(0, os.path.expanduser('~/site/python'))
reload(sys)
sys.setdefaultencoding('utf-8')


def mail_checkout(checkout_string, mail=""):
    me = "admin@trimet.ru"
    you = ["webmaster@trimet.ru", "parshin@trimet.ru"]

    msg = MIMEText(checkout_string, "html")

    msg["From"] = me
    msg["To"] = ", ".join(you)
    msg["Subject"] = "Чек покупателя"
    msg.set_charset("utf-8")

    s = smtplib.SMTP('localhost')
    s.sendmail(me, you, msg.as_string())
    s.quit()

    if mail is not "":
        me = "admin@trimet.ru"
        you = mail

        msg = MIMEText(checkout_string, "html")

        msg["From"] = me
        msg["To"] = you
        msg["Subject"] = "Чек оплаты заказа на сайте trimet.ru"
        msg.set_charset("utf-8")

        s = smtplib.SMTP('localhost')
        s.sendmail(me, [you], msg.as_string())
        s.quit()
