<?php 

$srv = new SoapClient('http://WebService:teradel@195.239.221.58:30080/trimet_trade/ws/price1c.1cws?wsdl', array('trace' => 1, 'location'=>'http://195.239.221.58:30080/trimet_trade/ws/price1c.1cws'));
//$server->__doRequest('http://195.239.221.58:30080/trimet_trade/ws/price1c.1cws');

$srv->decode_utf8 = false;
$srv->soap_defencoding = 'UTF-8';

// print_r($srv->__getFunctions());


$typeArray = array('pdf');

foreach($typeArray as $type){

	$params['Type'] = $type;

	$result=$srv->GetPriceFile();
	$content = $srv->__getLastResponse();

	$res = array();
	preg_match("/>[\w-]+</", $content, $res);
	$response = $res[0];
	$response = str_replace('>', '', $response);
	$response = str_replace('<', '', $response);

	//if($response=='Well'){
		$filename = 'http://195.239.221.58:30080/download/price.'.$params['Type'];
	
		$file = fopen($filename, "r"); //Открываем файл
		$contents = '';
		while (!feof($file)) {
		  $contents .= fread($file, 8192);
		}

		fclose($file); 

		$filenameOut = '/web/trimetru/site/www/download/files/price.'.$params['Type'];
		$file = fopen($filenameOut, "w");
		fwrite($file, $contents);
		fclose($file);

		echo $params['Type']." прайс создан";
	//}

}

?>
