<?php session_start(); ?>
<?php
require_once('mobile.inc.php');
$m = new Mobile_Detect();
if( $m->isMobile() ){
   
    if(isset($_GET["linkUID"])){    
        $URL = "pda/qrorder.php?linkUID=".$_GET['linkUID'];
        header("Location: $URL");
    }
    
}
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
?>

<?php
$APPLICATION->IncludeFile(
    SITE_TEMPLATE_PATH . '/include_areas/page_standart_header.php',
    array(),
    array('MODE' => 'php')
);

?>

<?php 
    if(isset($_GET["ref"])){
        $title = str_replace("\\\"", "\"",$_GET["ref"]);
        $title = str_replace("(", "", $title);
        $title = str_replace(")", "", $title);
        $title = str_replace("\"", "", $title);
        $APPLICATION->SetTitle($title." купить онлайн | Тримет ООО");
        $APPLICATION->SetPageProperty("keywords", "".$_GET["ref"].", купить, тримет, тюмень");
        $APPLICATION->SetPageProperty("description", "Купить ".$_GET["ref"]." в компании Тримет");
    } else {
        $APPLICATION->SetTitle("Купить Online");
        $APPLICATION->SetPageProperty("keywords", "металлопрокат, профнастил, металлосайдинг, купить, онлайн, тюмень, арматура, балка, швеллер, трубы, угол, штрипс, квадрат, круг, лист, проволока");
        $APPLICATION->SetPageProperty("description", "Покупка металлосайдинга, профнастила, металлопроката в Тюмени онлайн");
    }

?>

<script type="text/javascript" src='/1cengine/site/js/jquery.js'> </script>
<script type="text/javascript" src='/1cengine/site/js/jquery.blockUI.js'> </script>
<script type="text/javascript" src='/1cengine/site/js/Array.js'> </script>
<script type="text/javascript" src='/1cengine/site/js/jquery.cookie.js'> </script>
<script type="text/javascript" src='/1cengine/site/js/jquery.chromatable.js'> </script>
<script type="text/javascript" src='/1cengine/site/js/jquery-ui-1.8.23.custom.min.js'> </script>
<script type="text/javascript" src='/1cengine/site/js/jquery.tagcanvas.min.js'> </script>
<script type="text/javascript" src='/1cengine/site/js/jquery.elastic.source.js'> </script>


<script type="text/javascript" src='js/modern_uiJs.js'> </script>

<!--<script type="text/javascript" src='/1cengine/site/js/uiJS.js'> </script>-->
<script type="text/javascript" src='/1cengine/site/js/uiBasket.js'> </script>

<script type="text/javascript" src='js/uiOrders.js'> </script>

<link rel="stylesheet" type="text/css" href="modern_style.css" />

<h1 style="font-size:14px;display:none">Продажа металлопроката, профнастила и металлосайдинга онлайн в Тюмени и Тюменской Области</h1>

