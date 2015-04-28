# -*- coding:utf-8 -*-

import string
import random
import hashlib

def form_new_passwd():
    passwd_str = ''.join(
        random.choice(string.letters+(string.digits*2)) for i in xrange(10))
    return passwd_str

passwd = form_new_passwd()
hash_passwd = hashlib.sha256(passwd).hexdigest()

print passwd + " :: " + hash_passwd
