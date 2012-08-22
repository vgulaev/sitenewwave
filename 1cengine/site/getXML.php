<html>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">

<?php echo "Доброе утро!"; ?>

<?php

$server = new SoapClient('http://WebService:teradel@195.239.221.58:30080/DemoTrimet/ws/price1c.1cws?wsdl', array('trace' => 1, 'location'=>'http://195.239.221.58:30080/DemoTrimet/ws/price1c.1cws'));
//$server->__doRequest('http://195.239.221.58:30080/DemoTrimet/ws/price1c.1cws');

$server->decode_utf8 = false;
$server->soap_defencoding = 'UTF-8';

$result=$server->GetPrice("");
$content = $server->__getLastResponse();

$filename = 'price.xml';
$handle = fopen($filename, 'w+');
fwrite($handle, $content);
fclose($handle);

print_r($result->GetPriceResponse);


?>

<?php echo "Я живой и я справился с поставленной задачей ^___^"; ?>

</html>