<?php
$srv = new SoapClient('http://195.239.221.58:30082/trimet_trade/ws/privetoffice.1cws?wsdl', array('trace' => 1, 'location'=>'http://195.239.221.58:30082/trimet_trade/ws/privetoffice.1cws'));
// $srv = new SoapClient('http://192.168.194.27/trimet_trade_fedorov/ws/privetoffice.1cws?wsdl', array('trace' => 1, 'location'=>'http://192.168.194.27/trimet_trade_fedorov/ws/privetoffice.1cws'));


//$server->__doRequest('http://195.239.221.58:30082/trimet_trade/ws/price1c.1cws');

$srv->decode_utf8 = false;
$srv->soap_defencoding = 'UTF-8';

// $params['UID'] = "3378f3bc-d081-11e1-8f97-00155dc20a18";
// $params['Type'] = "PDF";

if(isset($_GET['linkUID'])){
    $params['UID'] = $_GET['linkUID'];
} else {
    $params['UID'] = $_POST['linkUID'];
}

if($params['UID']!=''){
    $result=$srv->GetRezkaBlankFileLink($params);
    $content = $srv->__getLastResponse();

    //echo $content;

    $res = array();
    preg_match("/>[\w-]+</", $content, $res);
    $response = $res[0];
    $response = str_replace('>', '', $response);
    $response = str_replace('<', '', $response);

    if($response=='Well'){
        echo 'http://195.239.221.58:30080/download/'.$params['UID'].'.pdf';
    } else {
        echo 'Нет возможности создать ';
    }
}

?>