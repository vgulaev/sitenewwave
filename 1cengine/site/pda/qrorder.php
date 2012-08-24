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

<script type="text/javascript" src="/1cengine/site/js/jquery.js"></script> 
<script type="text/javascript"> 
$(document).ready(function(){ 
    $(".FileTypeInputClass").change(function(){ 
        if($(this).is(":checked")){
            $('.file_label').removeClass("LabelSelected");
            $(this).next("label").addClass("LabelSelected"); 
        }else{ 
            $(this).next("label").removeClass("LabelSelected"); 
        } 
    });   
}); 
function file_download(){
    if($('.LabelSelected').attr('for')!=undefined){
        var id = $('.LabelSelected').attr('for')
        inp = $('#'+id)
        window.location.href = $(inp).attr('value')    
    } else {
        alert("Вы не выбрали формат файла")
    }
    
}

function send(){
    var id = $('.LabelSelected').attr('for')
    inp = $('#'+id)
    alert($(inp).attr('value'))
}
</script>

<style>
.file_label img{
    width:100px;
    cursor:pointer;
}
.LabelSelected img{
    margin-bottom:10px;
    width:128px;
}
</style>

<?php 
    require_once('../getfilelink.php');  
    $APPLICATION->SetTitle('Тримет мобильный заказ');
?>

        <div style="margin-left: 200px"> <h2 style="font-size:24px">Скачать интересующий вас формат:</h2> <br />  
        <form method='POST' action='mail.php'> 
            <input class="FileTypeInputClass" type="radio" name="file_format" value=<?php echo '"'.$answerArray[0].'"'; ?> style="display:none;" id="xlsx" />
                <label class="file_label" id="label_xml" for="xlsx">
                    <img src='xls.png' />
                </label>
            <input class="FileTypeInputClass" type="radio" name="file_format" value=<?php echo '"'.$answerArray[1].'"'; ?> style="display:none;" id="ods" />
                <label class="file_label" id="label_ods" for="ods">
                    <img src='ods.png' />
                </label>
            <input class="FileTypeInputClass" type="radio" name="file_format" value=<?php echo '"'.$answerArray[2].'"'; ?> style="display:none;" id="html" />
                <label class="file_label" id="label_html" for="html">
                    <img src='html.png' />
                </label>
            <input class="FileTypeInputClass" type="radio" name="file_format" value=<?php echo '"'.$answerArray[3].'"'; ?> style="display:none;" id="pdf" />
                <label class="file_label" id="label_pdf" for="pdf">
                    <img src='pdf.png' />
                </label>
        
            <p style="margin-top:15px;margin-left:10px;width:425px;margin-bottom:30px">
                <font style="font-size:22px" > E-mail: </font>
                <input type="textarea" style="width:340px;height:30px;font-size:20px;margin-bottom:20px;" name="mail_to" /> <br /> 
                <input type="submit" value="Отправить" style="width:200px;height:100px;font-size:24px;float:left;margin-left:5px" />
                <input type="button" style="width:200px;height:100px;font-size:24px;float:right;margin-right:10px;" value="Скачать" onClick="file_download()" />
            </p>
            </form>
            <br />
            <p>
                Зарегистрируйтесь, и мы запомним ваш электронный адрес, а так же вы получите возможность самостоятельно создавать счёт и просматривать историю заказов.
            </p>
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

            <!-- <div id="autor">
                <p>Создание сайта</p>
                <a href="http://russianmultimedia.ru/contacts.php#feedback" title="Создание сложных мультимедийных продуктов: сайтов публичных компаний, 3d-видео и стерео роликов, мультимедийных инсталляций" target="_blank">Russian multimedia company</a>
            < -->/div>
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
