#!/usr/bin/env python
# -*- coding: utf-8 -*-

import simplejson as json
from xml import sax
try:
    from cStringIO import StringIO
except ImportError:
    from StringIO import StringIO

pricefile = open('price.xml', 'r')
xml_string = pricefile.read()
pricefile.close()
# print xml_string

xmlList = []

def display(data):
    # import pprint
    # pp = pprint.PrettyPrinter(depth=10)
    # pp.pprint(data)

    # testfile = open('testfile', 'w')
    # testfile.write(data)

    xmlList.append(data) 

    # print data[0][u'Характеристика']

    # for x in data[u'Предмет']:
    #     print x[u'Характеристика']

class Element:
    def setData(self, key, value):
        self.__dict__[key] = value

    def setObject(self, key, object):
        if key in self.__dict__ and not isinstance(self.__dict__[key], (list, tuple)):
            prev_object = self.__dict__[key]
            self.__dict__[key] = []
            self.__dict__[key].append(prev_object)
            self.__dict__[key].append(object)
        elif key in self.__dict__:
            self.__dict__[key].append(object)
        else:
            self.__dict__[key] = object

    def jsonable(self):
        return self._traverse(self.__dict__)

    # http://stackoverflow.com/questions/1036409/recursively-convert-python-object-graph-to-dictionary/1118038#1118038
    def _traverse(self, obj):
        if isinstance(obj, dict):
            for k in obj.keys():
                obj[k] = self._traverse(obj[k])
            return obj
        elif hasattr(obj, "__iter__"):
            return [self._traverse(v) for v in obj]
        elif hasattr(obj, "__dict__"):
            data = dict([(key, self._traverse(value))
                for key, value in obj.__dict__.iteritems()
                if not callable(value) and not key.startswith('_')])
            return data
        else:
            return obj

class ObjBuilder(sax.ContentHandler):
    def __init__(self, node):
        sax.ContentHandler.__init__(self)
        self.obj = []
        self.node = node
        self.fetch = False
        self.__buffer = ''

    def startElementNS(self, name, qname, attrs):
        (ns, localname) = name
        if self.node == localname:
            self.fetch = True
            o = Element()
            self.rootobject = o
            self.obj.append(o)
        elif self.fetch:
            self.__buffer = ''
            o = Element()
            self.obj[-1].setObject(localname, o)
            self.obj.append(o)

    def characters(self,contents):
        if self.fetch:
            self.__buffer += contents.strip()

    def endElementNS(self, name, qname):
        (ns, localname) = name
        if self.node == localname:
            self.fetch = False
            display(self.rootobject.jsonable())
            data = self.rootobject.jsonable()
        elif self.fetch:
            if self.__buffer != '':
                self.obj[-2].setData(localname, self.__buffer)
            del self.obj[-1]
            self.__buffer = ''

def insertGroup(gName, gHash, pHash):

#     $query = "INSERT INTO `trimetru_goods`.`groups` (`name`, `hash`, `parent_hash`) \
# VALUES ('".$gName."','".$gHash."','".$pHash."');";

    cursor.execute(""" INSERT INTO `trimetru_goods`.`groups` (`name`,`hash`,`parent_hash`) VALUES ( %s,%s,%s ) """, (gName, gHash, pHash) )
    row = cursor.fetchone()
    conn.commit()

    # $result = mysql_query($query);

    # //echo $result.'<br />';
    # //return mysql_insert_id();

    

