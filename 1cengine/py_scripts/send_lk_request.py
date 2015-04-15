#!/web/trimetru/python/bin/python2.6
# -*- coding:utf-8 -*-

import sys
import os
import cgi
import cgitb; cgitb.enable()
import smtplib
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email import Encoders
from email.MIMEBase import MIMEBase
from email.header import Header

from email.utils import COMMASPACE, formatdate

sys.path.insert(0, os.path.expanduser('~/site/python'))
reload(sys)
sys.setdefaultencoding('utf-8')

print ("Content-Type: text/html; charset=utf-8\n")


# filelink = get_file_link(uid)

me = "admin@trimet.ru"
you = ["otwo@trimet.ru", "webmaster@trimet.ru", "parshin@trimet.ru", "aleksey@trimet.ru"]



msg_text = """
    Добрый день, <br />
    <p>Кто то хочет получить доступ к личому кабинету на сайте trimet.ru</p>
    <p>Его заявление находится во вложении</p>
    <hr color=lightgrey />
    <font color=grey><small><i><tt>С уважением, роботы сайта trimet.ru</tt></i></small></font>
"""

msg = MIMEMultipart(
    From=me,
    To=COMMASPACE.join(you),
    Date=formatdate(localtime=True)
)

msg['Subject'] = Header("Зпрос на получение доступа к ЛК trimet.ru", "utf-8")

# msg.set_charset("utf-8")

msg.attach(MIMEText(msg_text.encode('utf-8'), "html", "utf-8"))

# import requests

# r = requests.get(filelink)

form = cgi.FieldStorage()
if not form.has_key("myfile"):
    pass
else:
    fileitem = form["myfile"]
    # if not fileitem.file: return
    # fout = file (os.path.join(upload_dir, fileitem.filename), 'wb')
    # while 1:
    #     chunk = fileitem.file.read(100000)
    #     if not chunk: break
    #     fout.write (chunk)
    # fout.close()



    attachment = MIMEBase('application', "octet-stream")

    file_to_send_name = fileitem.filename

    attachment.set_payload( fileitem.file.read() )
    Encoders.encode_base64(attachment)
    attachment.add_header('Content-Disposition', 'attachment; filename="%s"'
               % file_to_send_name)
    msg.attach(attachment)



    s = smtplib.SMTP('localhost')
    s.sendmail(me, you, msg.as_string())
    s.quit()
