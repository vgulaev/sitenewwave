#!/web/trimetru/python/bin/python2.6
# -*- coding: utf-8 -*-


import sys
import os
import cgi
import cgitb
cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))
from bs4 import BeautifulSoup

soup = BeautifulSoup()

import json

print "Content-Type: text/html; charset=utf-8\n"

class Overall():
    def __init__(self, M, rez_array):
        self.unit_array = []
        self.M = M
        self.rez_array = sorted(rez_array, key=lambda x: x[0], reverse=True)
        self.last = self.rez_array.__len__()

    def fill_unit_array(self):
        # print self.last
        if self.last < 1:
            return "SUCCESS"
        else:
            unit = Unit(self.M)
            # print "taking new unit"
            remove_rez_list = []
            for rez in self.rez_array:
                # print self.rez_array
                # print "working with: ", rez[0]

                while 1:
                    if rez[1] != 0:
                        r = unit.add_part(rez[0])
                        if r:
                            rez[1] = rez[1] - 1
                            # print "added ", rez[0], " : ", rez[1], " left"
                        else:
                            break
                    else:
                        break
                if rez[1] is 0:
                    # print rez[0], " remove ", rez[1]
                    self.last = self.last - 1
                    remove_rez_list.append(rez)


            for rez in remove_rez_list:
                self.rez_array.remove(rez)

            self.unit_array.append(unit)

            self.fill_unit_array()



class Unit():
    def __init__(self, length):
        self.length = length
        self.leftovers = length
        self.part_array = []

    def add_part(self, part):
        if part <= self.leftovers:
            self.leftovers = self.leftovers - part
            self.part_array.append(part)
            return True
        else:
            return False


def __main__():
    M = 6.0

    x = [2.0, 11]
    y = [3.0, 7]
    z = [4.0, 4]
    n = [1.34, 8]

    rez_array = [x, y, z]

    ov = Overall(M, rez_array)
    ov.fill_unit_array()
    for unit in ov.unit_array:
        string = "["
        t_arr = []
        for part in unit.part_array:
            t_arr.append(int(part)*"..")
        if unit.leftovers != 0:
            if int(unit.leftovers) is 0:
                t_arr.append(".")
            else:
                t_arr.append(int(unit.leftovers)*"..")
        t_string = "||".join(t_arr)
        string = string + t_string + "]"
        print unit.part_array
        print string
    # pass

# __main__()


form = cgi.FieldStorage()
if "rezka_array" in form:
    data = json.loads(form["rezka_array"].value)
    rez_array = []
    for z in data:
        z_array = [float(z[0]), int(z[1])]
        rez_array.append(z_array)

    M = float(form["M"].value)

    ov = Overall(M, rez_array)
    ov.fill_unit_array()

    div_wrapper = soup.new_tag("div")
    div_wrapper["class"] = "rezka_show_wrapper"

    rez_count = 0

    leftovers = {}

    for unit in ov.unit_array:

        div_unit = soup.new_tag("div")
        div_unit["class"] = "rezka_unit"

        # string = "["
        # t_arr = []
        for part in unit.part_array:
            width_p = (part/M*100)
            div_part = soup.new_tag("div")
            div_part["style"] = "width:{0}%".format(width_p)
            div_part.append(str(part))

            div_unit.append(div_part)


            rez_count = rez_count + 1
        #     t_arr.append(int(part)*"..")
        if unit.leftovers == 0:
            rez_count = rez_count - 1

        if unit.leftovers != 0:
            if unit.leftovers in leftovers:
                leftovers[unit.leftovers] = leftovers[unit.leftovers] + 1
            else:
                leftovers[unit.leftovers] = 1
        #     if int(unit.leftovers) is 0:
        #         t_arr.append(".")
        #     else:
        #         t_arr.append(int(unit.leftovers)*"..")
        div_wrapper.append(div_unit)

        # t_string = "||".join(t_arr)
        # string = string + t_string + "]"
        # print unit.part_array
        # print string
    ll = []
    for key in leftovers:
        l_string = "{0}x{1}".format(leftovers[key], key)
        ll.append(l_string)
    leftovers_string = " ;  ".join(ll)

    div_wrapper["rez_count"] = rez_count
    div_wrapper["leftovers"] = leftovers_string
    print str(div_wrapper)
