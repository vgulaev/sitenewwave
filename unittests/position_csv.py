#!/usr/bin/python2.7
#-*- coding:utf-8 -*-


import cgi
import cgitb; cgitb.enable()

import urllib2
import re

import datetime


print ("Content-Type: text/html; charset=utf-8")
print ("")


tpl = """<?xml version='1.0' encoding='utf-8'?>
    <request>
        <query>{KEY}</query>
        <page>{NUM}</page>
        <maxpassages>0</maxpassages>
        <groupings>
            <groupby attr='d' mode='deep' groups-on-page='10' docs-in-group='1' curcateg='-1'/>
        </groupings>
    </request>
"""
 
def yxml(request, url):
    """мы должны получить место сервера в выдаче по некому запросу.
    делаем запрос по десять ссылок на страницу и запрашиваем 10
    страниц. при нахождении сервера останавливаемся и выдаем его
    место в выдаче"""
    j = 1
    doc_tpl = tpl.replace("{KEY}", request)
    for i in xrange(10):
        doc = doc_tpl.replace("{NUM}", str(i))
        conn = urllib2.Request("http://xmlsearch.yandex.ru/xmlsearch?user=Elf607&key=03.13977823:e95167db7719613bbe9c579e723e3c66&lr=55", doc)
        data = urllib2.urlopen(conn)
         
        groups = []
        result = data.read()
         
        if result.find('<error ') >= 0:
            m = re.search('<error code="(\d+)">', result, re.S)
            return [m.group(1), 'err']
         
        result = result.split('</results>')[0].split('<results>')[1]
        map(lambda x: groups.append(x.split('</group>')[0]), result.split('<group>')[1:])
         
        for group in groups:
            next_url = group.split('</url>')[0].split('<url>')[1]
            if next_url.find(url) >= 0:
                return [j, next_url]
            j += 1
    return [0, ""]
     
# if __name__ == "__main__":
#     result = yxml("зелёная лужа", "ru.wiktionary.org")
#     print result[0]
#     print result[1]

query_array = ['металлочерепица', 'швеллер', 'лист рифлёный', 'трубы', 
    'квадрат', 'угол', 'металлосайдинг', 'круг', 'штрипс', 'арматура','двутавр',
    'лист просечно вытяжной','профнастил','сетка кладочная','трубы профильные',
    'трубы оцинкованные','балка','купить металлопрокат','продажа металлопроката',
    'металлопрокат ','металлопрокат тюмень','продажа профнастила']


current_time = str(datetime.datetime.now())
current_time = current_time.split(".")[0]
current_time_array = current_time.split(" ")
current_date = current_time_array[0]
current_date_array = current_date.split("-")
current_date = current_date_array[2]+"."+current_date_array[1]+"."+current_date_array[0]

current_time = current_date+" "+current_time_array[1]

result_total = 0
for query in query_array:
    result = yxml(query, "trimet.ru")
    if result[0] == 0:
        result[0] = 100
    
    file_object = open("/var/www/trimetru/www/yandex/"+query+".csv","a")
    file_object.write(current_time+","+result[0])

    # print "<tr><td>",query, "</td><td> : </td><td>", result[0], "</td><td><a href='",result[1],"' >", result[1], "</a></td></tr>"

# print "<tr><td>TOTAL</td><td> : </td><td>"+str(result_total)+"</td><td></td></tr>"
# print "</table>"