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
// $orderString = "8f97e0cd-5fc1-11d9-a6d2-505054503030:8f97e0cd-5fc1-11d9-a6d2-505054503030:-:23:32150.00;8dc51296-c7dc-11e0-a1a9-00155dc20a18:8dc51296-c7dc-11e0-a1a9-00155dc20a18:-:31:55110.00;";
if($_SESSION['1cusername']!=''){
	$user = $_SESSION['1cusername'];
} else {
	$user = 'Anonymous';
}

// $filename = 'test.txt';
// $handle = fopen($filename, 'a+');
// fwrite($handle, $orderString."\n");
// fclose($handle);


$dt = date('d.m.Y');

$OrderFromSite["Заказчик"] = $user.', ip: '.$_SERVER["REMOTE_ADDR"].', carry: '.$_POST["carry"].', destination: '.$_POST["destination"].', delivery cost: '.$_POST["delivery_cost"].', mail: '.$_POST['email'];
$OrderFromSite["Дата"] = $dt;
$OrderFromSite["НомерЗаказа"] = "";
$OrderFromSite["Редактируемый"] = "ДА";

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

//print_r($params["XDTOStructure"]);

$server = new SoapClient('http://WebService:teradel@195.239.221.58:30080/DemoTrimet/ws/OrderKlient.1cws?wsdl', array('trace' => 1, 'location'=>'http://195.239.221.58:30080/DemoTrimet/ws/OrderKlient.1cws', 'features' => SOAP_USE_XSI_ARRAY_TYPE));
//$server->__doRequest('http://195.239.221.58:30080/DemoTrimet/ws/PrivetOffice.1cws');

$server->decode_utf8 = false;
$server->soap_defencoding = 'UTF-8';

//$params["XDTOStructure"] = $xmlString;

$result=$server->SendOrders(array_to_objecttree($params));
$content = $server->__getLastResponse();

$res = array();
preg_match("/>(.+)<\/m:return/", $content, $res);
$response = $res[0];
$response = str_replace('>', '', $response);
$response = str_replace('</m:return', '', $response);
$response = split(':', $response);

echo $response[0].','.$response[1];

$title = 'On-line shop trimet.ru';
//$title = iconv("UTF-8", "CP1251", $title);
$mess =  'Добрый день, '. "\r\n";
$mess .= 'Номер вашего заказа: '.$response[0]."\r\n";
$mess .= 'Вы можете просмотреть ваш заказ по ссылке: http://trimet.ru/1cengine/site/fullprice.php?uid='.$response[1]."\r\n";
$mess .= 'Контактный телефон: +7 (3452) 520-670'."\r\n";
$mess .= 'С уважением, компания Тримет';
// $to - кому отправляем
$to = $_POST['email'];
// $from - от кого
$from='admin@trimet.ru';
$headers  = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
$headers .= 'From:'.$from;
// функция, которая отправляет наше письмо.
mail($to, $title, $mess, $headers); 

?>