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
            # print 11
            return False
        else:
            # print 22
            return True

    def check_user(self,email,passwd):
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

    def new_user(self,email,passwd):
        email = email.replace("%40", "@")
        # print 50
        if self.is_valid_email(email) == True:
            row = self.connector.dbExecute("""
                INSERT INTO `trimetru_users`.`users` (`id`,`email`,`passwdhash`,`1cuid`)
                VALUE (Null,'"""+email+"""','"""+passwd+"""',"")
            """)

            self.uid = self.cursor.lastrowid
            user_1c = user_1c_lib.User1C()
            user_1c.register_user_1c(email,passwd)
            # print user_1c.register_user_1c(email,passwd)
            return self.uid 
            # self.generate_SID(self.uid)

        else:
            return False

    def is_uid_SID_linked(self,uid,ip_reg):
        row = self.connector.dbExecute("""
                SELECT `uids`.`sid`
                FROM `uids`
                WHERE `uids`.`id_user` = '"""+str(uid)+"""' AND `uids`.`ip_reg` ='"""+str(ip_reg)+"""'
            """)

        if row.__len__()>0:
            return row[0][0]
        else:
            return False

    def is_1c_uid_linked(self,uid):
        row.connector.dbExecute("""
                SELECT `users`.`1cuid`
                FROM `uids`
                WHERE `uids`.`id` = '"""+str(uid)+"""'
            """)

        if row.__len__()>0:
            return row[0][0]
        else:
            return False

    def get_1c_sid(self,sid):
        row = self.connector.dbExecute("""
                SELECT `users`.`1cuid`
                FROM `users`,`uids`
                WHERE `uids`.`sid`='"""+sid+"""' AND `users`.`id`=`uids`.`id_user`
            """)

        if row.__len__()>0:
            return row[0][0]
        else:
            return False

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
        user_ip = cgi.escape(os.environ["REMOTE_ADDR"])
        if self.is_uid_SID_linked(uid,user_ip) == False:
            row = self.connector.dbExecute("""
                    INSERT INTO `trimetru_users`.`uids` (`id_user`,`sid`,`date`,`ip_reg`)
                    VALUES ('"""+str(uid)+"""','"""+str(self.sid)+"""','','"""+str(user_ip)+"""')
                """)
        else:
            row = self.connector.dbExecute("""
                    UPDATE `trimetru_users`.`uids`
                    SET `sid` = '"""+str(self.sid)+"""'
                    WHERE `id_user`='"""+str(uid)+"""' AND `ip_reg`='"""+str(user_ip)+"""'
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
        row = self.connector.dbExecute("""
            UPDATE `trimetru_users`.`users`
            SET `1cuid` = '"""+str(uid1c)+"""'
            WHERE `id` = '"""+str(uid)+"""'
            """)
        
        if row.__len__()>0:
            return True
        else:
            return False

    def test_session(self):
        # print 0
        if self.check_SID():
            return ""
        else:
            return ""


    def authorize(self):
        if is_new == False:
            if email != False:
                uid = self.check_user(email,passwd)
                # print passwd
                print uid
                if uid != False:
                    c=self.set_session(uid)
                    user_1c = user_1c_lib.User1C()
                    uid1c = user_1c.authorize_user_1c(email,passwd)
                    # print uid1c
                    if not "Произошла ошибка" in uid1c:    
                        self.insert_1c_uid(uid, uid1c)
                    return """ 
                        <body>
                        <script type="text/javascript">
                            $(document).ready( function(){
                                    $.removeCookie("sid",{ expires: 30, path: '/'});
                                    // $.cookie("sid", "",{ expires: 30, path: '/'})
                                    $.cookie("sid",\""""+str(c)+"""\",{ expires: 30, path: '/'})
                                    // alert('"""+str(c)+"""')
                                    window.location = "/kabinet/authorization/"
                                })
                        </script>
                        </body>
                    """
                else:
                    return """
                        <body>
                        <script type="text/javascript">
                            $(document).ready( function(){
                                $.removeCookie("sid",{ expires: 30, path: '/'})
                                })
                        </script>
                        </body>
                    """
                    
            else:
                return """
                    <body>
                    <script type="text/javascript">
                            $(document).ready( function(){
                                    // $.removeCookie("sid",{ expires: 30, path: '/'})
                                })
                        </script>
                    </body>
                """
        else:
            uid = self.new_user(email,passwd)
            if uid != False:
                c = self.set_session(uid)
                return """ 
                        <body>
                        <script type="text/javascript">
                            $(document).ready( function(){
                                    $.removeCookie("sid",{ expires: 30, path: '/'});
                                    // $.cookie("sid", "",{ expires: 30, path: '/'})
                                    $.cookie("sid",\""""+str(c)+"""\",{ expires: 30, path: '/'})
                                    // alert('"""+str(c)+"""')
                                    window.location = "/kabinet/authorization/"
                                })
                        </script>
                        </body>
                    """
            else:
                return """
                    <body>
                    <script type="text/javascript">
                        $(document).ready( function(){
                                alert('Пользователь уже существует!')
                                // window.location = "/kabinet/authorization/"
                            })
                    </script>
                    </body>
                """



def __main__(funkt=False):

    user = User()
    # if funkt=="check_user":
    #     uid = user.check_user(email,passwd)
    #     user.set_session(uid)

    # elif funkt=="new_user":
    #     uid = user.new_user(email,passwd)
    #     # print uid
    #     user.set_session(uid)
    # print 1
    if "is_valid_email" in funkt:
        # print funkt
        print ("Content-Type: text/html; charset=utf-8\n")

        q = user.is_valid_email(email)
        print q


    elif funkt!=False:
        # print funkt
        # print "user."+funkt
        return eval("user."+funkt)

    user.connector.dbClose()

# print ("Content-Type: text/html; charset=utf-8\n")

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

if "passwd" in post:
    passwd = post["passwd"]
else:
    passwd = False

if "newUser" in post:
    is_new = post["newUser"]
    if is_new == "on":
        is_new = True
    else:
        is_new = False
else:
    is_new = False

if "funkt" in post:
    funkt = post["funkt"]
    __main__(funkt)

