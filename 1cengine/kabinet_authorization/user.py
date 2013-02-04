#!/web/trimetru/python/bin/python2.6
# -*- coding:utf-8 -*-

import sys, os
import cgi
import cgitb; cgitb.enable()

lib_path = os.path.abspath('../../')
sys.path.append(lib_path)

from secrets import *

print ("Content-Type: text/html; charset=utf-8\n")

post = cgi.FieldStorage()
if "funkt" in post:
    funkt = post["funkt"].value
else:
    funkt = False

if "email" in post:
    email = post["email"].value
else:
    email = False

if "passwd" in post:
    passwd = post["passwd"].value
else:
    passwd = False



class User():
    def __init__(self):
        self.connector = myDBC("users")
        self.connector.dbConnect()

    def isValidEmail(self,email):
        row = self.connector.dbExecute("""
                SELECT `users`.`id` 
                FROM `users`
                WHERE `users`.`email`='"""+email+"""'
            """)

        if row.__len__() > 0:
            return False
        else:
            return True

    def checkUser(self,email,passwd):

        row = self.connector.dbExecute("""
                SELECT `users`.`id` 
                FROM `users`
                WHERE `users`.`email`='"""+email+"""' AND `users`.`passwdhash`='"""+passwd+"""'
            """)

        if row.__len__() > 0:
            print True
        else:
            print False

    def newUser(self,email,passwd):
        if self.isValidEmail(email) == True:
            row = self.connector.dbExecute("""
                INSERT INTO `trimetru_users`.`users` (`id`,`name`,`passwdhash`,`1cuid`)
                VALUSE (Null,"""+email+""","""+passwd+""","")
            """)

            return True

        else:
            return False

    def checkSID(self, uid):
        if post.has_key("sid"):
            row = self.connector.dbExecute("""
                SELECT `uids`.`reg_ip`
                FROM `uids`
                WHERE `uids`.`sid`='"""+post["sid"]+"""'
                """)
            if row.__len__() > 0:
                if row[0][0] == cgi.escape(os.environ["REMOTE_ADDR"]):
                    return True
                else:
                    return False
            else:
                return False
        else:
            return False

    def generateSID(self, uid):
        pass


def __main__():
    user = User()
    if funkt=="checkUser":
        user.checkUser(email,passwd)
    if funkt=="newUser":
        user.newUser(email,passwd)

    user.connector.dbClose()


__main__()
