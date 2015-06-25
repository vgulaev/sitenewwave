#!/web/trimetru/python/bin/python2.6
#-*- coding:utf-8 -*-

# Import smtplib for the actual sending function
import smtplib
import cgi
import cgitb; cgitb.enable()
import os
import Cookie

# from mail_addresses import *

print ("Content-Type: text/html; charset=utf-8")
print ("")

_PATH_ = os.path.abspath(os.path.dirname(__file__))

import imp

def get_user_info():

    python_lib_name = "user"
    user_lib = imp.load_source(
        python_lib_name, _PATH_ + "/" + python_lib_name + ".py")

    if user_lib.__main__("check_SID()") is True:
        cookie = Cookie.SimpleCookie(os.environ["HTTP_COOKIE"])
        sid = cookie["sid"].value
        # print sid
        uid_1c = user_lib.__main__("get_1c_sid('" + sid + "')")

    else:
        return None

    python_lib_name = "1c_user_interaction"
    user_1c_lib = imp.load_source(
        python_lib_name, _PATH_ + "/" + python_lib_name + ".py")

    user_1c = user_1c_lib.User1C()
    user_data = user_1c.get_user_information(uid_1c)
    # print user_data[8]

    return user_data



# Import the email modules we'll need
from email.mime.text import MIMEText

form = cgi.FieldStorage()

if form.has_key("text"):
    from_sender = form["text"].value
else:
    from_sender = ""


user = get_user_info()

text = """Пришло обращение в техподдержку с сайта trimet.ru\n
Текст сообщение: \n --- \n"""+from_sender+""" \n --- \n
Информация по пользователю: \n""" + user + """
"""

msg = MIMEText(text, "plain", "utf-8")

sender = "webmaster@trimet.ru"
# receiver = [main_mail, market_mail, admin_mail1, admin_mail2]
receiver = ["fedorov@trimet.ru"]
msg['Subject'] = 'Запрос в техподдрежку из личного кабинета сайта trimet.ru'
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
