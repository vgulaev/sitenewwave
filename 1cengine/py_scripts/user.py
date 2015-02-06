#!/web/trimetru/python/bin/python2.6
# -*- coding:utf-8 -*-

import sys
import os
import cgi
import cgitb
cgitb.enable()
import Cookie
import datetime
import random
import HTMLParser
import imp

lib_path = os.path.abspath('../py_scripts/')
sys.path.append(lib_path)

_PATH_ = os.path.abspath(os.path.dirname(__file__))

python_lib_name = "1c_user_interaction"
user_1c_lib = imp.load_source(
    python_lib_name, _PATH_ + "/" + python_lib_name + ".py")

py_scripts_path = os.path.expanduser('~/web/sitenewwave/1cengine/py_scripts/') #development
# py_scripts_path = os.path.expanduser('~/site/www/1cengine/py_scripts/') #production

# print lib_path
secrets_lib_name = "secrets"
secrets_lib_path = "structures/secrets.py"
secrets = imp.load_source(
    secrets_lib_name,
    _PATH_ + "/" + secrets_lib_path
)

myDBC = secrets.myDBC


class User():

    def __init__(self):
        self.connector = myDBC("users")
        self.cursor = self.connector.dbConnect()
        self.uid = ""
        self.sid = ""

    def is_valid_email(self, email):
        row = self.connector.dbExecute("""
                SELECT `users`.`id`
                FROM `users`
                WHERE `users`.`email`='""" + email + """'
            """)

        if row.__len__() > 0:
            # print 11
            return False
        else:
            # print 22
            return True

    def check_user(self, email, passwd):
        # print email," >> ", passwd
        row = self.connector.dbExecute("""
                SELECT `users`.`id`
                FROM `users`
                WHERE `users`.`email`='""" + email + """'
                AND `users`.`passwdhash`='""" + passwd + """'
            """)

        # print row

        if row.__len__() > 0:
            self.uid = row[0][0]
            # print row[0][0]
            return row[0][0]
        else:
            return self.get_user_1c(email, passwd)

    def get_user_1c(self, email, passwd):
        user_1c = user_1c_lib.User1C()
        uid1c = user_1c.authorize_user_1c(email, passwd)
        # print uid1c

        if not "Произошла ошибка" in uid1c:
            row = self.connector.dbExecute("""
                INSERT INTO `trimetru_users`.`users`
                (`id`,`email`,`passwdhash`,`1cuid`)
                VALUE (Null,'""" + email + """','""" + passwd + """',"")
            """)

            return self.cursor.lastrowid
        else:
            return False

    def new_user(self, email, passwd):
        email = email.replace("%40", "@")
        # print 50
        if self.is_valid_email(email) is True:
            row = self.connector.dbExecute("""
                INSERT INTO `trimetru_users`.`users`
                (`id`,`email`,`passwdhash`,`1cuid`)
                VALUE (Null,'""" + email + """','""" + passwd + """',"")
            """)

            self.uid = self.cursor.lastrowid
            user_1c = user_1c_lib.User1C()
            k = user_1c.register_user_1c(email, passwd)
            # print "k:",k
            # print user_1c.register_user_1c(email,passwd)
            # return self.uid
            # self.generate_SID(self.uid)

        else:
            return False

    def is_uid_SID_linked(self, uid, ip_reg):
        row = self.connector.dbExecute("""
                SELECT `uids`.`sid`
                FROM `uids`
                WHERE `uids`.`id_user` = '""" + str(uid) + """'
                AND `uids`.`ip_reg` ='""" + str(ip_reg) + """'
            """)

        if row.__len__() > 0:
            return row[0][0]
        else:
            return False

    def is_1c_uid_linked(self, uid):
        row.connector.dbExecute("""
                SELECT `users`.`1cuid`
                FROM `uids`
                WHERE `uids`.`id` = '""" + str(uid) + """'
            """)

        if row.__len__() > 0:
            return row[0][0]
        else:
            return False

    def get_1c_sid(self, sid):
        row = self.connector.dbExecute("""
                SELECT `users`.`1cuid`
                FROM `users`,`uids`
                WHERE `uids`.`sid`='""" + sid + """'
                AND `users`.`id`=`uids`.`id_user`
            """)

        if row.__len__() > 0:
            return row[0][0]
        else:
            return False

    def check_SID(self):
        try:
            cookie = Cookie.SimpleCookie(os.environ["HTTP_COOKIE"])
            # print 1
            # print " <<< ",cookie, " >>> "
            if "sid" in cookie:
                # print cookie["sid"].value
                row = self.connector.dbExecute("""
                    SELECT `uids`.`ip_reg`
                    FROM `uids`
                    WHERE `uids`.`sid`='""" + cookie["sid"].value + """'
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
        import uuid
        import OpenSSL
        # print uid
        self.sid = uuid.UUID(bytes=OpenSSL.rand.bytes(16))
        today = datetime.datetime.now()
        user_ip = cgi.escape(os.environ["REMOTE_ADDR"])
        if self.is_uid_SID_linked(uid, user_ip) is False:
            row = self.connector.dbExecute("""
                    INSERT INTO `trimetru_users`.`uids`
                    (`id_user`,`sid`,`date`,`ip_reg`)
                    VALUES ('""" + str(uid) + """',
                        '""" + str(self.sid) + """',''
                        ,'""" + str(user_ip) + """')
                """)
        else:
            row = self.connector.dbExecute("""
                    UPDATE `trimetru_users`.`uids`
                    SET `sid` = '""" + str(self.sid) + """'
                    WHERE `id_user`='""" + str(uid) + """'
                    AND `ip_reg`='""" + str(user_ip) + """'
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
            SET `1cuid` = '""" + str(uid1c) + """'
            WHERE `id` = '""" + str(uid) + """'
            """)

        if row.__len__() > 0:
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
        if is_new is False:
            if email is not False:
                uid = self.check_user(email, passwd)
                # print passwd
                # print uid
                if uid is not False:
                    c = self.set_session(uid)
                    user_1c = user_1c_lib.User1C()
                    uid1c = user_1c.authorize_user_1c(email, passwd)
                    # print uid1c
                    if not "Произошла ошибка" in uid1c:
                        self.insert_1c_uid(uid, uid1c)
                    # print "nya"
                    # print c
                    return """
                            $.removeCookie("sid",{ expires: 30, path: '/'});
                            $.cookie("sid",
                                \"""" + str(c) + """\",
                                { expires: 30, path: '/'})
                            $.unblockUI()
                            window.location = "/kabinet/orders/"
                    """
                else:

                    message = "\
                        <p>Пользователь с таким логином и паролем не найден</p>\
                        <div class='reset_close'>Закрыть</div>\
                    "
                    return """
                            $.removeCookie("sid",{ expires: 30, path: '/'})
                            $(".authorize_message").html(" """ + message + """ ")
                    """

            else:
                return """
                    <div>
                    <script type="text/javascript">
                            $(document).ready( function(){
                            // $.removeCookie("sid",{ expires: 30, path: '/'})
                                })
                        </script>
                    </div>
                """
        else:
            uid = self.new_user(email, passwd)
            if uid is not False:
                c = self.set_session(uid)
                user_1c = user_1c_lib.User1C()
                uid1c = user_1c.authorize_user_1c(email, passwd)
                # print uid1c
                if not "Произошла ошибка" in uid1c:
                    self.insert_1c_uid(uid, uid1c)
                return """
                        <div>
                        <script type="text/javascript">
                            $(document).ready( function(){
                                    $.removeCookie("sid",
                                        { expires: 30, path: '/'});
                                    $.cookie("sid",
                                        \"""" + str(c) + """\",
                                        { expires: 30, path: '/'})
                                    // alert('""" + str(c) + """')

                                    window.location = "/kabinet/orders/"
                                })
                        </script>
                        </div>
                    """
            else:
                return """
                    <div>
                    <script type="text/javascript">
                        $(document).ready( function(){
                                alert('Пользователь уже существует!')
                                // window.location = "/kabinet/authorization/"
                            })
                    </script>
                    </div>
                """

    def who_am_i(self):
        cookie = Cookie.SimpleCookie(os.environ["HTTP_COOKIE"])
        if "sid" in cookie:
            sid = cookie["sid"].value
        else:
            return None

        row = self.connector.dbExecute("""
                SELECT `email`
                FROM `trimetru_users`.`users`, `trimetru_users`.`uids`
                WHERE `users`.`id` = `uids`.`id_user`
                AND `uids`.`sid` = '""" + sid + """'
            """)

        if row.__len__() > 0:
            return row[0][0]
        else:
            return None

    def check_passwd(self, passwd):
        cookie = Cookie.SimpleCookie(os.environ["HTTP_COOKIE"])
        if "sid" in cookie:
            sid = cookie["sid"].value
        else:
            return None

        row = self.connector.dbExecute("""
                SELECT `passwdhash`
                FROM `trimetru_users`.`users`
                WHERE `passwdhash`='""" + passwd + """'
            """)

        if row.__len__() > 0:
            return True
        else:
            return False

    def update_passwd(self, passwd, old_passwd):

        cookie = Cookie.SimpleCookie(os.environ["HTTP_COOKIE"])
        if "sid" in cookie:
            sid = cookie["sid"].value
        else:
            return "Что то пошло не так, попробуйте позже"

        if self.check_passwd(old_passwd):
            row = self.connector.dbExecute("""
                        UPDATE `trimetru_users`.`users`
                        SET `passwdhash` = '""" + passwd + """'
                        WHERE (
                            SELECT `id_user`
                            FROM `trimetru_users`.`uids`
                            WHERE `sid`='""" + sid + """'
                        ) = `id` AND `passwdhash`='""" + old_passwd + """'
                    """)

            uid1c = self.get_1c_sid(sid)

            user1c = user_1c_lib.User1C()

            user1c.change_passwd_1c(uid1c, passwd)

            return "Вы успешно сменили пароль!"
        else:
            return "Старый пароль указан неверно!"

    def change_passwd(self):
        # cookie = Cookie.SimpleCookie(os.environ["HTTP_COOKIE"])
        # sid = cookie["sid"].value
        # print sid
        sid = self.check_SID()
        if sid is True:

            return self.update_passwd(passwd, old_passwd)
        else:
            return "Вы не злогинены Оо"

    def update_fullname(self, fullname):
        cookie = Cookie.SimpleCookie(os.environ["HTTP_COOKIE"])
        if "sid" in cookie:
            sid = cookie["sid"].value
        else:
            return "Что то пошло не так, попробуйте позже"

        uid1c = self.get_1c_sid(sid)
        user1c = user_1c_lib.User1C()
        user1c.change_fio_1c(uid1c, fullname)

        return "Вы успешно сменили имя!"

    def change_fullname(self):
        sid = self.check_SID()
        if sid is True:
            return self.update_fullname(fullname)
        else:
            return "Вы не злогинены Оо"


def __main__(funkt=False):

    user = User()
    # if funkt=="check_user":
    #     uid = user.check_user(email,passwd)
    #     user.set_session(uid)

    # elif funkt=="new_user":
    #     uid = user.new_user(email,passwd)
    # print uid
    #     user.set_session(uid)
    # print 1
    if "is_valid_email" in funkt:
        # print funkt
        print("Content-Type: text/html; charset=utf-8\n")

        q = user.is_valid_email(email)
        print q

    elif "change_passwd" in funkt:
        print("Content-Type: text/html; charset=utf-8\n")

        q = user.change_passwd()

        print q

    elif "authorize_me" in funkt:
        print("Content-Type: text/html; charset=utf-8\n")

        q = user.authorize()

        print q

    elif funkt is not False:
        # print funkt
        # print "user."+funkt
        return eval("user." + funkt)

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

if "old_passwd" in post:
    old_passwd = post["old_passwd"]
else:
    old_passwd = False

if "newUser" in post:
    is_new = post["newUser"]
    if is_new == "on":
        is_new = True
    else:
        is_new = False
else:
    is_new = False

if "fullname" in post:
    fullname = post["fullname"]
else:
    fullname = ""

if "funkt" in post:
    funkt = post["funkt"]
    __main__(funkt)