<table style="width:100%;">
	<tr>
		<td id="leftTr">

			<span id='showBasketSpan'>
                <p><a href='Показать заказ' title='Заказ' id='tabBasket' onClick='return false'>Показать заказ (<span class='basketCount'>0</span>)</a></p>
                <p><a href="/1cengine/site/fullprice.php" title="Перейти на страницу с полным прайс-листом">Полный прайс</a></p>
                <p style="display:none;"><a href="http://trimet.ru/1cengine/productinformation/cataloginformation/index_products.php" title="Просмотреть индекс каталога товаров">Индекс</a></p>
                <p>Скачать прайс:
                    <li><a href="/download/files/price.xlsx" title="Скачать прайс в формате xls">xls</a></li>
                    <li><a href="/download/files/price.pdf" title="Скачать прайс в формате pdf">pdf</a></li>
                    <li><a href="/download/files/price.ods" title="Скачать прайс в формате ods">ods</a></li>
                </p>
            </span>
            <span id='showPriceSpan'>
                <p><a href='Показать прайс' title='В прайс' id='tabPrice' onClick='return false'>Вернуться в прайс</a></p>
                <p><a href='javascript:createOrder()' title='Сохранить заказ'>Оформить заказ</a></p>
                <p>Скачать заказ:
                    <li><a href='javascript:getOrderFomat("xlsx")' title="Скачать прайс в формате xls">xls</a></li>
                    <li><a href='javascript:getOrderFomat("pdf")' title="Скачать прайс в формате pdf">pdf</a></li>
                    <li><a href='javascript:getOrderFomat("odf")' title="Скачать прайс в формате ods">ods</a></li>
                </p>

            </span>
            
		</td>
		<td id="mainTr" rowspan="2">
            <div id="pTableContentTab">
    			<div id="searchDiv">
                    <input id="itemName" placeholder="Введите здесь интересующий вас товар" />
                    <div id="searchButton">Найти</div>
    			</div>
                <div id="qRes">
    				<table id="tableRes">
                        <?php
                            if($_GET["ref"]!=""){
                                $_GET["term"]=$_GET["ref"];
                                $_GET["strict"]="yes";
                                require_once("getItems.php");
                            }
                        ?>
    				</table>
    			</div>
    			<p>
    				<a id="showAll" style="display:none" href="Все результаты" onClick="return false">
    					Показать все результаты
    				</a>
    			</p>

                <div id="tags">
                    <ul>
                        <li><a href="javascript:showGroup2('Арматура')"><strong>Арматура</strong></a></li>
                        <li><a href="javascript:showGroup2('Балка')"><strong>Балка</strong></a></li>
                        <li><a href="javascript:showGroup2('Квадрат')"><strong>Квадрат</strong></a></li>
                        <li><a href="javascript:showGroup2('Круг')"><strong>Круг</strong></a></li>
                        <li><a href="javascript:showGroup2('Лист')"><strong>Лист</strong></a></li>
                        <li><a href="javascript:showGroup2('Труба')"><strong>Труба</strong></a></li>
                        <li><a href="javascript:showGroup2('Швеллер')"><strong>Швеллер</strong></a></li>
                        <li><a href="javascript:showGroup2('Профнастил')"><strong>Профнастил</strong></a></li>
                        <li><a href="javascript:showGroup2('Штрипс')"><strong>Штрипс</strong></a></li>
                        <li><a href="javascript:showGroup2('Проволока')"><strong>Проволока</strong></a></li>
                        <li><a href="javascript:showGroup2('Металлосайдинг')"><strong>Металлосайдинг</strong></a></li>
                        <li><a href="javascript:showGroup2('Металлочерепица')"><strong>Металлочерепица</strong></a></li>
                        <li><a href="javascript:showGroup2('Угол')"><strong>Угол</strong></a></li>
                    </ul>
                </div>

                <div id="myCanvasContainer">
                    <canvas width="300" height="300" id="myCanvas">
                        <!-- <p>Anything in here will be replaced on browsers that support the canvas element</p> -->
                    </canvas>
                </div>

            </div>
            <div id="basketDiv" style="display:none">
                <span id="basketCaption">Заказ покупателя</span>

                <div id="switchDiv">
                    <div class="activeDiv" id="switchOrderDiv">Товары</div>
                    <div class="inactiveDiv" id="switchDeliveryDiv">Доставка</div>
                    <div class="inactiveDiv" id="switchNotificationDiv">Оформить заказ</div>
                    <div id="showNDSlabel"><input type="checkbox" id="showNds" /><label for="showNds">Показать НДС</label></div>
                </div>
                <div id="orderDiv">
                    <table id='basketTab' cellspacing='0' cellpadding='0'>
                      <thead>
                         <tr>
                            <th class='itemHeader'>
                                №
                            </th>
                            
                            <th class='itemHeader'>
                                Номенклатура
                            </th>
                            
                            <th class='itemHeader'>
                                Хар-ка
                            </th>
                            
                            <th class='itemHeader'>
                                Кол-во
                            </th>
                            
                            <th class='itemHeader'>
                                Ед.
                            </th>

                            <th class='itemHeader'>
                                Цена
                            </th>
                            
                            <th class='itemHeader NDSHeader'>
                                Ставка НДС
                            </th>

                            <th class='itemHeader NDSHeader'>
                                Сумма НДС
                            </th>
                            
                            <th class='itemHeader'>
                                Сумма
                            </th>
                         </tr>
                      </thead>
                      <tbody id='lItemTab'>
  
                      </tbody>
                    </table>
                    <div id='Summary'>
                        <table>
                            <tr>
                                <td>Общий вес:</td>
                                <td id='CountAll'></td>
                            </tr>
                            <tr>
                                <td>Всего (руб) с учётом стоимости доставки:</td>
                                <td name='0' id='SumAll'></td>
                            </tr>
                            <tr>
                                <td>НДС (в т. ч.):</td>
                                <td id='NDSAll'></td>
                            </tr>
                        </table>                     
                    </div>
                </div>
                <div id="deliveryDiv">
                    <div id='shipment'>
                        <!-- <form id='shipmentForm'> -->
                            <table id='deliveryTab'>
                                <tr>
                                    <td>Выберете город</td>
                                    <td>
                                        <select id='townSelect'>
                                            <option value='' selected disabled>--</option>
                                            <option value='72000001'>Тюмень</option>
                                            <option price='44600' value='74002003'>Аша</option>
                                            <option price='30700' value='660000280005'>В. Салда</option>
                                            <option price='19500' value='66000001'>Екатеринбург</option>
                                            <option price='7900' value='72009001'>Заводоуковск</option>
                                            <option price='17800' value='72011001'>Ишим</option>
                                            <option price='12300' value='03020000139'>Курган</option>
                                            <option price='7400' value='72013000001'>Н. Тавда</option>
                                            <option price='27900' value='66000023'>Н. Тагил</option>
                                            <option price='41800' value='86000014'>Нефтеюганск</option>
                                            <option price='58500' value='86000011'>Нижневартовск</option>
                                            <option price='72500' value='54000001'>Новосибирск</option>
                                            <option price='92000' value='89000006'>Новый Уренгой</option>
                                            <option price='36200' value='55000001'>Омск</option>
                                            <option price='22300' value='66000016'>Первоуральск</option>
                                            <option price='22300' value='66000017'>Полевской</option>
                                            <option price='39000' value='86000007'>Пыть-Ях</option>
                                            <option price='44600' value='86000010'>Сургут</option>
                                            <option price='8400' value='660000360005'>Тавда</option>
                                            <option price='13900' value='72000002'>Тобольск</option>
                                            <option price='22300' value='72018000001'>Уват</option>
                                            <option price='53000' value='86000001'>Ханты-Мансийск</option>
                                            <option price='27900' value='74000001'>Челябинск</option>
                                            <option price='12300' value='45000002'>Шадринск</option>
                                            <option price='6800' value='72021001'>Ялуторовск</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Введите адрес</td>
                                    <td>
                                        <input type='textarea' name='destination' id='destination' value='' placeholder='Введите здесь адрес' /> 
                                    </td>
                                </tr>
                                <tr>
                                    <td>Выберете транспорт</td>
                                    <td>
                                        <select id='carry' name='carry'>
                                            <option disabled selected>--</option>
                                            <option price='2400' value='Длинномер' checked /> Длинномер </option>
                                            <option price='1200' value='Газель' /> Газель </option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Стоимость доставки</td>
                                    <td><span id="delivery_cost"></span></td>
                                </tr>
                                <tr>
                                    <td><label for="selfCarry"> Самовывоз</label></td>
                                    <td><input type="checkbox" id="selfCarry" /></td>
                                </tr>
                            </table>
                        <!-- </form> -->
                    </div>
                    <!-- <p id="sCP"></p> -->
                    
                </div>
                <div id="notificationDiv">

                    <table class="orderFormTable">
                        <tr>
                            <td>Фамилия</td>
                            <td>
                                <input type="textarea" class="orderFormInput" id="lastNameInput" />
                            </td>
                        </tr>
                        <tr>
                            <td>Имя и Отчество</td>
                            <td>
                                <input type="textarea" class="orderFormInput" id="nameSurnameInput" />
                            </td>
                        </tr>
                        <tr>
                            <td>*Электронная почта</td>
                            <td>
                                <input type="textarea" id='emailInput' class="orderFormInput" />
                            </td>
                        </tr>
                        <tr>
                            <td>*Телефон для связи</td>
                            <td>
                                <input type="textarea" class="orderFormInput" id="mainPhoneInput" />
                            </td>
                        </tr>
                        <tr>
                            <td>Дополнительный телефон для связи</td>
                            <td>
                                <input type="textarea" class="orderFormInput" id="otherPhoneInput" />
                            </td>
                        </tr>
                    </table>

                    <p>*Обязательны для заполнения</p>

                    <a href="javascript:createOrder()"><div id="sendOrderButton">Оформить заказ</div></a>

                    <!-- <span id='email'>E-mail для уведомлений: <input id='emailInput' type='textarea' value='' /></span> -->
                </div>
            </div>
		</td>
	</tr>
	<tr>
		<td id="leftTrBottomTd">
			<p><a href="http://trimet.ru/1cengine/site/howmakeorder.php">Как выписать счёт?</a></p>
			<p><a href="http://trimet.ru/1cengine/site/howitcreating.php">P.S.: Как это создается...</a></p>
		</td>
	</tr>
