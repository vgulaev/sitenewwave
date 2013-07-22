<?php session_start();

function array_to_objecttree($array) {
  if (is_numeric(key($array))) { // Because Filters->Filter should be an array
    foreach ($array as $key => $value) {
      $array[$key] = array_to_objecttree($value);
    }
    return $array;
  }
  $Object = new stdClass;
  foreach ($array as $key => $value) {
    if (is_array($value)) {
      $Object->$key = array_to_objecttree($value);
    }  else {
      $Object->$key = $value;
    }
  }
  return $Object;
}

//$orderString = $_POST['orderString'];
$orderString = "c2df1f98-d8c3-11de-a90e-0011d859b2e6:14:1.034;ca3e31e0-4e1b-11db-8e4f-000795aaadaf:46:2.081;be5c81c7-2754-11db-bb32-000795aaadaf:128:3.008;";
if($_SESSION['1cusername']!=''){
	$user = $_SESSION['1cusername'];
} else {
	$user = 'Anonymous';
}


$dt = date('d.m.Y');

$OrderFromSite["Заказчик"] = $user;
$OrderFromSite["Дата"] = $dt;

$orderStringArray = split(';', $orderString);
$GoodsList["СтрокиТаблицы"] = array();

foreach($orderStringArray as $orderItem){

	if(!$orderItem==''){
		$orderItemArray = split(':', $orderItem);
		$GoodsRow["Ссылка"] = $orderItemArray[0];
		$GoodsRow["КоличествоШтук"] = $orderItemArray[1];
		$GoodsRow["КоличествоВес"] = $orderItemArray[2];
		
		array_push($GoodsList["СтрокиТаблицы"], $GoodsRow); 
	}	
	
}


$OrderFromSite["Товар"] = $GoodsList;


$params["XDTOStructure"] = $OrderFromSite;

print_r($params["XDTOStructure"]);


$server = new SoapClient('http://WebService:teradel@195.239.221.58:30080/DemoTrimet/ws/OrderKlient.1cws?wsdl', array('trace' => 1, 'location'=>'http://195.239.221.58:30080/DemoTrimet/ws/OrderKlient.1cws', 'features' => SOAP_USE_XSI_ARRAY_TYPE));
//$server->__doRequest('http://195.239.221.58:30080/DemoTrimet/ws/PrivetOffice.1cws');

$server->decode_utf8 = false;
$server->soap_defencoding = 'UTF-8';

//$params["XDTOStructure"] = $xmlString;

$result=$server->SendOrders(array_to_objecttree($params));
$content = $server->__getLastResponse();
echo $content;
// $filename = 'test';
// $handle = fopen($filename, 'w+');
// fwrite($handle, 'выполнил');
// fclose($handle);

echo 'SOPA sent';

?>