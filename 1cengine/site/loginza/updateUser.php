<?php session_start(); //header( 'Content-Type: application/xml' ); ?>
<?php

$server = new SoapClient('http://WebService:teradel@195.239.221.58:30080/DemoTrimet/ws/PrivetOffice.1cws?wsdl', array('trace' => 1, 'location'=>'http://195.239.221.58:30080/DemoTrimet/ws/PrivetOffice.1cws'));
//$server->__doRequest('http://195.239.221.58:30080/DemoTrimet/ws/price1c.1cws');

$server->decode_utf8 = false;
$server->soap_defencoding = 'UTF-8';
$params['uid'] = $_SESSION['1cuid'];
$params['UpdateField'] = $_POST['UpdateField']
$params['UpdateValue'] = $_POST['UpdateValue']
//$params['uid'] = 'e6b00d49-21e7-4f5b-a743-5ffc6b5b3b6a';
$result=$server->UpdateUser($params);
$content = $server->__getLastResponse();
echo $content;
// $filename = 'user.xml';
// $handle = fopen($filename, 'w+');
// fwrite($handle, $content);
// fclose($handle);

//print_r($result->GetUserResponse);


?>

