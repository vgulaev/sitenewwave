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



<!-- Put this script tag to the <head> of your page -->
<script type="text/javascript" src="http://userapi.com/js/api/openapi.js?50"></script>

<script type="text/javascript">
  VK.init({apiId: 3039078, onlyWidgets: true});
</script>

<?php
$APPLICATION->IncludeFile(
    SITE_TEMPLATE_PATH . '/include_areas/page_standart_header.php',
    array(),
    array('MODE' => 'php')
);

?>

<script type="text/javascript" src='/1cengine/site/js/jquery.js'> </script>
<script type="text/javascript" src='/1cengine/site/js/jquery.blockUI.js'> </script>
<script type="text/javascript" src='/1cengine/site/js/Array.js'> </script>
<script type="text/javascript" src='/1cengine/site/js/jquery.cookie.js'> </script>
<script type="text/javascript" src='/1cengine/site/js/jquery.chromatable.js'> </script>
<script type="text/javascript" src='/1cengine/site/js/jquery-ui-1.8.20.custom.min.js'> </script>

<script type="text/javascript" src='/1cengine/site/js/getPrice.js'> </script>
<script type="text/javascript" src='/1cengine/site/js/uiJS.js'> </script>
<script type="text/javascript" src='/1cengine/site/js/uiBasket.js'> </script>
<script type="text/javascript" src='js/uiOrders.js'> </script>

<style>
	.ui-autocomplete {
		max-height: 100px;
		overflow-y: auto;
		/* prevent horizontal scrollbar */
		overflow-x: hidden;
		/* add padding to account for vertical scrollbar */
		padding-right: 20px;
		width: 200px;
		background-color: white;
		text-align:right;
	}
	/* IE 6 doesn't support max-height
	 * we use height instead, but this forces the menu to always be this tall
	 */
	* html .ui-autocomplete {
		height: 100px;
	}
	</style>

	<script type="text/javascript">

$(document).ready( function() {

	//alert(String(document.location))
	var squery = String(document.location).replace(/\%2F/g, "\\")
	var squery = String(document.location).replace(/\s\s/g, "\s")
	if(squery.split("?",2)[1]){
		parts=squery.split("?",2)[1].split("&");
	GET={};
	for (i=0; i<parts.length; i++) {
   			curr = parts[i].split('=');
   			GET[curr[0]] = curr[1];
		}
		if(GET['ref']!=undefined){
			searchItem(decodeURI(GET['ref']))
		}
		
		if(GET['uid']!=undefined){
			getOrder(decodeURI(GET['uid']))
			$.cookie('basket', null)
			$.cookie('basketWeight', null)
		}
		
		if(GET['catalog']!=undefined){
			showGroup(decodeURI(GET['catalog']))
		}

		if(GET['linkUID']!=undefined){
			openLink(GET['linkUID'], GET['type'])
		}
	}


    if($.cookie("basket")){
      var cook = $.cookie("basket")
      eval(cook)
    }
    if($.cookie("basketWeight")){
        var basketWeight = $.cookie("basketWeight")
        eval(basketWeight)
    }

	townS = $('#townSelect option:selected').attr('value')
	
	$("#destination").autocomplete({
			source:"getStreet.php?town="+townS,
		    delay:10,
		    minChars:2,
		    matchSubset:1,
		    autoFill:false,
		    matchContains:1,
		    cacheLength:10,
		    selectFirst:true,
		    maxItemsToShow:10,
		});
	
	$("select").change(function () {
		
		townS = $('#townSelect option:selected').attr('value')
		$("#destination").autocomplete( "option", "source", "getStreet.php?town="+townS )
	})


	
	

})

function openPrint(){
	//var print = window.open('print.php', '_blank')
	//form = printForm().innerHTML
	printForm(print)
	//print.document.write(printForm())
}
</script>


<link rel="stylesheet" type="text/css" href="/bitrix/templates/trimet/css/style.css" />
		<!--[if gte IE 6]> 
		<style>
		td#scrtd{
			width:16px;
			border-left: 1px solid black;
			min-width:16px;
		}
		li.itemGroup span.itemPrice{
			border-left: 1px solid black;
	
			min-width: 102px;
			width: 102px;
			max-width: 102px;
			text-align: right;
			padding-right: 5px;
			white-space:nowrap;

		}
		</style>
		<![endif]-->

