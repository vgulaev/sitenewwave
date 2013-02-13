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
        print filename
        html_file_name = filename
        html_file = open(html_file_name,'r')
        html_file_string = html_file.read()
        html_file.close()

        pLink = re.compile(r"<a\shref=\".*\"\stitle=\".*\">|<a\stitle=\".*\"\shref=\".*\"\s>")
        links = pLink.findall(html_file_string)

        # print links

        link_array = {}

        hLink = re.compile(r"href=\".*\"")


        for link in links:
            h_links = hLink.findall(link)
            for h_link in h_links:
                if h_link in link_array:
                    if not 'rel="nofollow"' in link:
                        new_link = link.replace(">",' rel="nofollow">')
                        link_array[h_link] = link_array[h_link] + 1

                else:
                    link_array[h_link] = 0
            # if link in link_array:
            #     # print 1
            #     if not 'rel="nofollow"' in link:
            #         new_link = link.replace(">",' rel="nofollow">')
            #         link_array[link] = link_array[link] + 1
            #     else:
            #         print 0
            # else:
            #     link_array[link] = 0
            
            # print link,"\n"

        # print link_array

        for link in link_array:
            # print link_array[link]
            if link_array[link]>0:
                print link, " : ", link_array[link]

        
        # p6 = re.compile("/upload[\w\-\s_/\.]+jpg|/upload[\w\-\s_/\.]+png|/upload[\w\-\s_/\.]+gif|/upload[\w\-\s_/\.]+ico")

        # imgpaths = p6.findall(html_file_string)

        # for path in imgpaths:
        #     p4 = re.compile("[\w\-_\s\.]+jpg|[\w\-_\s\.]+png|[\w\-_\s\.]+gif|[\w\-_\s\.]+ico")
        #     imgname = p4.findall(path)

        #     for img in imgname:

        #         html_file_string = html_file_string.replace(path, "/htmlstaticcontent/unknown_images/"+img)

        #         print path, " --> ", img


        # html_file_name = filename
        # html_file = open(html_file_name,'w')

        # html_file.write(html_file_string)
        # html_file.close()