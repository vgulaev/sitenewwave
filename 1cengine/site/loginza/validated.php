<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<?php

require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");

$APPLICATION->IncludeFile(
    SITE_TEMPLATE_PATH . '/include_areas/page_standart_header.php',
    array(),
    array('MODE' => 'php')
);

$APPLICATION->IncludeFile(
    SITE_TEMPLATE_PATH . '/include_areas/page_standart_pre_footer.php',
    array('css_class' => $cssClass),
    array('MODE' => 'php')
);

/*$APPLICATION->IncludeFile(
    SITE_TEMPLATE_PATH . '/include_areas/page_standart_footer.php',
    array(),
    array('MODE' => 'php')
);*/
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");
include_once('json.php');

?>

Вы прошли.
<?php
if(isset($_POST['token'])){
    $loginza_token = $_POST['token'];    
}

if(isset($loginza_token)){
    $json = new Services_JSON();    // получаем и декодируем данные от Логинзы
    $loginza_data = file_get_contents('http://loginza.ru/api/authinfo?token='.$loginza_token);
    $ldata = $json->decode($loginza_data);
    if(isset($ldata->error_type)){ 
        $errorLog = 'Произошла ошибка: '.$ldata->error_message.' Попробуйте еще раз.';
    } 

} else {
// не запросил, выводим форму c кнопкой
    //return tpl_process($tpl_outer, $tpl);
}

// логинза была запрошена, осуществляем процессинг
if(!$errorLog) {

    // определяем имя провайдера, логин и никнейм пользователя
   
    if(!isset($ldata->uid)) {
        $luid = parse_url($ldata->identity);
        $luid = explode('.',$luid['host']); 
        $luid = $luid[0]; 
    } else {
        $luid =  $ldata->uid;
    }
    if(!isset($ldata->nickname)){ 
        $lnick = $luid; 
    } else { 
        $lnick = $ldata->nickname;
    }
}

echo '<img src="'.$ldata->photo.'" />';
echo '<br />Ваш логин: '.$lnick;
echo '<br />Ваше полное имя: '.$ldata->name->first_name.' '.$ldata->name->last_name;
echo '<br />Ваш e-mail: '.$ldata->email;
echo '<br />провайдер: '.$ldata->provider;
echo '<br />uid: '.$ldata->uid;
echo '<br />id: '.$ldata->identity;

echo "<br /><a href='/1cengine/site/loginza'>Назад</a>";

$server = new SoapClient('http://WebService:teradel@195.239.221.58:30080/DemoTrimet/ws/PrivetOffice.1cws?wsdl', array('trace' => 1, 'location'=>'http://195.239.221.58:30080/DemoTrimet/ws/PrivetOffice.1cws'));
//$server->__doRequest('http://195.239.221.58:30080/DemoTrimet/ws/PrivetOffice.1cws');
echo '<br />Новый соап клиент создан';
$server->decode_utf8 = false;
$server->soap_defencoding = 'UTF-8';

if($ldata->provider=="http://openid.yandex.ru/server/"){
	$openid = "YandexID";
} elseif($ldata->provider=="https://www.google.com/accounts/o8/ud"){
	$openid = "GoogleID";
} elseif($ldata->provider=="http://vkontakte.ru/"){
	$openid = "VkontakteID";
} elseif($ldata->provider=="http://www.facebook.com/"){
	$openid = "FacebookID";
} elseif($ldata->provider=="mailru"){
	$openid = "MailruID";
} else {
	$openid = 'UnknownId';
}

$openid .= ':'.$ldata->identity;

$login = $lnick;

$params["Login"] = $login;
$params["Password"] = '';
$params["OpenID"] = $openid;
echo '<br />параметры заданы';
echo '<br />'.$login.' | '.$openid;
$result = $server->Authorize($params);
$content = $server->__getLastResponse();
echo '<br />к серверу обратились';
echo $content;
/*
$filename = 'price.xml';
$handle = fopen($filename, 'w+');
fwrite($handle, $content);
fclose($handle);
*/
print_r($result->GetAuthorizeResponse);
echo '<br />Выполнение скрипта дошло до конца';

?>
