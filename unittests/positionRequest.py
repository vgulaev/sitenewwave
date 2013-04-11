#!/web/trimetru/python/bin/python2.6
#-*- coding:utf-8 -*-


import cgi
import cgitb; cgitb.enable()

import urllib2
import re


print ("Content-Type: text/html; charset=utf-8")
print ("")

print """
    <style>
        td{
            
            /*border-right: 1px dotted gray;*/
            padding: 5px 25px 5px;
            /*border-bottom: 1px dotted gray;*/
            background-color:#faeedd;
        }
        tr.open{
            font-size:11px;
            color:#45161c;
        }
        tr.closed{
            font-size:10px;
            color:#1f4037;
        }
    </style>
"""


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
    for i in xrange(30):
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

print "<table>"
for query in query_array:
    result = yxml(query, "trimet.ru")
    print "<tr><td>",query, "</td><td> : </td><td>", result[0], "</td><td><a href='",result[1],"' >", result[1], "</a></td></tr>"

print "</table>"