#!/web/trimetru/python/bin/python2.6
# -*- coding:utf-8 -*-

import sys, os
import cgi
import cgitb; cgitb.enable()
import Cookie, datetime, random
import HTMLParser

lib_path = os.path.abspath('../../')
sys.path.append(lib_path)

from secrets import *

class User():
    def __init__(self):
        self.connector = myDBC("users")
        self.cursor = self.connector.dbConnect()
        self.uid = ""
        self.sid = ""

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
        email = email.replace("%40", "@")
        # print email," >> ", passwd
        row = self.connector.dbExecute("""
                SELECT `users`.`id` 
                FROM `users`
                WHERE `users`.`email`='"""+email+"""' AND `users`.`passwdhash`='"""+passwd+"""'
            """)

        # print row

        if row.__len__() > 0:
            self.uid = row[0][0]
            # print row[0][0]
            return row[0][0]
        else:
            return False

    def newUser(self,email,passwd):
        if self.isValidEmail(email) == True:
            row = self.connector.dbExecute("""
                INSERT INTO `trimetru_users`.`users` (`id`,`email`,`passwdhash`,`1cuid`)
                VALUE (Null,'"""+email+"""','"""+passwd+"""',"")
            """)

            self.uid = self.cursor.lastrowid
            return self.uid

        else:
            return False

    def checkSID(self):
        try:
            cookie = Cookie.SimpleCookie(os.environ["HTTP_COOKIE"])
            # print 1
            # print " <<< ",cookie, " >>> "
            if cookie.has_key("sid"):
                # print cookie["sid"].value
                row = self.connector.dbExecute("""
                    SELECT `uids`.`ip_reg`
                    FROM `uids`
                    WHERE `uids`.`sid`='"""+cookie["sid"].value+"""'
                    """)
                # print row
                # print 3
                if row.__len__() > 0:
                    # print 5
                    # print row[0][0]
                    if row[0][0] == cgi.escape(os.environ["REMOTE_ADDR"]):
                        return True
                    else:
                        return False
                else:
                    return False
            else:
                # print 4
                return False
        except:
            return False

    def generateSID(self, uid):
        import uuid, OpenSSL
        # print uid
        self.sid = uuid.UUID(bytes = OpenSSL.rand.bytes(16))
        today = datetime.datetime.now()
        row = self.connector.dbExecute("""
            INSERT INTO `trimetru_users`.`uids` (`id_user`,`sid`,`date`,`ip_reg`)
            VALUES ('"""+str(uid)+"""','"""+str(self.sid)+"""','','"""+cgi.escape(os.environ["REMOTE_ADDR"])+"""')
            """)
        # print self.sid
        return self.sid

    def setSession(self, uid):
        sid = self.generateSID(uid)
        expiration = datetime.datetime.now() + datetime.timedelta(days=30)
        cookie = Cookie.SimpleCookie()
        cookie["sid"] = sid
        cookie["sid"]["domain"] = ".sitenewwave.dev"
        cookie["sid"]["path"] = "/"
        cookie["sid"]["expires"] = \
          expiration.strftime("%a, %d-%b-%Y %H:%M:%S PST")

        return sid

    def testSession(self):
        # print 0
        if self.checkSID():
            return "Passed"
        else:
            return "Failed"

    def authorize(self):
        if email != False:
            uid = self.checkUser(email,passwd)
            if uid:
                c=self.setSession(uid)
            else:
                return """
                    <p>No such user</p>
                    <script type="text/javascript">
                        $(document).ready( function(){
                                $.cookie("sid","")
                            })
                    </script>
                """
            # print "Set-Cookie: sid="+str(c)

            # os.environ["CUSTOM_COOKIES"] = c.output()
                print os.environ["HTTP_COOKIE"]
                return """ 
                    <p>Authorized</p>
                    <script type="text/javascript">
                        $(document).ready( function(){
                                $.cookie("sid","")
                                $.cookie("sid",\""""+str(c)+"""\")
                                // alert('"""+str(c)+"""')
                            })
                    </script>
                """
        else:
            return """
                <p>No email</p>
                <script type="text/javascript">
                    $(document).ready( function(){
                            $.cookie("sid","")
                        })
                </script>
            """



def __main__(funkt=False):


    user = User()
    if funkt=="checkUser":
        uid = user.checkUser(email,passwd)
        user.setSession(uid)

    elif funkt=="newUser":
        uid = user.newUser(email,passwd)
        # print uid
        user.setSession(uid)

    elif funkt!=False:
        return eval("user."+funkt)

    user.connector.dbClose()

# print ("Content-Type: text/html; charset=utf-8\n")

post = {}

if "POST_DATA" in os.environ:
    raw_post = os.environ["POST_DATA"]
# print raw_post


    pre_post = raw_post.split("&")
    # print pre_post
    for variables in pre_post:
        # print variables
        key_var = str(variables).split("=")
        # print key_var
        post[key_var[0]] = key_var[1]

# print post
if "email" in post:
    email = post["email"]
else:
    email = False

if "passwd" in post:
    passwd = post["passwd"]
else:
    passwd = False

if "funkt" in post:
    funkt = post["funkt"]
    __main__(funkt)

