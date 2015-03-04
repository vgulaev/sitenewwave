#!/web/trimetru/python/bin/python2.6
# -*- coding:utf-8 -*-

import sys
import os
import datetime
import cgitb
import MySQLdb
import imp
cgitb.enable()

sys.path.insert(0, os.path.expanduser('~/site/python'))
reload(sys)
sys.setdefaultencoding('utf-8')

print ("Content-Type: text/html; charset=utf-8\n")

_PATH_ = os.path.abspath(os.path.dirname(__file__))

secrets_lib_name = "secrets"
secrets_lib_path = "structures/secrets.py"
secrets = imp.load_source(
    secrets_lib_name,
    _PATH_ + "/" + secrets_lib_path
)

database = secrets.databases["extra"]


def save_to_db(mail, phones, fname, onumber, sum):

    cdatetime = str(datetime.datetime.now())

    ip = os.environ["REMOTE_ADDR"]

    insert_text = """

        INSERT INTO `order_stat` (
            `datetime`, `mail`, `phones`,
            `fname`, `onumber`, `sum`, `ip`
        ) VALUES (
            '{0}', '{1}', '{2}', '{3}', '{4}', {5}, '{6}'
        )
    """.format(
        cdatetime, mail, phones,
        fname, onumber, sum, ip
    )

    conn = MySQLdb.connect(
        host=database["host"],
        user=database["user"],
        passwd=database["passwd"],
        db=database["db"]
    )

    conn.set_character_set('utf8')
    cursor = conn.cursor()

    cursor.execute('SET NAMES utf8;')

    cursor.execute(insert_text)
    conn.commit()

    cursor.close()
    conn.close()

    return "Ok"

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
    mail = ""

if "phones" in post:
    phones = post["phones"]
else:
    phones = ""

if "fname" in post:
    fname = post["fname"]
else:
    fname = ""

if "sum" in post:
    sum = post["sum"]
else:
    sum = ""

if "onumber" in post:
    onumber = post["onumber"]
else:
    onumber = ""

if mail:
    save_to_db(mail, phones, fname, onumber, sum)
