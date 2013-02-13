<?php
/**
 * The Header for our theme.
 *
 * Displays all of the <head> section and everything up till <div id="main">
 *
 * @package WordPress
 * @subpackage Twenty_Twelve
 * @since Twenty Twelve 1.0
 */
?><!DOCTYPE html>
<?php

$wwwdir = "C:/Users/Administrator/workspace/sitenewwave/";
$fp = fopen($wwwdir."/locate/ru/templates/mainpage_template.html","r");
$template_string = fread($fp, filesize($wwwdir."/locate/ru/templates/mainpage_template.html"));
fclose($fp);

$titleTemplate = '<title> Тримет </title>';
$keywordsTemplate = '"металлопрокат, профнастил, металлосайдинг, купить, онлайн, тюмень, арматура, балка, швеллер, трубы, угол, штрипс, квадрат, круг, лист, проволока" />';

if(isset($_GET["ref"])){
    $ntitle = str_replace("\\\"", "\"",$_GET["ref"]);
    $ntitle = str_replace("(", "", $ntitle);
    $ntitle = str_replace(")", "", $ntitle);
    $ntitle = str_replace("\"", "", $ntitle);

    $title = '<title> '.$ntitle.' купить онлайн | Тримет ООО </title>';

    $keywordsArray = explode(" ", $ntitle);
    $keywordsString = "";
    foreach($keywordsArray as $keyword){
        $keywordsString .= $keyword.", ";
    }
    $keywordsString .= "купить, онлайн, тюмень";

    $keywords = '"'.$keywordsString.'" />';
    
    // $APPLICATION->SetPageProperty("keywords", "".$_GET["ref"].", купить, тримет, тюмень");
    // $APPLICATION->SetPageProperty("description", "Купить ".$_GET["ref"]." в компании Тримет");
} else {
    $title = '<title> Купить Online </title>';
    $keywords = $keywordsTemplate;
    // $APPLICATION->SetPageProperty("keywords", "металлопрокат, профнастил, металлосайдинг, купить, онлайн, тюмень, арматура, балка, швеллер, трубы, угол, штрипс, квадрат, круг, лист, проволока");
    // $APPLICATION->SetPageProperty("description", "Покупка металлосайдинга, профнастила, металлопроката в Тюмени онлайн");
}

$template_string = str_replace($titleTemplate, $title, $template_string); 
$template_string = str_replace($keywordsTemplate, $keywords, $template_string); 
$template_string = str_replace("</body>", "", $template_string); 
$template_string = str_replace("</html>", "", $template_string); 


echo $template_string;

// Более не нужный кусок кода
// if(isset($_GET["ref"])){
//     if(strstr($_GET["ref"], "кастом")!=false){

//         header( 'Refresh: 0; url=http://trimet.ru/404.html?ref='.urlencode($_GET["ref"]).'' );
//     }
// }
?>
	<div id="main" class="wrapper">