#!/usr/bin/env python
# -*- coding: utf-8 -*-

import simplejson as json
from xml import sax
try:
    from cStringIO import StringIO
except ImportError:
    from StringIO import StringIO

# pricefile = open('/web/trimetru/site/www/import/price.xml', 'r')
pricefile = open('/home/saur/web/sitenewwave/import/price.xml', 'r')

xml_string = pricefile.read()
pricefile.close()
# print xml_string

xmlList = []


def display(data):

    xmlList.append(data)


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

    def characters(self, contents):
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


def insertGroup(gName, gHash, pHash, pName):

    cursor.execute(
        """ INSERT INTO `trimetru_goods`.`groups`
        (`name`,`hash`,`parent_hash`, `fullname`) VALUES ( %s,%s,%s,%s ) """,
        (gName, gHash, pHash, pName))
    row = cursor.fetchone()
    conn.commit()


def insertItem(
    iName, pHash, cName, weight, length, kf,
        iHash, edIzm, price, priceType, groupSecondName, itemHashN, inStock):

    if type(iName) != type(dict()) and type(cName) != type(dict()):
        print iName.encode("utf-8") + ' ' + cName.encode("utf-8")
        if type(groupSecondName) == type(dict()):
            groupSecondName = iName

        cursor.execute(""" INSERT INTO `trimetru_goods`.`offers`
            (`id`, `name`, `hash`, `parent_hash`, `display_name`,
            `char_name`, `weight`, `length`, `kf`, `edIzm`, `price`,
            `price_type`, `father_hash`, `stock`)
            VALUES ( %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s ) """, (
            '', (groupSecondName + ' ' + cName).encode("utf-8"),
            iHash, pHash, iName, cName, weight, length, kf,
            edIzm, price, priceType, itemHashN, inStock))
        row = cursor.fetchone()
        conn.commit()


def groupEater(group, pHash, pName):

    if u'Предмет' in group:

        # insertGroup(
        #     group[u'НаименованиеГруппы'], group[u'НоменклатураСсылка'], pHash)

        if type(group[u'Предмет']) == type(list()):
            for itemChar in group[u'Предмет']:

                priceDB = []
                priceType = []
                for price in itemChar[u'Цена']:
                    priceDB.append(price[u'Цена'])
                    priceType.append(price[u'НазваниеЦены'])

                insertItem(group[u'НаименованиеГруппы'], pHash,
                           itemChar[u'Характеристика'], itemChar[u'Вес'],
                           itemChar[u'Кратность'], itemChar[u'Коэффициент'],
                           itemChar[u'ХарактеристикаСсылка'],
                           itemChar[u'ЕдИзмерения'], "|".join(priceDB),
                           "|".join(priceType), group[u'Синоним'],
                           group[u'НоменклатураСсылка'],
                           itemChar[u'ЕстьВНаличии'])

        elif type(group[u'Предмет'] == type(dict)):

            priceDB = []
            priceType = []
            for price in group[u'Предмет'][u'Цена']:
                priceDB.append(price[u'Цена'])
                priceType.append(price[u'НазваниеЦены'])

            insertItem(group[u'НаименованиеГруппы'], pHash,
                       group[u'Предмет'][u'Характеристика'],
                       group[u'Предмет'][u'Вес'],
                       group[u'Предмет'][u'Кратность'],
                       group[u'Предмет'][u'Коэффициент'],
                       group[u'Предмет'][u'ХарактеристикаСсылка'],
                       group[u'Предмет'][u'ЕдИзмерения'], "|".join(priceDB),
                       "|".join(priceType), group[u'Синоним'],
                       group[u'НоменклатураСсылка'],
                       group[u'Предмет'][u'ЕстьВНаличии'])

    if u'Цена' in group:

        priceDB = []
        priceType = []
        # insertGroup(
            # group[u'НаименованиеГруппы'], group[u'НоменклатураСсылка'], pHash)
        if type(group[u'Цена']) == type(list()):
            for price in group[u'Цена']:
                priceDB.append(price[u'Цена'])
                priceType.append(price[u'НазваниеЦены'])

        elif type(group[u'Цена']) == type(dict()):
            priceDB.append(group[u'Цена'][u'Цена'])
            priceType.append(group[u'Цена'][u'НазваниеЦены'])

        if(priceDB.__len__() == 1):
            pDB = priceDB[0]
            pT = priceType[0]
        else:
            pDB = "|".join(priceDB)
            pT = "|".join(priceType)

        insertItem(group[u'НаименованиеГруппы'],
                   pHash, u'до 6 м', 0, 0, 0, 0, group[u'ЕдИзмерения'],
                   pDB, pT, group[u'Синоним'], group[u'НоменклатураСсылка'], 1)

    if u'Группа' in group:

        fName = ( pName.replace(group[u'НаименованиеГруппы'], "" ) + " \ " + group[u'НаименованиеГруппы'] )

        insertGroup(
            group[u'НаименованиеГруппы'], group[u'НоменклатураСсылка'], pHash, fName)

        if type(group[u'Группа']) == type(list()):
            for subgroup in group[u'Группа']:
                groupEater(subgroup, group[u'НоменклатураСсылка'], fName)
        elif type(group[u'Группа']) == type(dict()):
            groupEater(group[u'Группа'], group[u'НоменклатураСсылка'], fName)

if __name__ == '__main__':
    parser = sax.make_parser()
    parser.setContentHandler(ObjBuilder('СписокНоменклатуры'.decode("utf-8")))
    parser.setFeature(sax.handler.feature_namespaces, 1)

    inpsrc = sax.xmlreader.InputSource()
    inpsrc.setByteStream(StringIO(xml_string))
    parser.parse(inpsrc)

    import MySQLdb
    from secrets import *

    conn = MySQLdb.connect(host=databases["goods"]["host"],
                           user=databases["goods"]["user"],
                           passwd=databases["goods"]["passwd"],
                           db=databases["goods"]["db"])
    conn.set_character_set('utf8')
    cursor = conn.cursor()
    cursor.execute('SET NAMES utf8;')

    cursor.execute(""" TRUNCATE `offers` """)
    cursor.execute(""" TRUNCATE `groups` """)

    for group in xmlList[0][u'Группа']:

        pHash = group[u'НоменклатураСсылка']

        fName = group[u'НаименованиеГруппы']

        insertGroup(
            group[u'НаименованиеГруппы'], group[u'НоменклатураСсылка'], pHash, fName)

        if u'Группа' in group:
            if type(group[u'Группа']) == type(dict()):
                groupEater(group[u'Группа'], pHash, fName)
            elif type(group[u'Группа']) == type(list()):
                for subgroup in group[u'Группа']:
                    groupEater(subgroup, pHash, fName)

    cursor.close()
    conn.close()