def insertItem(iName, pHash, cName, weight, length, kf, iHash, edIzm, price, priceType, groupSecondName, itemHashN, inStock):
    

    print iName + ' ' + cName
    if type(groupSecondName) == type(dict()):
        groupSecondName = iName
    # query = "INSERT INTO `trimetru_goods`.`offers` (`id`, `name`, `hash`, `parent_hash`, `display_name`, `char_name`, `weight`, `length`, `kf`, `edIzm`, `price`, `price_type`, `father_hash`, `stock`) VALUES ('null','"+mysql_escape_string(groupSecondName)+" "+mysql_escape_string(cName)+" ','"+iHash+"','"+pHash+"','"+mysql_escape_string(iName)+"','"+mysql_escape_string(cName)+"','"+weight+"','"+length+"','"+kf+"','"+edIzm+"','"+mysql_escape_string(price)+"','"+mysql_escape_string(priceType)+"','"+itemHashN+"', '"+inStock+"');"
    
    cursor.execute (""" INSERT INTO `trimetru_goods`.`offers` (`id`, `name`, `hash`, `parent_hash`, `display_name`, `char_name`, `weight`, `length`, `kf`, `edIzm`, `price`, `price_type`, `father_hash`, `stock`) VALUES ( %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s ) """, ('',(groupSecondName+' '+cName).encode("utf-8"), iHash, pHash, iName, cName, weight, length, kf, edIzm, price, priceType, itemHashN, inStock))
    row = cursor.fetchone()
    conn.commit()
    # print row
    


def groupEater(group):
    # print '\/\/\/\/\/\/\/\/\/\/\/\/'
    
    if u'Предмет' in group:
        # print group[u'НаименованиеГруппы']
        # print group[u'НоменклатураСсылка']
        # print group[u'Синоним']
        insertGroup(group[u'НаименованиеГруппы'], group[u'НоменклатураСсылка'], pHash)
        if type(group[u'Предмет'])==type(list()):
            for itemChar in group[u'Предмет']:
            
                # print itemChar[u'Характеристика']
                # print itemChar[u'Вес']
                # print itemChar[u'Кратность']
                # print itemChar[u'Коэффициент']
                # print itemChar[u'ХарактеристикаСсылка']
                # print itemChar[u'ЕдИзмерения']
                priceDB = []
                priceType = []
                for price in itemChar[u'Цена']:
                    priceDB.append(price[u'Цена'])
                    priceType.append(price[u'НазваниеЦены'])
                    # print price[u'НазваниеЦены'] +' '+ price[u'Цена']
                # print itemChar[u'ЕстьВНаличии']

                # print '||'+group[u'НаименованиеГруппы']+', '+pHash+', '+itemChar[u'Характеристика']+', '+itemChar[u'Вес']+', '+itemChar[u'Кратность']+', \
            # '+itemChar[u'Коэффициент']+', '+itemChar[u'ХарактеристикаСсылка']+', '+itemChar[u'ЕдИзмерения']+', '+"|".join(priceDB)+', '+"|".join(priceType)+', \
            # '+group[u'Синоним']+', '+group[u'НоменклатураСсылка']+', '+itemChar[u'ЕстьВНаличии']

                insertItem(group[u'НаименованиеГруппы'], pHash, itemChar[u'Характеристика'], itemChar[u'Вес'], itemChar[u'Кратность'], itemChar[u'Коэффициент'], itemChar[u'ХарактеристикаСсылка'], itemChar[u'ЕдИзмерения'], "|".join(priceDB), "|".join(priceType), group[u'Синоним'], group[u'НоменклатураСсылка'], itemChar[u'ЕстьВНаличии'])

                # print '-----------------------------------------------'
        elif type(group[u'Предмет']==type(dict)):
            # print group[u'Предмет'][u'Характеристика']
            # print group[u'Предмет'][u'Вес']
            # print group[u'Предмет'][u'Кратность']
            # print group[u'Предмет'][u'ХарактеристикаСсылка']
            # print group[u'Предмет'][u'ЕдИзмерения']
            priceDB = []
            priceType = []
            for price in group[u'Предмет'][u'Цена']:
                priceDB.append(price[u'Цена'])
                priceType.append(price[u'НазваниеЦены'])
            #     print price[u'НазваниеЦены'] +' '+ price[u'Цена']
            # print group[u'Предмет'][u'ЕстьВНаличии']
            # print '||'+group[u'НаименованиеГруппы']+', '+pHash+', '+group[u'Предмет'][u'Характеристика']+', '+group[u'Предмет'][u'Вес']+', '+group[u'Предмет'][u'Кратность']+', \
            # '+group[u'Предмет'][u'Коэффициент']+', '+group[u'Предмет'][u'ХарактеристикаСсылка']+', '+group[u'Предмет'][u'ЕдИзмерения']+', '+"|".join(priceDB)+', '+"|".join(priceType)+', \
            # '+group[u'Синоним']+', '+group[u'НоменклатураСсылка']+', '+group[u'Предмет'][u'ЕстьВНаличии']

            insertItem(group[u'НаименованиеГруппы'], pHash, group[u'Предмет'][u'Характеристика'], group[u'Предмет'][u'Вес'], group[u'Предмет'][u'Кратность'], group[u'Предмет'][u'Коэффициент'], group[u'Предмет'][u'ХарактеристикаСсылка'], group[u'Предмет'][u'ЕдИзмерения'], "|".join(priceDB), "|".join(priceType), group[u'Синоним'], group[u'НоменклатураСсылка'], group[u'Предмет'][u'ЕстьВНаличии'])

            # print '-----------------------------------------------'

    if u'Цена' in group:
        # print group[u'ЕдИзмерения']
        priceDB = []
        priceType = []
        insertGroup(group[u'НаименованиеГруппы'], group[u'НоменклатураСсылка'], pHash)
        if type(group[u'Цена'])==type(list()):
            for price in group[u'Цена']:
                priceDB.append(price[u'Цена'])
                priceType.append(price[u'НазваниеЦены'])
                # print price[u'НазваниеЦены'] +' '+ price[u'Цена']
        elif type(group[u'Цена'])==type(dict()):
            priceDB.append(group[u'Цена'][u'Цена'])
            priceType.append(group[u'Цена'][u'НазваниеЦены'])
            # print group[u'Цена'][u'НазваниеЦены'] +' '+ group[u'Цена'][u'Цена']

        if(priceDB.__len__()==1):
            pDB = priceDB[0]
            pT =  priceType[0]
        else:
            pDB = "|".join(priceDB)
            pT =  "|".join(priceType)
            
        # print pHash
        insertItem(group[u'НаименованиеГруппы'], pHash, u'кастом', 0, 0, 0, group[u'НоменклатураСсылка'], group[u'ЕдИзмерения'], pDB, pT, group[u'Синоним'], group[u'НоменклатураСсылка'], 1)
        # print '-----------------------------------------------'



    if u'Группа' in group:
        # print 1
        # try:
        # print group[u'НаименованиеГруппы']
        # except:
        #     print group[u'Группа']
            # print group
        # print group[u'НоменклатураСсылка']

        insertGroup(group[u'НаименованиеГруппы'], group[u'НоменклатураСсылка'], pHash)

        if type(group[u'Группа'])==type(list()):
            for subgroup in group[u'Группа']:
                groupEater(subgroup)
        elif type(group[u'Группа'])==type(dict()):
            groupEater(group[u'Группа'])

