#!/web/tdymkru/python/bin/python2.6
# -*- coding: utf-8 -*-
# This Python file uses the following encoding: utf-8

import sys, os
import cgitb; cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))
reload(sys)
sys.setdefaultencoding('utf-8')

from suds.client import Client
from suds.cache import DocumentCache
#from suds.sax.element import Element
#from suds import WebFault
import logging
logging.basicConfig(level=logging.INFO)
if __debug__:
    logging.getLogger('suds.client').setLevel(logging.DEBUG)
else:
    logging.getLogger('suds.client').setLevel(logging.CRITICAL)
    
print ("Content-Type: text/html; charset=utf-8")

print ("")
    
client = Client('http://195.239.221.58:30080/Parshin_YMK_UT_Copy/ws/map.1cws?wsdl', location = "http://195.239.221.58:30080/Parshin_YMK_UT_Copy/ws/map.1cws")

client.set_options(cache=DocumentCache())

#result = client.service.HelloWorld()
#print(result.encode("utf-8"))

result = client.service.GetAddress('we')

print '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"'
print '"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'
print '<html xmlns="http://www.w3.org/1999/xhtml">'
print '<head>'
print '    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>'
print '    <title>Пример множественного геокодирования</title>'
print '    <!-- Сделаем броузеры ES5 friendly -->'
print '    <script src="/es5-shim/es5-shim.min.js" type="text/javascript"></script>'
print '    <script src="http://yandex.st/jquery/1.8.0/jquery.min.js" type="text/javascript"></script>'
print '    <script src="http://api-maps.yandex.ru/2.0/?load=package.full&lang=ru-RU" type="text/javascript"></script>'
print '    <!-- Класс множественного геокодирования -->'
print '    <script src="https://github.com/dimik/ymaps/blob/master/multi-geocoder.js" type="text/javascript"></script>'
print '    <script type="text/javascript">'
print '        ymaps.ready(function () {'
print '            var map = new ymaps.Map("map", {'
print '                    center: [ 57.101278, 65.615761 ],'
print '                    zoom: 11,'
print '                    behaviors: ["default", "scrollZoom"]'
print '                });'
print '            var mGeocoder = new MultiGeocoder({ boundedBy : map.getBounds() });'
print '            // Геокодирование массива адресов и координат.'
print '            mGeocoder.geocode(['
for adress in result[0]:
    print '        "' + adress[0] + '",'
print '            ])'
print '            .then(function (res) {'
print '                    // Асинхронно получаем коллекцию найденных геообъектов.'
print '                    map.geoObjects.add(res.geoObjects);'
print '                },'
print '                function (err) {'
print '                    console.log(err);'
print '                });'
print '        });'
print '        /**'

print '/**'
print ' * Класс для геокодирования списка адресов или координат.'
print ' * @class'
print ' * @name MultiGeocoder'
print ' * @param {Object} [options={}] Дефолтные опции мультигеокодера.'
print ' */'
print 'function MultiGeocoder(options) {'
print '    this._options = options || {};'
print '}'

print '/**'
print ' * Функция множественнеого геокодирования.'
print ' * @function'
print ' * @requires ymaps.util.extend'
print ' * @see http://api.yandex.ru/maps/doc/jsapi/2.x/ref/reference/util.extend.xml'
print ' * @requires ymaps.util.Promise'
print ' * @see http://api.yandex.ru/maps/doc/jsapi/2.x/ref/reference/util.Promise.xml'
print ' * @name MultiGeocoder.geocode'
print ' * @param {Array} requests Массив строк-имен топонимов и/или геометрий точек (обратное геокодирование)'
print ' * @returns {Object} Как и в обычном геокодере, вернем объект-обещание.'
print ' */'
print 'MultiGeocoder.prototype.geocode = function (requests, options) {'
print '    var self = this,'
print '        opts = ymaps.util.extend({}, self._options, options),'
print '        size = requests.length,'
print '        promise = new ymaps.util.Promise(),'
print '        result = [],'
print '        geoObjects = new ymaps.GeoObjectArray();'

print '    requests.forEach(function (request, index) {'
print '        ymaps.geocode(request, opts)'
print '            .then('
print '                function (response) {'
print '                    var geoObject = response.geoObjects.get(0);'

print '                    geoObject && (result[index] = geoObject);'
print '                    --size || (result.forEach(geoObjects.add, geoObjects), promise.resolve({ geoObjects : geoObjects }));'
print '                },'
print '                function (err) {'
print '                    promise.reject(err);'
print '                }'
print '            );'
print '    });'

print '    return promise;'
print '};'
print '    </script>'
print '</head>'

print '<body>'
print '    <div id="map" style="width: 800px; height: 800px;"></div>'
print '</body>'

print '</html>'