<div id="fb-root"></div>
<script>(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/ru_RU/all.js#xfbml=1";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>
            
<h1 style="font-size:14px;display:none">Покупка металлопроката, профнастила и металлосайдинга онлайн</h1>
		
<div style="float:right;">
	<p id='ptitle' align='left'>Мы рекомеднуем интернет-браузер <a href='http://www.mozilla.org/ru/firefox/new' rel="nofollow">Mozilla Firefox</a>
		<a href="http://trimet.ru/1cengine/productinformation/cataloginformation/index_products.php" title="Перейти в индекс каталога товаров"> Индекс</a>
		<a href="http://trimet.ru/1cengine/site/index.php" title="Перейти в новый быстрый прайс"> Новая версия прайса</a>
	</p>
</div>

<!--<div style="float:left;">
	<a target="_blank" class="mrc__plugin_uber_like_button" href="http://connect.mail.ru/share" data-mrc-config="{'cm' : '1', 'ck' : '1', 'sz' : '20', 'st' : '1'}">Нравится</a>
	<script src="http://cdn.connect.mail.ru/js/loader.js" type="text/javascript" charset="UTF-8"></script>
</div>-->
<div style="float:left;width:75px;">
<!-- Place this tag where you want the +1 button to render. -->
<div class="g-plusone" data-size="medium"></div>

<!-- Place this tag after the last +1 button tag. -->
<script type="text/javascript">
  window.___gcfg = {lang: 'ru'};

  (function() {
    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/plusone.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
  })();
</script>
</div>

<div style="float:left;width:135px;">
<!-- Put this div tag to the place, where the Like block will be -->
<div id="vk_like"></div>
<script type="text/javascript">
VK.Widgets.Like("vk_like", {type: "button"});
</script>
</div>

<div style="float:left;width:110px;">
	<a href="https://twitter.com/share" class="twitter-share-button" data-lang="ru">Твитнуть</a>
	<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
</div>

<div style="float:left;width:145px;">
	<div class="fb-like" data-href="http://trimet.ru/1cengine/site/index.php" data-send="false" data-layout="button_count" data-width="450" data-show-faces="true"></div>
</div>


<div style='width:100%;height:35px;float:left'>
	<div style='width:300px;float:left;margin-top:3px;margin-left:10px'>Скачать прайс в формате 
		<a href='/download/files/price.xlsx' title='Скачать прайс в формате XLS' >
			<img src='/bitrix/templates/trimet/css/document-excel.png' alt='Скачать прайс в формате XLS' />
		</a>
		<a href='/download/files/price.pdf' title='Скачать прайс в формате PDF'>
			<img src='/bitrix/templates/trimet/css/document-pdf.png' alt='Скачать прайс в формате PDF' />
		</a>
		<a href='/download/files/price.ods' title='Скачать прайс в формате ODS'>
			<img src='/bitrix/templates/trimet/css/document-ods.png' width='16' alt='Скачать прайс в формате ODF' />
		</a>

	</div>
	<div id="form"></div>
</div>
<div id='priceDiv'>
	<table id='pTable'>
		<tr id='pTableHead'>
			<td>Каталог продукции</td><td class='hollowTD'></td>
			<td> 
				<span id='showBasketSpan'><a href='Показать заказ' title='Перейти в корзину' id='tabBasket' onClick='return false'>Показать заказ (<span class='basketCount'>0</span>)</a></span>
				<span id='showPriceSpan'><a href='Показать прайс' title='Перейти в прайс' id='tabPrice' onClick='return false'>Вернуться в прайс</a></span>
				<span id='priceSpan'>Показывать цену за
					<select id='priceSelect'>
						<option value='TN'> тонну </option>
						<option value='PC'> штуку </option>
						<option value='PM'> метр </option>
					</select>
				</span>
			</td>
		</tr>

		<tr id='pTableBody'>
			<td id='pTableList'>

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
					$APPLICATION->SetTitle("Купить Online полный прайс");
					$APPLICATION->SetPageProperty("keywords", "металлопрокат, профнастил, металлосайдинг, купить, онлайн, тюмень, арматура, балка, швеллер");
				 	$APPLICATION->SetPageProperty("description", "Покупка металлосайдинга, профнастила, металлопроката в Тюмени онлайн");
				}
				require_once('phpXml.php');
			?>

			</td>
			<td class='hollowTD'></td>
			<td id='pTableContent'>
					<table id='pTableContentTab'>
						<thead>
							<tr>
								<th>Номенклатура</th><th>мера</th>
								<th class='itemTN'><span class='c4'>до 2тн</span><span class='c3' style='display:none'>до 100 м<sup>2</sup></span> <br />(цена <font color="red">Я</font>ндекса)</th><th class='itemTN'><span class='c4'>2-8тн</span><span class='c3' style='display:none'>от 100 до 200 м<sup>2</sup></span></th><th class='itemTN'><span class='c4'>8-15тн</span><span class='c3' style='display:none'>от 200 м<sup>2</sup></span></th><th class='itemTN'><span class='c4'>более 15тн</span></th>
								<th class='itemPC_hid'><span class='c4'>до 2тн</span><span class='c3' style='display:none'>до 100 м<sup>2</sup></span></th><th class='itemPC_hid'><span class='c4'>2-8тн</span><span class='c3' style='display:none'>от 100 до 200 м<sup>2</sup></span></th><th class='itemPC_hid'><span class='c4'>8-15тн</span><span class='c3' style='display:none'>от 200 м<sup>2</sup></span></th><th class='itemPC_hid'><span class='c4'>более 15тн</span></th>
								<th class='itemPM_hid'><span class='c4'>до 2тн</span><span class='c3' style='display:none'>до 100 м<sup>2</sup></span></th><th class='itemPM_hid'><span class='c4'>2-8тн</span><span class='c3' style='display:none'>от 100 до 200 м<sup>2</sup></span></th><th class='itemPM_hid'><span class='c4'>8-15тн</span><span class='c3' style='display:none'>от 200 м<sup>2</sup></span></th><th class='itemPM_hid'><span class='c4'>более 15тн</span></th>
							</tr>
						</thead>
						<tbody>
						</tbody>
					</table>
					<div id='basketDiv'>
						<div id='basketCaption'>
							<!-- <span class='leftCapt'><img src='/bitrix/templates/trimet/css/basketBig.png' /></span> -->
							
							
								<?php
									if(isset($_GET['uid'])){
										echo '<span class="centerCapt2">Ваш заказ номер <span id="nOrder"></span></span>';
									} else {
										echo '<span class="centerCapt">Ваша корзина</span>';
									}
								?>
							
							<!-- <span class='rightCapt'><a href='Закрыть' id='closeBasket' onClick='return false'><img src='/bitrix/templates/trimet/css/basketClose.png' /></a></span> -->
						</div>
					    <p>Цена включает в себя НДС</p>
					    <!--<span>С доп обработкой <input type='checkbox' id='dopObCh' /></span>-->
					    <div class='tableDiv'>
							<table id='basketTab' cellspacing='0' cellpadding='0'>
						      <thead>
						         <tr>
						            <th class='itemHeader'>
						               
						            </th>
						            
						            <th class='itemHeader'>
						               Номенклатура
						            </th>
						            
						            <th class='itemHeader'>
						               Мера
						            </th>
						            
						            <th class='itemHeader'>
						               Количество
						            </th>
						            
						            <th class='itemHeader'>
						            	Ед.
						            </th>

						            <th class='itemHeader'>
						               Количество (шт)
						            </th>
						            
						            <th class='itemHeader'>
						               Длина (м)
						            </th>
						            
						            <th class='itemHeader'>
						               НДС
						            </th>
						            
						            <th class='itemHeader'>
						               Цена за единицу (руб)
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
								    <td class='itemWeight'></td>
								    <td class='itemType'></td>
							        <td class='itemCount'></td>
							        <td class='itemLength'></td>
							        <td class='itemNDS'></td>
							        <td class='itemPrice'></td>
							        <td class='itemSum'></td>
							    </tr>       
						      </tbody>
						    </table>
						</div>
					    
					    <div id='summaryDiv'>
					    	<div id='shipment'>
							<form id='shipmentForm'>
							
								Доставка <input type='checkbox' name='checked' id='schb' /> <br />
								<div id='sFormChecked'>

									<table id='deliveryTab'>
										<tr>
											<td>Выберете город:</td>
											<td>
												<select id='townSelect'>
												<option value='' disabled>--</option>
												<option value='72000001'>Тюмень</option>
												<option value='74002003'>Аша</option>
												<option value='660000280005'>В. Салда</option>
												<option value='66000001'>Екатеринбург</option>
												<option value='72009001'>Заводоуковск</option>
												<option value='72011001'>Ишим</option>
												<option value='03020000139'>Курган</option>
												<option value='72013000001'>Н. Тавда</option>
												<option value='66000023'>Н. Тагил</option>
												<option value='86000014'>Нефтеюганск</option>
												<option value='86000011'>Нижневартовск</option>
												<option value='54000001'>Новосибирск</option>
												<option value='89000006'>Новый Уренгой</option>
												<option value='55000001'>Омск</option>
												<option value='66000016'>Первоуральск</option>
												<option value='66000017'>Полевской</option>
												<option value='86000007'>Пыть-Ях</option>
												<option value='86000010'>Сургут</option>
												<option value='660000360005'>Тавда</option>
												<option value='72000002'>Тобольск</option>
												<option value='72018000001'>Уват</option>
												<option value='86000001'>Ханты-Мансийск</option>
												<option value='74000001'>Челябинск</option>
												<option value='45000002'>Шадринск</option>
												<option value='72021001'>Ялуторовск</option>
											</select>
											</td>
										</tr>
										<tr>
											<td>Введите адрес:</td>
											<td>
												<input type='textarea' name='destination' id='destination' value='' placeholder='Введите здесь адрес' /> 
											</td>
										</tr>
										<tr>
											<td>Выберете транспорт:</td>
											<td>
												<select id='carry' name='carry'>
													<option value='Длинномер' checked /> Длинномер </option>
													<option value='Газель' /> Газель </option>
												</select>
											</td>
										</tr>
									</table>

								</div>
							</form>
						</div>
						    <div id='Summary'>
								<span class='sumSpanClass'>Итого: <span id='SumAll'>0</span> руб.</span><br />
								<span>В том числе НДС: <span id='NDSAll'>0</span> руб.</span><br />
						        <span>Общий тоннаж: <span id='WeightAll'>0</span> тн.</span><br />		        
						    </div>
						</div>
						
					    <div id='forPrintDiv'>
					    	<span id='email'>E-mail для подтверждения заказа: <input id='emailInput' type='textarea' value='' /></span>
						    <span id='forPrint'>
						    	<?php if(isset($_GET['uid'])){ echo "<a href='Обновить заказ' onClick=\"updateOrder('".$_GET['uid']."'); return false\"> Обновить заказ </a>"; } ?>
						    	<!--<a href='javascript:openPrint()'>Версия для печати</a>-->
						    	Сохранить заказ в формате
						    	<a href='javascript:getOrderFomat("xlsx")' title='Сохранить заказ в формате xlsx' >
						    		<img src='/bitrix/templates/trimet/css/xls.png' width='32' alt='xlsx' />
						    	</a>
						    	<a href='javascript:getOrderFomat("pdf")' title='Сохранить заказ в формате pdf' >
						    		<img src='/bitrix/templates/trimet/css/pdf.png' width='32' alt='pdf' />
						    	</a>
						    	<a href='javascript:getOrderFomat("html")' title='Сохранить заказ в формате html' >
						    		<img src='/bitrix/templates/trimet/css/html.png' width='32' alt='html' />
						    	</a>
						    	<a href='javascript:getOrderFomat("ods")' title='Сохранить заказ в формате ods' >
						    		<img src='/bitrix/templates/trimet/css/ods.png' width='32' alt='ods' />
						    	</a> 
							</span>
							
						</div>
					</div>
				
			</td>
		</tr>
	</table>

</div>


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



