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

from suds.client import Client
from suds.cache import DocumentCache

import logging
logging.basicConfig(level=logging.INFO)
if __debug__:
    logging.getLogger('suds.client').setLevel(logging.DEBUG)
else:
    logging.getLogger('suds.client').setLevel(logging.CRITICAL)

_DEVELOPING_ADDRESS_ = "http://192.168.194.14/trimet_trade_fedorov/ws/"
# _DEVELOPING_ADDRESS_ = "http://192.168.194.14/trimet_trade/ws/"
_PRODUCTION_ADDRESS_ = "http://195.239.221.58:30080/trimet_trade/ws/"


if "dev" in os.environ["SERVER_NAME"]:
    _CURRENT_ADDRESS_ = _DEVELOPING_ADDRESS_
else:
    _CURRENT_ADDRESS_ = _PRODUCTION_ADDRESS_

# _CURRENT_ADDRESS_ = _DEVELOPING_ADDRESS_

def form_new_passwd():
    passwd_str = ''.join(
        random.choice(string.letters+(string.digits*2)) for i in xrange(10))
    return passwd_str


def mail_new_passwd(email, passwd):
    me = "admin@trimet.ru"
    you = email

    msg = MIMEText("""
        Добрый день, <br />
        <p>Это интернет-каталог компании Тримет.</p>
        <p>Вы, или кто-то действующий от Вашего имени запросили сброс пароля входа в Личный Кабинет.<br />
        Ваш новый пароль: <strong>"""+passwd+"""</strong><br />
        Вы можете сменить пароль в Настройках в <a href="https://trimet.ru/kabinet/">Личном Кабинете</a>.</p>
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


def reset_passwd(email, passwd):

    client = Client(_CURRENT_ADDRESS_ + "Register.1cws?wsdl",
                        location=_CURRENT_ADDRESS_ + "Register.1cws")
    client.set_options(cache=DocumentCache())

    result = client.service.ResetPasswd(email, hashlib.sha256(passwd).hexdigest())
        # print result

    if u"Успех" in result:
        mail_new_passwd(email, passwd)
        return "Пароль успешно сброшен. Новый пароль выслан на ваш адрес электронной почты"
    else:
        return "Пользователь с таким адресом электронной почты не зарегистрирован в нашей системе"

    # return result


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

if email:
    passwd = form_new_passwd()
    print reset_passwd(email, passwd)
