#!/usr/bin/python2.6
# -*- coding: utf-8 -*-


import sys,os
import cgi
import cgitb; cgitb.enable()

print ("Content-Type: text/html; charset=utf-8\n")

_PATH = os.path.abspath(os.path.dirname(__file__))

h_file = os.path.join(_PATH, 'locate/ru/templates/mainpage_template.html')
header = open(h_file,'r')
header_string = header.read()
header.close()



f_file = os.path.join(_PATH, 'locate/ru/templates/mainfooter_template.html')
footer = open(f_file,'r')
footer_string = footer.read()
footer.close()

print header_string
print "<h2>Упс, похоже вы обратились к несуществующей странице. Быть может вы ищете что-то из списка ниже?</h2>\n"
print '''<div class="mod-sitemap">
	<ul class="level1">
		<li>
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
		</li>
		<li>
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
		</li>
		<li><h2><a href="/products/" title="Продукция">Продукция</a></h2>
			<ul>
				<li>
					<h3><a href="/1cengine/site/" title="Купить Online">Купить Online</a></h3>
				</li>
				<li>
					<h3><a href="/products/metalloprokat/" title="Металлопрокат">Металлопрокат</a></h3>
				</li>
				<li>
					<h3><a href="/products/krovl/" title="Кровля и фасад">Кровля и фасад</a></h3>
				</li>
				<li>
					<h3><a href="/products/gost/" title="ГОСТы">ГОСТы</a></h3>
				</li>
				<li>
					<h3><a href="/products/faq/" title="Вопросы и ответы">Вопросы и ответы</a></h3>
				</li>
				<li>
					<h3><a href="/products/special/" title="Спецпредложение">Спецпредложение</a></h3>
				</li>
				<li>
					<h3><a href="/products/request/" title="Оформить заявку">Оформить заявку</a></h3>
				</li>
				<li>
					<h3><a href="/products/dealers/" title="Дилерам">Дилерам</a></h3>
				</li>
			</ul>
		</li>
	</ul>
	<ul class="level1">
		<li>
			<h2><a href="/suppliers/" title="Поставщикам">Поставщикам</a></h2>
		</li>
		<li>
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
		</li>
		<li>
			<h2><a href="/1cengine/site/" title="Купить Online">Купить Online</a></h2>
		</li>
	</ul><div class="clear">&nbsp;</div>
</div>'''

print footer_string