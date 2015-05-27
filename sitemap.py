#!/web/trimetru/python/bin/python2.6
# -*- coding: utf-8 -*-
# This Python file uses the following encoding: utf-8
# -- #!c:/Python27/python.exe
import sys
import os
import cgi
import cgitb
cgitb.enable()
sys.path.insert(0, os.path.expanduser('~/site/python'))
from bs4 import BeautifulSoup

debugmode = False
if ((sys.platform) == "win32"):
    # print ("")
    # sys.stdout = open('temp.html', 'w')
    print("Content-Type: text/html; charset=utf-8")
    print("")
else:
    print("Content-Type: text/html; charset=utf-8")
    print("")

print("<!DOCTYPE html>")



sm = '''<div class="mod-sitemap">
    <div>
        <h2><a href="/about/" title="О компании">О компании</a></h2>
        <ul>
            <li>
                <h3><a href="/about/history/" title="История">История</a></h3>
            </li>
            <li>
                <h3><a href="/about/history/photo/" title="История в фото">История в фото</a></h3>
            </li>
            <li>
                <h3><a href="/about/leaderships/" title="Руководство">Руководство</a></h3>
            </li>
            <li>
                <h3><a href="/about/strong/" title="Преимущества">Преимущества</a></h3>
            </li>
            <li>
                <h3><a href="/about/awards/" title="Награды">Награды</a></h3>
            </li>
            <li>
                <h3><a href="/about/news/" title="Новости">Новости</a></h3>
            </li>
            <li>
                <h3><a href="/about/partners/" title="Партнеры">Партнеры</a></h3>
            </li>
            <li>
                <h3><a href="/about/vacancies/" title="Вакансии">Вакансии</a></h3>
            </li>
        </ul>
    </div>
    <div>
        <h2><a href="/services/" title="Услуги">Услуги</a></h2>
        <ul>
            <li>
                <h3><a href="/services/metalwork/" title="Металлообработка">Металлообработка</a></h3>
            </li>
            <li>
                <h3><a href="/services/delivery/" title="Доставка">Доставка</a></h3>
            </li>
            <li>
                <h3><a href="/services/weighing/" title="Взвешивание авто">Взвешивание авто</a></h3>
            </li>
            <li>
                <h3><a href="/services/storage/" title="Складские услуги">Складские услуги</a></h3>
            </li>
        </ul>
    </div>
    <div>
        <h2><a href="/products/" title="Продукция">Продукция</a></h2>
            <ul>
                <li>
                    <h3><a href="/1cengine/site/" title="Купить Online">Купить Online</a></h3>
                </li>
                <li>
                    <h3><a href="/products/metalloprokat/" title="Металлопрокат">Металлопрокат</a></h3>
                </li>
                <li>
                    <h3><a href="/products/krovl/" title="Кровля и фасад">Кровля и фасад</a></h3>
                    <ul>
                        <li>
                            <h4><a href="/products/krovl/profnastil/" title="Профнастил" >Профнастил</a></h4>
                        </li>
                        <li>
                            <h4><a href="/products/krovl/metallocherepica/" title="Металлочерепица" >Металлочерепица</a></h4>
                        </li>
                        <li>
                            <h4><a href="/products/krovl/metallosajding/" title="Металлосайдинг" >Металлосайдинг</a></h4>
                        </li>
                        <li>
                            <h4><a href="/products/krovl/dobornye-jelementy/" title="Доборные элементы" >Доборные элементы</a></h4>
                        </li>
                        <li>
                            <h4><a href="/products/krovl/vodostochnye_sistemy/" title="Водосточные системы" >Водосточные системы</a></h4>
                        </li>
                        <li>
                            <h4><a href="/products/krovl/metalloshtaketnik/" title="Металлоштакетник" >Металлоштакетник</a></h4>
                        </li>
                    </ul>
                </li>
                <li>
                    <h3><a href="/products/gost/" title="ГОСТы">ГОСТы</a></h3>
                </li>
                <li>
                    <h3><a href="/products/faq/" title="Вопросы и ответы">Вопросы и ответы</a></h3>
                </li>
                <li>
                    <h3><a href="/products/fence/" title="Заборные секции">Заборные секции</a></h3>
                </li>
                <li>
                    <h3><a href="/products/request/" title="Оформить заявку">Оформить заявку</a></h3>
                </li>
                <li>
                    <h3><a href="/products/dealers/" title="Дилерам">Дилерам</a></h3>
                </li>
            </ul>
    </div>
    <div>
        <h2><a href="/suppliers/" title="Поставщикам">Поставщикам</a></h2>
    </div>
    <div>
        <h2><a href="/contacts/" title="Контакты">Контакты</a></h2>
        <ul>
            <li>
                <h3><a href="/contacts/maps/" title="Схемы проезда">Схемы проезда</a></h3>
            </li>
            <li>
                <h3><a href="/contacts/feedback/" title="Обратная связь">Обратная связь</a></h3>
            </li>
            <li>
                <h3><a href="/contacts/urinfo/" title="Информация о юридическом лице">Информация о юридическом лице</a></h3>
            </li>
        </ul>
    </div>
    <div>
            <h2><a href="/1cengine/site/" title="Купить Online">Купить Online</a></h2>
    </div>
    <div>
            <h2><a href="/1cengine/kabinet/" title="Войти">Войти</a></h2>
    </div>
    <div class="clear">&nbsp;</div>
</div>
</div>'''

def makecontent(path=None):
    # print path
    soup = BeautifulSoup(open("locate/ru/templates/mainpage_template.html"))
    if (debugmode is True):
        soup.html.noscript.extract()
        nodes = soup.html.body("script")
        for currentelement in nodes:
            currentelement.extract()
    soupForImport = BeautifulSoup(sm)
    # soupSiteMap = BeautifulSoup(open("sitemap.xml"), "xml")
    # nodes = soupSiteMap.find_all("url")
    # counter = 0
    # tbody = soupForImport.html.table.tbody
    # for el in nodes:
    #     counter = counter + 1
    #     tag_tr = soupForImport.new_tag("tr")
    #     tag_td = soupForImport.new_tag("td")
    #     tag_td.append(str(counter))
    #     tag_tr.append(tag_td)
    #     tag_td = soupForImport.new_tag("td")
    #     tag_a = soupForImport.new_tag("a", href=el.loc.string)
    #     tag_a.append(str(el.loc.string))
    #     tag_td.append(tag_a)
    #     tag_tr.append(tag_td)
    #     tag_td = soupForImport.new_tag("td")
    #     tag_changefreq = el.find("changefreq")
    #     changefreq = "None"
    #     if tag_changefreq is not None:
    #         changefreq = el.changefreq.string
    #     tag_td.append(changefreq)
    #     tag_tr.append(tag_td)
    #     tbody.append(tag_tr)

    # table = soupForImport.new_tag("table")

    soup.html.body.append(soupForImport.html)
    # soupForImport.append()
    soupFooter = BeautifulSoup(
        open("locate/ru/templates/mainfooter_template.html"))
    node = soupFooter.find("footer", {"id": "footer"})
    soup.html.body.append(node)
    # print(soupForImport.prettify("utf-8"))
    print(soup.prettify("utf-8"))

makecontent()
