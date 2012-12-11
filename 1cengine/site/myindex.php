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
        $APPLICATION->SetPageProperty("keywords", "металлопрокат, профнастил, металлосайдинг, купить, онлайн, тюмень, арматура, балка, швеллер, трубы");
        $APPLICATION->SetPageProperty("description", "Покупка металлосайдинга, профнастила, металлопроката в Тюмени онлайн");
    }

?>

<script type="text/javascript" src='/1cengine/site/js/jquery.js'> </script>
<script type="text/javascript" src='/1cengine/site/js/jquery.blockUI.js'> </script>
<script type="text/javascript" src='/1cengine/site/js/Array.js'> </script>
<script type="text/javascript" src='/1cengine/site/js/jquery.cookie.js'> </script>
<script type="text/javascript" src='/1cengine/site/js/jquery.chromatable.js'> </script>
<script type="text/javascript" src='/1cengine/site/js/jquery-ui-1.8.20.custom.min.js'> </script>
<script type="text/javascript" src='js/modern_uiJs.js'> </script>

<script type="text/javascript" src="/1cengine/site/js/jsFW.js"></script>
<script type="text/javascript" src="/1cengine/site/js/cloud.js"></script>


<!--<script type="text/javascript" src='/1cengine/site/js/uiJS.js'> </script>-->
<script type="text/javascript" src='/1cengine/site/js/uiBasket.js'> </script>

<script type="text/javascript" src='js/uiOrders.js'> </script>

<link rel="stylesheet" type="text/css" href="modern_style.css" />

<h1 style="font-size:14px;display:none">Продажа металлопроката, профнастила и металлосайдинга онлайн в Тюмени и Тюменской Области</h1>

<style>
.cloud{background:#FFA;width:800px;height:800px;position:relative}
a.tag {color:#00A;line-height:1.4em;text-decoration:none;position:absolute;}
</style>

<table style="width:100%;">
	<tr>
		<td id="leftTr">

			<p id='showBasketSpan'><a href='Показать заказ' title='Заказ' id='tabBasket' onClick='return false'>Показать заказ (<span class='basketCount'>0</span>)</a></p>
            <p id='showPriceSpan'><a href='Показать прайс' title='В прайс' id='tabPrice' onClick='return false'>Вернуться в прайс</a></p>
            <p><a href="/1cengine/site/fullprice.php" title="Перейти на страницу с полным прайс-листом">Полный прайс</a></p>
            <p><a href="http://trimet.ru/1cengine/productinformation/cataloginformation/index_products.php" title="Просмотреть индекс каталога товаров">Индекс</a></p>
			<p>Скачать прайс:
				<li><a href="/download/files/price.xlsx" title="Скачать прайс в формате xls">xls</a></li>
				<li><a href="/download/files/price.pdf" title="Скачать прайс в формате pdf">pdf</a></li>
				<li><a href="/download/files/price.ods" title="Скачать прайс в формате ods">ods</a></li>
			</p>

		</td>
		<td id="mainTr" rowspan="2">
            <div id="pTableContentTab">
    			<div id="searchDiv">
                    <input id="itemName" />
                    <div id="searchButton">Найти</div>
    			</div>
                <div id="qRes">
    				<table id="tableRes">
                        <?php
                            if($_GET["ref"]!=""){
                                $_GET["term"]=$_GET["ref"];
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
            </div>
			<div id="cloud" class="cloud">
</div>

            <div id="basketDiv" style="display:none">
                <span id="basketCaption">Заказ покупателя</span>

                <div id="switchDiv">
                    <div class="activeDiv" id="switchOrderDiv">Товары</div>
                    <div class="inactiveDiv" id="switchDeliveryDiv">Доставка</div>
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
                                Цена за единицу (руб)
                            </th>
                            
                            <th class='itemHeader'>
                                Ставка НДС
                            </th>

                            <th class='itemHeader'>
                                Сумма НДС
                            </th>
                            
                            <th class='itemHeader'>
                                Сумма (руб)
                            </th>
                         </tr>
                      </thead>
                      <tbody id='lItemTab'>
                        <tr>
                            <td class='itemNum'><a href='Добавить в заказ' class='addItem' onClick="$('#closeBasket').click(); return false" >Добавить</a> </td>
                            <td class='itemName'></td>
                            <td class='itemChar'></td>
                            <td class='itemCount'></td>
                            <td class='itemType'></td>
                            <td class='itemPrice'></td>
                            <td class='itemNDS'></td>
                            <td class='itemNDSSumn'></td>
                            <td class='itemSum'></td>
                        </tr>       
                      </tbody>
                    </table>
                    <div id='Summary'>
                        <span class='sumSpanClass'>Итого: <span id='SumAll'>0</span> руб.</span><br />
                        <span>В том числе НДС: <span id='NDSAll'>0</span> руб.</span><br />
                        <span>Общий тоннаж: <span id='WeightAll'>0</span> тн.</span><br />              
                    </div>
                </div>
                <div id="deliveryDiv">

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

<script>
	var cloud = new Cloud(
	{
		parent:"cloud"
	});
	cloud.addTag([
		{href:"http://habrahabr.ru/tag/поиск/",w:"4",text:"Арматура"},
		{href:"http://habrahabr.ru/tag/программирование/",w:"3",text:"Балка"},
		{href:"http://habrahabr.ru/tag/работа/",w:"4",text:"Квадрат"},
		{href:"http://habrahabr.ru/tag/разработка/",w:"2",text:"Круг"},
		{href:"http://habrahabr.ru/tag/реклама/",w:"6",text:"Лист"},
		{href:"http://habrahabr.ru/tag/россия/",w:"1",text:"Проволока"},
		{href:"http://habrahabr.ru/tag/сервис/",w:"1",text:"Металлосайдинг"},
		{href:"http://habrahabr.ru/tag/сервисы/",w:"3",text:"Металлочерепица"},
		{href:"http://habrahabr.ru/tag/социальные сети/",w:"7",text:"Профнастил"},
		{href:"http://habrahabr.ru/tag/спам/",w:"3",text:"Штрипс"},
		{href:"http://habrahabr.ru/tag/стартап/",w:"6",text:"Трубы"},
		{href:"http://habrahabr.ru/tag/стартапы/",w:"3",text:"Угол"},
		{href:"http://habrahabr.ru/tag/статистика/",w:"4",text:"Швеллер"},
		/*{href:"http://habrahabr.ru/tag/технологии/",w:"2",text:"технологии"},
		{href:"http://habrahabr.ru/tag/хабр/",w:"4",text:"хабр"},
		{href:"http://habrahabr.ru/tag/хабрахабр/",w:"7",text:"хабрахабр"},
		{href:"http://habrahabr.ru/tag/хостинг/",w:"1",text:"хостинг"},
		{href:"http://habrahabr.ru/tag/юзабилити/",w:"4",text:"юзабилити"},
		{href:"http://habrahabr.ru/tag/юмор/",w:"7",text:"юмор"},
		{href:"http://habrahabr.ru/tag/яндекс/",w:"6",text:"яндекс"}*/
	]
	);
</script>

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

