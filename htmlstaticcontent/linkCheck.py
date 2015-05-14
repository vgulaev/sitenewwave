# -*- coding: utf-8 -*-

import sys,os,re

_PATH = os.path.abspath(os.path.dirname(__file__))

dirList = os.listdir(_PATH)
# print dirList

for dirname in dirList: 
    dirpath = os.path.join(_PATH, dirname)
    filename = os.path.join(dirpath, 'index.html')
    # print filename
    if os.path.exists(filename):
        # print filename
        html_file_name = filename
        html_file = open(html_file_name,'r')
        html_file_string = html_file.read()
        html_file.close()

        # pLink = re.compile(r"<a\shref=\".*\"\stitle=\".*\">|<a\stitle=\".*\"\shref=\".*\"\s>")
        # links = pLink.findall(html_file_string)

        nLink = re.compile(r"/about/news/")
        links = nLink.findall(html_file_string)

        # print links

        for link in links:
            html_file_string = html_file_string.replace(link, "/wordpress/")
            print filename, " | ", link, " : ", "done"

            


        # print links

        # link_array = {}

        # hLink = re.compile(r"href=\".*\"")


        # for link in links:
        #     h_links = hLink.findall(link)
        #     for h_link in h_links:
        #         if h_link in link_array:
        #             if not 'rel="nofollow"' in link:
        #                 new_link = link.replace(">",' rel="nofollow">')
        #                 link_array[h_link] = link_array[h_link] + 1

        #         else:
        #             link_array[h_link] = 0

        # for link in link_array:
        #     # print link_array[link]
        #     if link_array[link]>0:
        #         print link, " : ", link_array[link]

        #         html_file_string = html_file_string.replace(link, link+' rel="nofollow"', 1)

        
        html_file_name = filename
        html_file = open(html_file_name,'w')

        html_file.write(html_file_string)
        html_file.close()