<html>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">

<?php

$server = new SoapClient('http://WebService:teradel@195.239.221.58:30082/trimet_trade/ws/Register.1cws?wsdl', array('trace' => 1, 'location'=>'http://195.239.221.58:30082/trimet_trade/ws/Register.1cws'));
//$server->__doRequest('http://195.239.221.58:30082/trimet_trade/ws/PrivetOffice.1cws');

$server->decode_utf8 = false;
$server->soap_defencoding = 'UTF-8';

$params["Login"] = "saurterrs";
$params["Password"] = "qwerty";
$params["Email"] = "elf607@ya.ru";
$params["FullName"] = "Alexander Fedorov";
$result=$server->AddUser($params);
$content = $server->__getLastResponse();
echo $content;
/*
$filename = 'price.xml';
$handle = fopen($filename, 'w+');
fwrite($handle, $content);
fclose($handle);
*/
print_r($result->GetAddUserResponse);


?>
</html>
