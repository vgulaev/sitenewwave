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

function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $randomString;
}


function register_user($mail, $passwd, $name) {
    $server = new SoapClient('http://195.239.221.58:30082/trimet_trade/ws/Register.1cws?wsdl', array('trace' => 1, 'location'=>'http://195.239.221.58:30082/trimet_trade/ws/Register.1cws'));
    // $server = new SoapClient('http://192.168.194.27/trimet_trade_fedorov/ws/Register.1cws?wsdl', array('trace' => 1, 'location'=>'http://192.168.194.27/trimet_trade_fedorov/ws/Register.1cws'));
//$server->__doRequest('http://195.239.221.58:30082/trimet_trade/ws/PrivetOffice.1cws');

    $server->decode_utf8 = false;
    $server->soap_defencoding = 'UTF-8';

    $params['Login'] = $mail;
    $params['Password'] = hash('sha256', $passwd);
    $params['Email'] = $mail;
    $params['FullName'] = $name;

    $result=$server->AddUser($params);
    $content = $server->__getLastResponse();

    if (strpos($content,'создан') !== false) {
        return true;
    } else {
        return false;
    }
}

$pwd = generateRandomString();
$nm = $_POST["name_surname"].' '.$_POST["last_name"];

// $reg_result = register_user($_POST['email'], $pwd, $nm);
$reg_result = "nONE";

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

$OrderFromSite["Заказчик"] = $user.', ip: '.$_SERVER["REMOTE_ADDR"].', mail: '.$_POST['email'].', phone: '.$_POST["main_phone"].', other phone: '.$_POST["other_phone"].', name: '.$_POST["name_surname"].' '.$_POST["last_name"].' !! РЕЗКА : '.$_POST["rezka"];
$OrderFromSite["Дата"] = $dt;
$OrderFromSite["НомерЗаказа"] = "";
$OrderFromSite["Редактируемый"] = "ДА";
$OrderFromSite["Доставка"] = array();
$OrderFromSite["Доставка"]["Адрес"] = $_POST['destination'];
$OrderFromSite["Доставка"]["Стоимость"] = $_POST['delivery_cost'];
$OrderFromSite["Доставка"]["Дополнительно"] = $_POST['delivery_info'];
$OrderFromSite["Почта"] = $_POST['email'];
$OrderFromSite["Контрагент"] = $_POST['counterparty'];
$OrderFromSite["Резка"] = $_POST['rezka'];

$orderStringArray = split(';', $orderString);
$GoodsList["СтрокиТаблицы"] = array();
$sumOverall = 0;

foreach($orderStringArray as $orderItem){

    if(!$orderItem==''){
        $orderItemArray = split(':', $orderItem);
        $GoodsRow["ХарактеристикаСсылка"] = $orderItemArray[0];
        $GoodsRow["НоменклатураСсылка"] = $orderItemArray[1];
        $GoodsRow["КоличествоШтук"] = $orderItemArray[2];
        $GoodsRow["КоличествоВес"] = $orderItemArray[3];
        $GoodsRow["Цена"] = $orderItemArray[4];
        $GoodsRow["КомментарийРезки"] = "  ";
        // $GoodsRow["КомментарийКТовару"] = "  ";

    $sumOverall = $sumOverall + $orderItemArray[4];
        array_push($GoodsList["СтрокиТаблицы"], $GoodsRow);
    }


}


$OrderFromSite["Товар"] = $GoodsList;
$OrderFromSite["ИтоговаяСумма"] = "ДА";

$params["XDTOStructure"] = $OrderFromSite;

// $handle = fopen("/home/saur/web/sitenewwave/1cengine/php_scripts/text.txt", "w+");
// fwrite($handle, serialize($params));
// fclose($handle);

//print_r($params["XDTOStructure"]);    `

$develop_server = "http://WebService:teradel@192.168.194.14/trimet_trade_fedorov/ws/OrderKlient.1cws?wsdl";
$product_server = "http://WebService:teradel@195.239.221.58:30082/trimet_trade/ws/OrderKlient.1cws?wsdl";
// $server = new SoapClient('http://195.239.221.58:30082/trimet_trade/ws/OrderKlient.1cws?wsdl', array('trace' => 1, 'location'=>'http://195.239.221.58:30082/trimet_trade/ws/OrderKlient.1cws', 'features' => SOAP_USE_XSI_ARRAY_TYPE));
$server = new SoapClient('http://192.168.194.27/trimet_trade_fedorov/ws/OrderKlient.1cws?wsdl', array('trace' => 1, 'location'=>'http://192.168.194.27/trimet_trade_fedorov/ws/OrderKlient.1cws', 'features' => SOAP_USE_XSI_ARRAY_TYPE));
//$server->__doRequest('http://195.239.221.58:30082/trimet_trade/ws/PrivetOffice.1cws');

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

echo $response[0].','.$response[1].','.$response[2].','.$reg_result.','.$pwd;

////////////////////////////////////////////////////////////////////////////////
///////////////////         END OF THE LINE         ////////////////////////////
////////////////////////////////////////////////////////////////////////////////
?>