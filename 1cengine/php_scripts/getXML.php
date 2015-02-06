<html>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">

<?php echo "Доброе утро!"; ?>

<?php

$server = new SoapClient('http://195.239.221.58:30082/trimet_trade/ws/price1c.1cws?wsdl', array('trace' => 1, 'location'=>'http://195.239.221.58:30082/trimet_trade/ws/price1c.1cws'));
//$server->__doRequest('http://195.239.221.58:30082/trimet_trade/ws/price1c.1cws');

$server->decode_utf8 = false;
$server->soap_defencoding = 'UTF-8';

$result=$server->GetPrice("");
$content = $server->__getLastResponse();

$fileout = '/web/trimetru/site/www/import/price.xml';
$handle = fopen($fileout, 'w+');

$filein = 'http://195.239.221.58:30080/download/price.xml';

$file = fopen($filein, "r"); //Открываем файл
$contents = '';
while (!feof($file)) {
  $contents .= fread($file, 8192);
}

fwrite($handle, $contents);
fclose($handle);
fclose($file);

// print_r($result->GetPriceResponse);


?>

<?php echo "Я живой и я справился с поставленной задачей ^___^"; ?>

</html>