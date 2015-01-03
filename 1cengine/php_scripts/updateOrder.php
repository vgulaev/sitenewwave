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

$orderString = $_POST['orderString'];
// $orderString = "c2df1f98-d8c3-11de-a90e-0011d859b2e6:14:1.034;ca3e31e0-4e1b-11db-8e4f-000795aaadaf:46:2.081;be5c81c7-2754-11db-bb32-000795aaadaf:128:3.008;";

$OrderFromSite["Заказчик"] = '';
$OrderFromSite["Дата"] = '';
$OrderFromSite["НомерЗаказа"] = "";

$orderStringArray = split(';', $orderString);
$GoodsList["СтрокиТаблицы"] = array();

foreach($orderStringArray as $orderItem){

	if(!$orderItem==''){
		$orderItemArray = split(':', $orderItem);
		$GoodsRow["ХарактеристикаСсылка"] = $orderItemArray[0];
		$GoodsRow["НоменклатураСсылка"] = $orderItemArray[1];
		$GoodsRow["КоличествоШтук"] = $orderItemArray[2];
		$GoodsRow["КоличествоВес"] = $orderItemArray[3];
		$GoodsRow["Цена"] = $orderItemArray[4];
		
		array_push($GoodsList["СтрокиТаблицы"], $GoodsRow); 
	}	
	

}


$OrderFromSite["Товар"] = $GoodsList;

$params["XDTOStructure"] = $OrderFromSite;
$params["UID"] = $_POST["uid"];

//print_r($params["XDTOStructure"]);

$server = new SoapClient('http://WebService:teradel@195.239.221.58:30080/trimet_trade/ws/OrderKlient.1cws?wsdl', array('trace' => 1, 'location'=>'http://195.239.221.58:30080/trimet_trade/ws/OrderKlient.1cws', 'features' => SOAP_USE_XSI_ARRAY_TYPE));
//$server->__doRequest('http://195.239.221.58:30080/trimet_trade/ws/PrivetOffice.1cws');

$server->decode_utf8 = false;
$server->soap_defencoding = 'UTF-8';

//$params["XDTOStructure"] = $xmlString;

$result=$server->UpdateOrders(array_to_objecttree($params));
$content = $server->__getLastResponse();

echo $response;

$title = 'On-line shop trimet.ru';

$mess =  'Добрый день, '. "\r\n";
$mess .= 'Вашего заказ, номер '.$response[0]." был обновлён.\r\n";
$mess .= 'Вы можете просмотреть ваш заказ по ссылке: http://trimet.ru/1cengine/site/fullprice.php?uid='.$response[1]."\r\n";
$mess .= 'Контактный телефон: +7 (3452) 520-670'."\r\n";
$mess .= 'С уважением, компания Тримет';

$to = $_POST['email'];

$from='admin@trimet.ru';
$headers  = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
$headers .= 'From:'.$from;

mail($to, $title, $mess, $headers); 

?>