</table>

<?php 

$APPLICATION->IncludeFile(
    SITE_TEMPLATE_PATH . '/include_areas/page_standart_pre_footer.php',
    array('css_class' => $cssClass),
    array('MODE' => 'php')
); ?>

    <div id="footer">
        <a href="#top" id="bottom" tabindex="3" title="наверх страницы"></a>
        <div id="post-cont" class="clear">&nbsp;</div>

<?php
$APPLICATION->IncludeFile(
    '/copy.php',
    array('SET_TITLE' => 'N',),
    array('MODE' => 'php')
); ?>



        <div class="fright">
            <form id="search2" method="get" action="/search/">
                <fieldset class="input-field">
                    <input id="q" name="q" value="Поиск" type="text" onfocus="if(this.value=='Поиск') this.value=''" onblur="if(this.value=='') this.value='Поиск'" />
                </fieldset>
            </form>

            <div id="obj-counter">
                <!-- LiveInternet counter -->
                <script type="text/javascript"><!--//--><![CDATA[//><!--
                document.write('<a href="http://www.liveinternet.ru/click" target="_blank">' +
                '<img src="http://counter.yadro.ru/hit?t14.1;r' + 
                escape(document.referrer) + 
                ( (typeof(screen)=='undefined') ? '' : ';s' + screen.width + '*' + screen.height + '*' + (screen.colorDepth ? screen.colorDepth : screen.pixelDepth) ) +
                ';u' + escape(document.URL) + 
                ';h' + escape(document.title.substring(0,80)) + 
                ';' + Math.random() +
                '" alt="" title="LiveInternet: показано количество просмотров и посетителей" ' +
                'border="0" width="88" height="31" /><\/a>');
                //--><!]]></script>
                <!--/LiveInternet-->
                <!-- GoogleAnalysts counter-->
                <script type="text/javascript">
                var _gaq = _gaq || [];
                _gaq.push(['_setAccount', 'UA-33206471-1']);
                _gaq.push(['_trackPageview']);
                (function() {
                var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
                ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
                })();
                </script> 
                <!-- /GoogleAnalysts -->
                <!-- Yandex.Metrika counter -->
