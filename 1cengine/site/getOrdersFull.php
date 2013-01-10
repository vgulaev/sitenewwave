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


$server = new SoapClient('http://WebService:teradel@195.239.221.58:30080/DemoTrimet/ws/OrderKlient.1cws?wsdl', array('trace' => 1, 'location'=>'http://195.239.221.58:30080/DemoTrimet/ws/OrderKlient.1cws'));
//$server->__doRequest('http://195.239.221.58:30080/DemoTrimet/ws/price1c.1cws');

$server->decode_utf8 = false;
$server->soap_defencoding = 'UTF-8';

//$params['UID'] = '1c41a64c-cf1f-11e1-8f97-00155dc20a18';
$params['UIDOrder'] = '';
$params['UID'] = $_POST['uid'];



$result=$server->*GetOrdersFull*($params);
$content = $server->__getLastResponse();

$xml=xml2ary($content);

$goodsArrays = $xml['soap:Envelope']['_c']['soap:Body']['_c']['m:*GetOrdersFull*Response']['_c']['m:return']['_c']['m:Товары']['_c']['m:ТаблицаТоваров'];


$htmlString = "
	<table>
		<thead>
			<tr>
				<th>Номенклатура</th>
				<th>Характеристика</th>
				<th>Количество метров</th>
				<th>Количество штук</th>
				<th>Количество вес</th>
				<th>Единица измерения</th>
				<th>Цена</th>
				<th>Ставка НДС</th>
				<th>Сумма НДС</th>
				<th>Сумма</th>
			</tr>
		</thead>
		<tbody>
";
foreach($goodsArrays as $goods){
	$nomen = $goods['_c']['m:Номенклатура']['_v'];
	$char = $goods['_c']['m:ХарактеристикаНоменклатуры']['_v'];
	$meterCount = $goods['_c']['m:КоличествоМетров']['_v'];
	$itemCount = $goods['_c']['m:КоличествоШтук']['_v'];
	$weight = $goods['_c']['m:КоличествоВес']['_v'];
	$edIzm = $goods['_c']['m:ЕдиницаИзмерения']['_v'];
	$price = $goods['_c']['m:Цена']['_v'];
	$pNDS = $goods['_c']['m:СтавкаНДС']['_v'];
	$sumNDS = $goods['_c']['m:СуммаНДС']['_v'];
	$sum = $goods['_c']['m:Сумма']['_v'];

	$htmlString .= "
		<tr>
			<td>".$nomen."</td>
			<td>".$char."</td>
			<td>".$meterCount."</td>
			<td>".$itemCount."</td>
			<td>".$weight."</td>
			<td>".$edIzm."</td>
			<td>".$price."</td>
			<td>".$pNDS."</td>
			<td>".$sumNDS."</td>
			<td>".$sum."</td>
		</tr>
	";
}

$htmlString .= "</tbody></table>";

echo $htmlString;
	
?>