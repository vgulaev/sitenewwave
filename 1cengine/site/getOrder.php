<?php

function my_dbConnect(){
    mysql_connect('localhost','trimetru_goods','&rUI24*(^o') OR DIE("Не могу создать соединение ");

    mysql_select_db('trimetru_goods') or die(mysql_error());
    mysql_query('SET NAMES utf8');
}

function xml2ary(&$string) {
    $parser = xml_parser_create();
    xml_parser_set_option($parser, XML_OPTION_CASE_FOLDING, 0);
    xml_parse_into_struct($parser, $string, $vals, $index);
    xml_parser_free($parser);

    $mnary=array();
    $ary=&$mnary;
    foreach ($vals as $r) {
        $t=$r['tag'];
        if ($r['type']=='open') {
            if (isset($ary[$t])) {
                if (isset($ary[$t][0])) $ary[$t][]=array(); else $ary[$t]=array($ary[$t], array());
                $cv=&$ary[$t][count($ary[$t])-1];
            } else $cv=&$ary[$t];
            if (isset($r['attributes'])) {foreach ($r['attributes'] as $k=>$v) $cv['_a'][$k]=$v;}
            $cv['_c']=array();
            $cv['_c']['_p']=&$ary;
            $ary=&$cv['_c'];

        } elseif ($r['type']=='complete') {
            if (isset($ary[$t])) { // same as open
                if (isset($ary[$t][0])) $ary[$t][]=array(); else $ary[$t]=array($ary[$t], array());
                $cv=&$ary[$t][count($ary[$t])-1];
            } else $cv=&$ary[$t];
            if (isset($r['attributes'])) {foreach ($r['attributes'] as $k=>$v) $cv['_a'][$k]=$v;}
            $cv['_v']=(isset($r['value']) ? $r['value'] : '');

        } elseif ($r['type']=='close') {
            $ary=&$ary['_p'];
        }
    }    
    
    _del_p($mnary);
    return $mnary;
}

// _Internal: Remove recursion in result array
function _del_p(&$ary) {
    foreach ($ary as $k=>$v) {
        if ($k==='_p') unset($ary[$k]);
        elseif (is_array($ary[$k])) _del_p($ary[$k]);
    }
}

$server = new SoapClient('http://WebService:teradel@195.239.221.58:30080/DemoTrimet/ws/OrderKlient.1cws?wsdl', array('trace' => 1, 'location'=>'http://195.239.221.58:30080/DemoTrimet/ws/OrderKlient.1cws'));
//$server->__doRequest('http://195.239.221.58:30080/DemoTrimet/ws/price1c.1cws');

$server->decode_utf8 = false;
$server->soap_defencoding = 'UTF-8';

// $params['UID'] = 'bf6f2a6e-c2cf-11df-9787-00155dc20a16';
$params['UIDOrder'] = '';
$params['UID'] = $_POST['uid'];



$result=$server->GetOrders($params);
$content = $server->__getLastResponse();


$xml=xml2ary($content);

$goodsArrays = $xml['soap:Envelope']['_c']['soap:Body']['_c']['m:GetOrdersResponse']['_c']['m:return']['_c']['m:Товар']['_c']['m:СтрокиТаблицы'];

$orderNum = $xml['soap:Envelope']['_c']['soap:Body']['_c']['m:GetOrdersResponse']['_c']['m:return']['_c']['m:НомерЗаказа']['_v'];
$orderEdit = $xml['soap:Envelope']['_c']['soap:Body']['_c']['m:GetOrdersResponse']['_c']['m:return']['_c']['m:Редактируемый']['_v'];
//print_r($content);

$goodsRow = $orderNum.'||'.$orderEdit.'||';

my_dbConnect();

foreach($goodsArrays as $goods){
	$char = $goods['_c']['m:ХарактеристикаСсылка']['_v'];
	$count = $goods['_c']['m:КоличествоШтук']['_v'];
	$weight = $goods['_c']['m:КоличествоВес']['_v'];
	$nomen = $goods['_c']['m:НоменклатураСсылка']['_v'];
    $price = $goods['_c']['m:Цена']['_v'];
    //$length = $goods['_c']['m:']['_v'];
    //$edIzm = $goods['_c']['m:']['_v'];

    $r = mysql_query("SELECT `offers`.`display_name`, `offers`.`char_name`, `offers`.`edIzm`
                FROM `offers` WHERE `offers`.`father_hash`='".$nomen."' AND `offers`.`hash`='".$char."' OR `offers`.`father_hash`='".$nomen."' AND `offers`.`hash`='0' LIMIT 1");
    if (mysql_num_rows($r)>0){
        while($row = mysql_fetch_array($r, MYSQL_NUM)){
            $goodsRow .= $nomen.':'.$char.':'.$count.':'.$weight.':'.$price.':'.$row[0].':'.$row[1].':'.$row[2].';';
        }
    }

	
}

echo $goodsRow;

// echo $content;

// $filename = 'orders.xml';
// $handle = fopen($filename, 'w+');
// fwrite($handle, $content);
// fclose($handle);



?>