if __name__ == '__main__':
    parser = sax.make_parser()
    parser.setContentHandler(ObjBuilder('СписокНоменклатуры'.decode("utf-8")))
    parser.setFeature(sax.handler.feature_namespaces, 1)

    inpsrc = sax.xmlreader.InputSource()
    inpsrc.setByteStream(StringIO(xml_string))
    parser.parse(inpsrc)

    import MySQLdb

    conn = MySQLdb.connect (host = "localhost",
                           user = "trimetru_goods",
                           passwd = "&rUI24*(^o",
                           db = "trimetru_goods")
    conn.set_character_set('utf8')
    cursor = conn.cursor()
    cursor.execute('SET NAMES utf8;')

    cursor.execute(""" TRUNCATE `offers` """)
    cursor.execute(""" TRUNCATE `groups` """)

    for group in xmlList[0][u'Группа']:
        # print group[u'НаименованиеГруппы']
        # print group[u'НоменклатураСсылка']

        pHash = group[u'НоменклатураСсылка']

        insertGroup(group[u'НаименованиеГруппы'], group[u'НоменклатураСсылка'], pHash)

        if u'Группа' in group:
            if type(group[u'Группа'])==type(dict()):
                groupEater(group[u'Группа'])
            elif type(group[u'Группа'])==type(list()):
                for subgroup in group[u'Группа']:
                    groupEater(subgroup)

        # print '######################################'

    cursor.close ()
    conn.close ()

    
