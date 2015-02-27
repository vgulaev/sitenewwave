#!/web/trimetru/python/bin/python2.6
# -*- coding:utf-8 -*-

import sys
import os
import string
import random
import hashlib
import smtplib
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email import Encoders
from email.MIMEBase import MIMEBase

from email.utils import COMMASPACE, formatdate

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


_DEVELOPING_ADDRESS_ = "http://192.168.194.27/trimet_trade_fedorov/ws/"
# _DEVELOPING_ADDRESS_ = "http://192.168.194.14/trimet_trade/ws/"
_PRODUCTION_ADDRESS_ = "http://195.239.221.58:30082/trimet_trade/ws/"

if "dev" in os.environ["SERVER_NAME"]:
    _CURRENT_ADDRESS_ = _DEVELOPING_ADDRESS_
else:
    _CURRENT_ADDRESS_ = _PRODUCTION_ADDRESS_

def get_file_link(uid):

    client = Client(_CURRENT_ADDRESS_ + 'OrderKlient.1cws?wsdl',
                        location=_CURRENT_ADDRESS_ + "OrderKlient.1cws")


        # client.set_options(cache=None)
    client.set_options(cache=DocumentCache())

    result = client.service.GetFileLink(uid, "pdf")

    if "Well" in result:
        return "http://195.239.221.58:30080/download/{0}.pdf".format(uid)
    else:
        return False


def mail_order_to_client(mail, onumber, uid, accepted, fname, phones, regresult, pwd):

    filelink = get_file_link(uid)

    me = "admin@trimet.ru"
    you = mail

    if regresult:
        pwd_link = "<p>Для входа используйте указанный вами email и следующий пароль: <strong>{0}</strong></p>".format(pwd)
    else:
        pwd_link = 0

    if accepted:
        payment_link = "<p>Вы можете оплатить свой заказ онлайн по <a href='https://trimet.ru/payment/{0}'>ссылке</a></p>".format(uid)
    else:
        payment_link = ""

    msg_text = """
        Добрый день, <br />
        <p>Вы заказали металл на сайте компании Тримет.</p>
        <p>Ваш заказ получен отделом продаж и будет обработан менеджером.</p>
        <p>После обработки изменится статус заказа, информация об этом придёт на электронную почту</p>
        <p>Номер вашего заказа: <strong>{0}</strong></p>;
        <p>Вы можете просмотреть свои заказы в
        <a href="https://trimet.ru/kabinet/">личном кабинете</a></p>
        {1}
        {2}
        <p>Контактный телефон: +7 (3452) 520-670</p>
        <p>С уважением, компания Тримет</p>
    """.format(
        onumber,
        pwd_link,
        payment_link
    )

    msg = MIMEMultipart(
        From=me,
        To=you,
        Date=formatdate(localtime=True),
        Subject="On-line shop trimet.ru"
    )

    # msg.set_charset("utf-8")

    msg.attach(MIMEText(msg_text, "html"))

    import requests

    r = requests.get(filelink)

    # with open(r, "rb") as fil:
    #     msg.attach(MIMEApplication(
    #         fil.read(),
    #         Content_Disposition='attachment; filename="%s"' % onumber+".pdf"
    #     ))


    # msg.attach(MIMEApplication(
    #     r.content,
    #     Content_Disposition='attachment; filename="%s"' % onumber+".pdf"
    # ))

    attachment = MIMEBase('application', "octet-stream")

    header = "Content_Disposition='attachment; filename=" + onumber + ".pdf"

    attachment.set_payload( r.content )
    Encoders.encode_base64(attachment)
    attachment.add_header(*header)
    msg.attach(attachment)



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


if "mail" in post:
    mail = post["mail"]
    mail = mail.replace("%40", "@")
else:
    mail = False

if "uid" in post:
    uid = post["uid"]
else:
    uid = False

if "accepted" in post:
    accepted = post["accepted"]
else:
    accepted = False

if "phones" in post:
    phones = post["phones"]
else:
    phones = False

if "fname" in post:
    fname = post["fname"]
else:
    fname = False

if "regresult" in post:
    regresult = post["regresult"]
else:
    regresult = False

if "pwd" in post:
    pwd = post["pwd"]
else:
    pwd = False

if "onumber" in post:
    onumber = post["onumber"]
else:
    onumber = False

if mail:
    mail_order_to_client(
        mail, onumber, uid, accepted, fname, phones, regresult, pwd
    )
