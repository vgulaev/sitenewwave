<?php

require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
?>
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

<link rel="stylesheet" type="text/css" href="modern_style.css" />


<script type="text/javascript">

    function htmlspecialchars_decode(string, quote_style) {  
        // http://kevin.vanzonneveld.net  
        //     original by: Mirek Slugen  
        //     improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)  
        //     bugfixed by: loonquawl  
        // *     example 1: htmlspecialchars_decode("<p>this -> "</p>", 'ENT_NOQUOTES');  
        // *     returns 1: '<p>this -> "</p>'  
          
        string = string.toString();  
          
        // Always encode  
        string = string.replace('/&/g', '&');  
        string = string.replace('/</g', '<');  
        string = string.replace('/>/g', '>');  
          
        // Encode depending on quote_style  
        if (quote_style == 'ENT_QUOTES') {  
            string = string.replace('/"/g', '"');  
            string = string.replace("/'/g", '\'');  
        } else if (quote_style != 'ENT_NOQUOTES') {  
            // All other cases (ENT_COMPAT, default, but not ENT_NOQUOTES)  
            string = string.replace('/"/g', '"');  
        }  
          
        return string;  
    }  

    

$(document).ready( function(){

	$("#itemName").focusin( function(){
		$("#itemName").css("box-shadow", "0 0 5px 2px #ffe06f, 0px 1px 1px rgb(207, 207, 207) inset")
	})
	$("#itemName").focusout( function(){
		$("#itemName").css("box-shadow", "0px 1px 1px rgb(207, 207, 207) inset")
	})

	$("#itemName").focus();
	//$("#itemName").css("outline", "1px solid rgb(48, 57, 154)")

	$("#showAll").click( function(){
		value = $("#itemName").attr('value')
		$.ajax({
	        type: "GET",
	        url: "getItems.php",
	        async: false,
	        data: "term="+value+"&show_all",
	        success: function(html){
	            $("#tableRes").empty()
				
				$(html).appendTo("#tableRes")
				$("#showAll").hide();
			}
        
    	});
	})
	
		
	tmOutId = 0

	$("#itemName").change(function () {

		value = $("#itemName").attr('value')
		$.ajax({
	        type: "GET",
	        url: "getItems.php",
	        async: false,
	        data: "term="+value+"",
	        success: function(html){
	            $("#tableRes").empty()
				
				$(html).appendTo("#tableRes")
				if($(".item").length==20){
					$("#showAll").show();
				} else {
					$("#showAll").hide();
				}
				
			}
        
    	});
		
		// $("#itemName").autocomplete( "option", "source", "getItems.php" )
	})

	$("#itemName").keyup( function () {
                
                keyEvent = this;
                window.clearTimeout(tmOutId);
                tmOutId = window.setTimeout(  
                    function() {  
                        $(keyEvent).change();  
                    },  
                    1000  
                );
            
                
            });

	// $("#itemName").change( function(){
	// 	$("#tableRes").empty()
	// 	$(".ui-corner-all").each( function(){
	// 		var row = $(this).find('a').html()
	// 		//alert(row)
	// 		row = htmlspecialchars_decode(row)
	// 		$(row).appendTo("#tableRes")
	// 	})

	// })

})
</script>

<table style="width:100%;">
	<tr>
		<td id="leftTr">

			<p><a href="/1cengine/site/" title="Перейти на страницу с полным прайс-листом">Полный прайс</a></p>
			<p>Скачать прайс:
				<li><a href="/download/files/price.xlsx">xls</a></li>
				<li><a href="/download/files/price.pdf">pdf</a></li>
				<li><a href="/download/files/price.odf">odf</a></li>
			</p>

		</td>
		<td id="mainTr" rowspan="2">

			<input id="itemName" />

			<div id="searchButton">Найти</div>
			<div id="qRes">
				<table id="tableRes">

				</table>
			</div>
			<p>
				<a id="showAll" style="display:none" href="Все результаты" onClick="return false">
					Показать все результаты
				</a>
			</p>

		</td>
	</tr>
	<tr>
		<td id="leftTrBottomTd">
			<p><a href="">Как выписать счёт?</a></p>
			<p><a href="">P.S.: Как это создается...</a></p>
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