<script type="text/javascript">
(function (d, w, c) {
    (w[c] = w[c] || []).push(function() {
        try {
            w.yaCounter15882208 = new Ya.Metrika({id:15882208,
                    clickmap:true,
                    trackLinks:true, webvisor:true});
        } catch(e) {}
    });
   
    var n = d.getElementsByTagName("script")[0],
        s = d.createElement("script"),
        f = function () { n.parentNode.insertBefore(s, n); };
    s.type = "text/javascript";
    s.async = true;
    s.src = (d.location.protocol == "https:" ? "https:" : "http:") + "//mc.yandex.ru/metrika/watch.js";

    if (w.opera == "[object Opera]") {
        d.addEventListener("DOMContentLoaded", f);
    } else { f(); }
})(document, window, "yandex_metrika_callbacks");
</script>
<noscript><div><img src="//mc.yandex.ru/watch/15882208" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
<!-- /Yandex.Metrika counter --> 
            </div>

            <div id="autor">
                <p>Создание сайта</p>
                <a href="http://russianmultimedia.ru/contacts.php#feedback" title="Создание сложных мультимедийных продуктов: сайтов публичных компаний, 3d-видео и стерео роликов, мультимедийных инсталляций" target="_blank">Russian multimedia company</a>
            </div>
        </div>

<?php $APPLICATION->IncludeComponent(
    'bitrix:menu',
    'bottom',
    array(
        "ROOT_MENU_TYPE"        => "top",
        "MAX_LEVEL"             => "1",
        "CHILD_MENU_TYPE"       => "left",
        "USE_EXT"               => "N",
        "ALLOW_MULTI_SELECT"    => "N",
        "MENU_CACHE_TYPE"       => "N",
        "MENU_CACHE_TIME"       => "3600",
        "MENU_CACHE_USE_GROUPS" => "Y",
        "MENU_CACHE_GET_VARS"   => Array()
    ),
    false
); ?>

    </div> <!-- /footer -->
</div> <!-- /main -->

</body>

