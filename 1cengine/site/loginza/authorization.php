<?php session_start(); ?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<?php
//session_start();
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");

$APPLICATION->IncludeFile(
    SITE_TEMPLATE_PATH . '/include_areas/page_standart_header.php',
    array(),
    array('MODE' => 'php')
);
include_once('json.php');
?>
<link rel="stylesheet" type="text/css" href="style-auth.css" />
<?php
if(isset($_POST['token'])){
    $loginza_token = $_POST['token'];    


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
	    	if(isset($ldata->email) AND $ldata->email!=''){
	    		$lnick = $ldata->email;
	    	} else {
	    		$lnick = $luid;
	    	}
	    } else { 
	        $lnick = $ldata->nickname;
	    }
	}

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

} else {
	$login = $_POST['login'];
	$password = $_POST['password'];
	$openid = '';

}



$server = new SoapClient('http://WebService:teradel@195.239.221.58:30080/DemoTrimet/ws/PrivetOffice.1cws?wsdl', array('trace' => 1, 'location'=>'http://195.239.221.58:30080/DemoTrimet/ws/PrivetOffice.1cws'));
//$server->__doRequest('http://195.239.221.58:30080/DemoTrimet/ws/PrivetOffice.1cws');

$server->decode_utf8 = false;
$server->soap_defencoding = 'UTF-8';

$params["Login"] = $login;
$params["Password"] = $password;
$params["OpenID"] = $openid;


$result=$server->Authorize($params);
$content = $server->__getLastResponse();
//echo "!!".$content."!!";
print_r($result->GetAuthorizeResponse);
$res = array();
preg_match("/>[\w-]+</", $content, $res);
$response = $res[0];
$response = str_replace('>', '', $response);
$response = str_replace('<', '', $response);

echo "<div id='loginContent'>
        <div id='loginDiv'>";
if(!strstr($content,'Произошла ошибка')){
	$_SESSION['1cuid'] = $response;
	$_SESSION['1cusername'] = $login;
	//print_r($content);
	//print_r($response);
	if($_GET['frombasket']==1){
		echo "<br />Авторизация прошла успешно. <a href='/1cengine/site/'>Вернуться назад</a>.";
	} else {
		echo "<br />Авторизация прошла успешно. <a href='/1cengine/site/loginza'>Вернуться назад</a>. ";
	}
	
} else {
	echo "<br />Вашу карточку авторизации съел ручной динозавр. <a href='/1cengine/site/loginza'>Попробуйте снова</a>.";
}
echo "</div></div>";

?>

<?php

$APPLICATION->IncludeFile(
    SITE_TEMPLATE_PATH . '/include_areas/page_standart_pre_footer.php',
    array('css_class' => $cssClass),
    array('MODE' => 'php')
);

$APPLICATION->IncludeFile(
    SITE_TEMPLATE_PATH . '/include_areas/page_standart_footer.php',
    array(),
    array('MODE' => 'php')
);

?>
