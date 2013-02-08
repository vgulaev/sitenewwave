#!/web/trimetru/python/bin/python2.6
# -*- coding:utf-8 -*-

import sys, os
import cgi
import cgitb; cgitb.enable()
import Cookie, datetime, random
import HTMLParser

lib_path = os.path.abspath('../../')
sys.path.append(lib_path)

_PATH_ = os.path.abspath(os.path.dirname(__file__))

import imp
python_lib_name = "1c_user_interaction"
user_1c_lib = imp.load_source(python_lib_name, _PATH_+"/"+python_lib_name+".py")

from secrets import *

class User():
    def __init__(self):
        self.connector = myDBC("users")
        self.cursor = self.connector.dbConnect()
        self.uid = ""
        self.sid = ""

    def is_valid_email(self,email):
        row = self.connector.dbExecute("""
                SELECT `users`.`id` 
                FROM `users`
                WHERE `users`.`email`='"""+email+"""'
            """)

        if row.__len__() > 0:
            return False
        else:
            return True

    def check_user(self,email,passwd):
        print email," >> ", passwd
        row = self.connector.dbExecute("""
                SELECT `users`.`id` 
                FROM `users`
                WHERE `users`.`email`='"""+email+"""' AND `users`.`passwdhash`='"""+passwd+"""'
            """)

        print row

        if row.__len__() > 0:
            self.uid = row[0][0]
            # print row[0][0]
            return row[0][0]
        else:
            return False

    def new_user(self,email,passwd):
        email = email.replace("%40", "@")
        if self.is_valid_email(email) == True:
            row = self.connector.dbExecute("""
                INSERT INTO `trimetru_users`.`users` (`id`,`email`,`passwdhash`,`1cuid`)
                VALUE (Null,'"""+email+"""','"""+passwd+"""',"")
            """)

            self.uid = self.cursor.lastrowid
            user_1c = user_1c_lib.User1C()
            print user_1c.register_user_1c(email,passwd)
            return self.generate_SID(self.uid)

        else:
            return "Username is taken"

    def check_SID(self):
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

    def generate_SID(self, uid):
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

    def set_session(self, uid):
        sid = self.generate_SID(uid)
        expiration = datetime.datetime.now() + datetime.timedelta(days=30)
        cookie = Cookie.SimpleCookie()
        cookie["sid"] = sid
        cookie["sid"]["domain"] = ".sitenewwave.dev"
        cookie["sid"]["path"] = "/"
        cookie["sid"]["expires"] = \
          expiration.strftime("%a, %d-%b-%Y %H:%M:%S PST")

        return sid

    def insert_1c_uid(self, uid, uid1c):
        pass

    def test_session(self):
        # print 0
        if self.check_SID():
            return "Passed"
        else:
            return "Failed"

    def authorize(self):
        if is_new == False:
            if email != False:
                uid = self.check_user(email,passwd)
                # print passwd
                if uid != False:
                    c=self.set_session(uid)
                    user_1c = user_1c_lib.User1C()
                    uid1c = user_1c.authorize_user_1c(email,passwd)
                    if not "Произошла ошибка" in uid1c:
                        self.insert_1c_uid(uid, uid1c)
                    return """ 
                        <p>Authorized</p>
                        <script type="text/javascript">
                            $(document).ready( function(){
                                    $.cookie("sid","")
                                    $.cookie("sid",\""""+str(c)+"""\")
                                    // alert('"""+str(c)+"""')
                                    window.location = "/kabinet/authorization/"
                                })
                        </script>
                    """
                else:
                    return """
                        <p>No such user</p>
                        <script type="text/javascript">
                            $(document).ready( function(){
                                    $.cookie("sid","")
                                })
                        </script>
                    """
                    
            else:
                return """
                    <p>No email</p>
                    
                """
        else:
            self.new_user(email,passwd)



def __main__(funkt=False):

    user = User()
    if funkt=="check_user":
        uid = user.check_user(email,passwd)
        user.set_session(uid)

    elif funkt=="new_user":
        uid = user.new_user(email,passwd)
        # print uid
        user.set_session(uid)

    elif funkt!=False:
        # print "user."+funkt
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
    email = email.replace("%40", "@")
else:
    email = False

if "passwd" in post:
    passwd = post["passwd"]
else:
    passwd = False

if "new_user" in post:
    is_new = post["new_user"]
    if is_new == "on":
        is_new = True
    else:
        is_new = False
else:
    is_new = False

if "funkt" in post:
    funkt = post["funkt"]
    __main__(funkt)

