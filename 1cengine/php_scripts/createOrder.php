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

$OrderFromSite["Заказчик"] = $user.', ip: '.$_SERVER["REMOTE_ADDR"].', mail: '.$_POST['email'].', phone: '.$_POST["main_phone"].', other phone: '.$_POST["other_phone"].', name: '.$_POST["name_surname"].' '.$_POST["last_name"].' !! РЕЗКА : '.$_POST["rezka"];
$OrderFromSite["Дата"] = $dt;
$OrderFromSite["НомерЗаказа"] = "";
$OrderFromSite["Редактируемый"] = "ДА";
$OrderFromSite["Доставка"] = array();
$OrderFromSite["Доставка"]["Адрес"] = $_POST['destination'];
$OrderFromSite["Доставка"]["Стоимость"] = $_POST['delivery_cost'];

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

    $sumOverall = $sumOverall + $orderItemArray[4];
        array_push($GoodsList["СтрокиТаблицы"], $GoodsRow);
    }


}


$OrderFromSite["Товар"] = $GoodsList;
$OrderFromSite["ИтоговаяСумма"] = "ДА";

$params["XDTOStructure"] = $OrderFromSite;

//print_r($params["XDTOStructure"]);

$develop_server = "http://WebService:teradel@192.168.194.14/fedorov_trimet_ut/ws/OrderKlient.1cws?wsdl";
$peoduct_server = "http://WebService:teradel@195.239.221.58:30080/DemoTrimet/ws/OrderKlient.1cws?wsdl";
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

// $title = 'On-line shop trimet.ru';
// //$title = iconv("UTF-8", "CP1251", $title);
// $mess =  'Добрый день, '. "\r\n";
// $mess .= 'Номер вашего заказа: '.$response[0]."\r\n";
// $mess .= 'Вы можете просмотреть ваш заказ по ссылке: http://trimet.ru/1cengine/site/fullprice.php?uid='.$response[1]."\r\n";
// $mess .= 'Контактный телефон: +7 (3452) 520-670'."\r\n";
// $mess .= 'С уважением, компания Тримет';
// // $to - кому отправляем
// $to = $_POST['email'];
// // $from - от кого
// $from='admin@trimet.ru';
// $headers  = 'MIME-Version: 1.0' . "\r\n";
// $headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
// $headers .= 'From:'.$from;
// // функция, которая отправляет наше письмо.
// mail($to, $title, $mess, $headers); 

$_POST['linkUID'] = $response[1];

$r1 = $response;

require_once('getfilelink.php');

// $filename = 'test.txt';
// $handle = fopen($filename, 'a+');
// fwrite($handle, $answerArray[3]." PLEASE WORK!\n");
// fclose($handle);

/// Send Mail to Client

$filename = $answerArray[3]; //Имя файла для прикрепления
$to = $_POST['email']; //Кому
$from = "admin@trimet.ru"; //От кого
$subject = '=?utf-8?B?'.base64_encode('On-line shop trimet.ru').'?=';
$mess =  'Добрый день, '. "<br />";
$mess .= 'Вы заказали металл на сайте компании Тримет. '."<br />";
$mess .= 'Ваш заказ успешно зарегистрирован в нашей системе и позднее будет обработан менеджером, который позвонит вам по номеру, который вы указали, или напишет вам письмо.'."<br />";
$mess .= 'Номер вашего заказа: '.$r1[0]."<br />";
//$mess .= 'Вы можете просмотреть ваш заказ по ссылке: http://trimet.ru/1cengine/site/index.php?uid='.$r1[1]."\r\n";
$mess .= 'Контактный телефон: +7 (3452) 520-670'."<br />";
$mess .= 'С уважением, компания Тримет';
$boundary = "---"; //Разделитель
/* Заголовки */
$headers = "From: $from\nReply-To: $from\n";
$headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"";
$body = "--$boundary\n";
/* Присоединяем текстовое сообщение */
$body .= "Content-type: text/html; charset=utf-8\n";
$body .= "Content-Transfer-Encoding: quoted-printablenn";
$body .= "Content-Disposition: attachment; filename==?utf-8?B?".base64_encode("Заказ №".$r1[0].".pdf")."?=\n\n";
$body .= $mess."\n";
$body .= "--$boundary\n";
$file = fopen($filename, "r"); //Открываем файл
$contents = '';
while (!feof($file)) {
  $contents .= fread($file, 8192);
}
// $text = fread($file, filesize($filename)); //Считываем весь файл
fclose($file); //Закрываем файл
/* Добавляем тип содержимого, кодируем текст файла и добавляем в тело письма */
$body .= "Content-Type: application/octet-stream; name==?utf-8?B?".base64_encode("Заказ №".$r1[0].".pdf")."?=\n";
$body .= "Content-Transfer-Encoding: base64\n";
$body .= "Content-Disposition: attachment; filename==?utf-8?B?".base64_encode("Заказ №".$r1[0].".pdf")."?=\n\n";
$body .= chunk_split(base64_encode($contents))."\n";
$body .= "--".$boundary ."--\n";

mail($to, $subject, $body, $headers);

/// Send Mail to Us

$to = "otwo@trimet.ru, webmaster@trimet.ru";
$from = "admin@trimet.ru";
$subject = '=?utf-8?B?'.base64_encode('Attention On-line shop trimet.ru').'?=';
$mess = "Доброго времени суток, "."<br />";
$mess .= "На сайте Тримет был оформлен новый заказ."."<br />";
$mess .= "Его номер: <strong>".$r1[0]."</strong><br />";
$mess .= "<hr />";
$mess .= "<ins>Автоматическая рассылка сайта trimet.ru</ins>";
$headers = "From: $from\nReply-To: $from\n";
$headers .= "Content-Type: text\html; charset=utf-8\n";
$body = "--$boundary\n";
/* Присоединяем текстовое сообщение */
$body .= "Content-type: text/html; charset=utf-8\n";
$body .= "Content-Transfer-Encoding: quoted-printablenn";
$body .= $mess."\n";
$body .= "--$boundary\n";

mail($to, $subject, $body, $headers);

?>