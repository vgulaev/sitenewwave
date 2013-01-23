<!DOCTYPE html>
<?php

$fp = fopen("../../locate/ru/templates/mainpage_template.html","r");
$template_string = fread($fp, filesize("../../locate/ru/templates/mainpage_template.html"));
fclose($fp);

$titleTamplate = '<title> Тримет </title>';
$title = '<title> Купить Online </title>';

$template_string = str_replace($titleTamplate, $title, $template_string); 
$template_string = str_replace("</body>", "", $template_string); 
$template_string = str_replace("</html>", "", $template_string); 


echo $template_string;
?>
<div id="fb-root"></div>
<script>(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/ru_RU/all.js#xfbml=1";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>

<style type="text/css">

#main2{
	background:none !important;
}

#forText{
	font-size:16px;
	padding-top:50px;
}

</style>

<link rel="stylesheet" type="text/css" href="modern_style.css" />

<table>
    <tr>
        <td id="leftTr">

            <span id='showBasketSpan'>
                <p><a href='/1cengine/site/' title='Вернуться в прайс'>Вернуться в прайс</a></p>
                <!--p><a href="/1cengine/site/fullprice.php" title="Перейти на страницу с полным прайс-листом">Полный прайс</a></p-->
                <p style="display:none;"><a href="http://trimet.ru/1cengine/productinformation/cataloginformation/index_products.php" title="Просмотреть индекс каталога товаров">Индекс</a></p>
                <p>Скачать прайс:
                    <li><a href="/download/files/price.xlsx" title="Скачать прайс в формате xls">xls</a></li>
                    <li><a href="/download/files/price.pdf" title="Скачать прайс в формате pdf">pdf</a></li>
                    <li><a href="/download/files/price.ods" title="Скачать прайс в формате ods">ods</a></li>
                </p>
            </span>
            
        </td>
        <td>
            <div id="forText">
            Мы проповедуем <a href="http://ru.wikipedia.org/wiki/Agile" rel="nofollow">Agile</a> и <a href="http://ru.wikipedia.org/wiki/Scrum" rel="nofollow">Scrum</a>.
            Поэтому мы готовы услышать все пожелания по улучшению интерфейса сайта.
            </div>

            <div class="fb-comments" data-href="http://trimet.ru/1cengine/site/howitcreating.php" data-num-posts="2" data-width="470"></div>
        </td>
    </tr>
    <tr>
        <td id="leftTrBottomTd">
            <p><a href="http://trimet.ru/1cengine/site/howmakeorder.php">Как выписать счёт?</a></p>
            <p><a href="http://trimet.ru/1cengine/site/howitcreating.php">Оставить отзыв</a></p>
        </td>
    </tr>
<table>

</div> <!-- /main -->

<?php 

// $fp = fopen("../../mainfooter_template.html","r");
echo file_get_contents("../../locate/ru/templates/mainfooter_template.html");
// fclose($fp);
?>


</body>
</html>
