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

<?php
    $filename = $_POST['file_format']; //Имя файла для прикрепления
    $to = $_POST['mail_to']; //Кому
    $from = "admin@trimet.ru"; //От кого
    $subject = '=?utf-8?B?'.base64_encode('Заказ Тримет').'?=';
    $message = "Компания Тримет благодарит вас за покупку и расчитывает на дальнейшее сотрудничество"; //Текст письма
    $boundary = "---"; //Разделитель
    /* Заголовки */
    $headers = "From: $from\nReply-To: $from\n";
    $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"";
    $body = "--$boundary\n";
    /* Присоединяем текстовое сообщение */
    $body .= "Content-type: text/html; charset=utf-8\n";
    $body .= "Content-Transfer-Encoding: quoted-printablenn";
    $body .= "Content-Disposition: attachment; filename==?utf-8?B?".base64_encode($filename)."?=\n\n";
    $body .= $message."\n";
    $body .= "--$boundary\n";
    $file = fopen($filename, "r"); //Открываем файл
    $contents = '';
    while (!feof($file)) {
      $contents .= fread($file, 8192);
    }
    // $text = fread($file, filesize($filename)); //Считываем весь файл
    fclose($file); //Закрываем файл
    /* Добавляем тип содержимого, кодируем текст файла и добавляем в тело письма */
    $body .= "Content-Type: application/octet-stream; name==?utf-8?B?".base64_encode($filename)."?=\n";
    $body .= "Content-Transfer-Encoding: base64\n";
    $body .= "Content-Disposition: attachment; filename==?utf-8?B?".base64_encode($filename)."?=\n\n";
    $body .= chunk_split(base64_encode($contents))."\n";
    $body .= "--".$boundary ."--\n";
    if(mail($to, $subject, $body, $headers)){
        echo 'Отправлено';
        echo "
            <script type='text/javascript'>
                function jumpToPrice(){
                    window.location = '../index.php'
                }
                setTimeout('jumpToPrice()', 5000);        
            </script>
            ";
    }
?>

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
</body>