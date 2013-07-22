<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
	<head>
		<style>
			table{
				border-left:1px solid gray;
				border-top:1px solid gray;
			}
			td,th{
				border-right:1px solid gray;
				border-bottom:1px solid gray;
				text-align:center;
				padding:5px;
			}
		</style>
	</head>
	<body>
<?php 
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


$server = new SoapClient('http://WebService:teradel@195.239.221.58:30080/DemoTrimet/ws/PrivetOffice.1cws?wsdl', array('trace' => 1, 'location'=>'http://195.239.221.58:30080/DemoTrimet/ws/PrivetOffice.1cws'));
//$server->__doRequest('http://195.239.221.58:30080/DemoTrimet/ws/price1c.1cws');

$server->decode_utf8 = false;
$server->soap_defencoding = 'UTF-8';

//$params['UID'] = '1c41a64c-cf1f-11e1-8f97-00155dc20a18';
//$params['UIDOrder'] = '';
//$params['DateStart'] = '';
//$params['DateEnd'] = '';
$params['UID'] = '657ed8dd-be8f-42d5-95f2-708f21dd5a1c';



$result=$server->OrderLists($params);
$content = $server->__getLastResponse();

// $filename = 'orderLists.xml';
// $handle = fopen($filename, 'w+');
// fwrite($handle, $content);
// fclose($handle);


$xml=xml2ary($content);

$ordersArrays = $xml['soap:Envelope']['_c']['soap:Body']['_c']['m:OrderListsResponse']['_c']['m:return']['_c']['m:Журнал']['_c']['m:СтрокиТаблицы'];

$htmlString = "
	<table>
		<thead>
			<tr>
				<th></th>
				<th>Номер</th>
				<th>Сумма Документов</th>
				<th>Дата</th>
				<th>Ответственный</th>
				<th>Контрагент</th>
			</tr>
		</thead>
		<tbody>
";

foreach($ordersArrays as $order){
	$orderNum = $order['_c']['m:Номер']['_v'];
	$orderDate = $order['_c']['m:Дата']['_v'];
	$orderSum = $order['_c']['m:СуммаДокумента']['_v'];
	$orderResponsible = $order['_c']['m:Ответственный']['_v'];
	$orderKontragent = $order['_c']['m:Контрагент']['_v'];
	$orderUid = $order['_c']['m:Заказ']['_v'];

	$htmlString .= "
		<tr>
			<td><a href='http://37.1.196.142/1cengine/site/fullprice.php?uid=".$orderUid."'>Просмотреть заказ</a></td>
			<td>".$orderNum."</td>
			<td>".$orderSum."</td>
			<td>".$orderDate."</td>
			<td>".$orderResponsible."</td>
			<td>".$orderKontragent."</td>
		</tr>
	";
}

$htmlString .= "</tbody></table>";

echo $htmlString;

?>
</body>
</html>