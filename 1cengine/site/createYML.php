<html>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
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

$xml=xml2ary(file_get_contents('price.xml'));


// Actual code

$groupArrays = $xml['soap:Envelope']['_c']['soap:Body']['_c']['m:GetPriceResponse']['_c']['m:return']['_c']['m:Группа'];
$costArray = array();


function createPrice($groupArrays, $i, $costArray, $flag, $nid){
    if(!isset($groupArrays[0])){
        $gg = $groupArrays;
        $groupArrays = array();
        $groupArrays[0] = $gg;
    } else {
        $groupArrays = $groupArrays;
    }
    $ymlCat = '';
    $ymlOffer = '';
    $ymlCO = array($ymlCat, $ymlOffer);
    foreach($groupArrays as $group){
        $groupName = $group['_c']['m:НаименованиеГруппы']['_v'];
        $groupArrays2 = $group['_c']['m:Группа'];
        $groupN = $group['_c']['m:ФлагНоменклатуры']['_v'];
        $itemHashN = $group['_c']['m:НоменклатураСсылка']['_v'];
        if(strpos($groupName, 'б/у')){
            continue;
        }
        

        $nn = array_search($group, $groupArrays) + 1;
        //if($nid!='--'){
        //    $num = '99'.$nn.$nid;
        //} else {
        //    $num = $nn;
        //}
        
        
        if($groupN==1){
            if(isset($group['_c']['m:Предмет'])){
                $ymlCO[1] .= createPriceItem($group['_c']['m:Предмет'], $costArray, $groupName, $itemHashN, $nid);
            } else {
                $ymlCO[1] .= createPriceItemHollow($group, $costArray, $groupName, $nid, $nn);
            }
            
            
        } else {
            if($nid!='--'){
                $num = '99'.$nn.$nid;
                $ymlCO[0] .= '<category id="'.$num.'" parentId="'.$nid.'">'.$groupName.'</category>
                ';
            } else {
                $num = $nn;
                $ymlCO[0] .= '<category id="'.$num.'">'.$groupName.'</category>
                ';
            }

            if(isset($groupArrays2)){

                $co = createPrice($groupArrays2, $i+1, $costArray, 0, $num);                 
                $ymlCO[0] .= $co[0];
                $ymlCO[1] .= $co[1];
            }
        
        }
    }
    return $ymlCO;

}

function createPriceItemHollow($group, $costArray, $groupName, $nid, $nn){
    $itemName = 'кастом';

    //$itemName = $item['_c']['m:Характеристика']['_v'];
    $itemPrice = $item['_c']['m:Цена'][0]['_c']['m:Цена']['_v'];
    $itemWeight = $group['_c']['m:Вес']['_v'];
    $itemLength = $group['_c']['m:Кратность']['_v'];
    $itemKf = $group['_c']['m:Коэффициент']['_v'];
    $itemHash = $group['_c']['m:НоменклатураСсылка']['_v'];


    $ik = 0;
        // foreach($costArray as $costs){
        //     $pr = getKfPrice($costs, $itemPrice, $itemWeight, $itemLength, $itemKf, $ik);
        //     $ik++;
        // }
    $groupNameL = str_replace("\"", "", $groupName);
    $num = $nn.$nid;
    $ymlOffer .= '
    <offer id="'.$num.'" available="true">
        <url>http://www.trimet.ru/1cengine/site/index.php?ref='.rawurlencode($groupNameL).'</url>
        <price>'.$itemPrice.'</price>
        <currencyId>RUR</currencyId>
        <categoryId>'.$nid.'</categoryId>
        <store>true</store>
        <pickup>true</pickup>
        <delivery>false</delivery>
        <name>'.$groupName.'</name>           
    </offer>';
    return $ymlOffer;
}

function createPriceItem($group, $costArray, $groupName, $itemHashN, $nid){
    if(!isset($group[0])){
        $gg = $group;
        $group = array();
        $group[0] = $gg;
    } else {
        $group = $group;
    }
   
    
    $ymlOffer = '';
    $cAr = $costArray[0].','.$costArray[1].','.$costArray[2].','.$costArray[3];
    foreach($group as $item){
        $itemName = $item['_c']['m:Характеристика']['_v'];
        $itemPrice = $item['_c']['m:Цена'][0]['_c']['m:Цена']['_v'];
        $itemWeight = $item['_c']['m:Вес']['_v'];
        $itemLength = $item['_c']['m:Кратность']['_v'];
        $itemKf = $item['_c']['m:Коэффициент']['_v'];
        $itemHash = $item['_c']['m:ХарактеристикаСсылка']['_v'];
        $itemStock = $item['_c']['m:ЕстьВНаличии']['_v'];

        if($itemStock!='0'){
            $inStock = 'true';
        } else {
            $inStock = 'false';
        }

        $ik = 0;
        // foreach($costArray as $costs){
        //     $pr = getKfPrice($costs, $itemPrice, $itemWeight, $itemLength, $itemKf, $ik);
        //     $ik++;
        // }
        //$pr = getKfPrice($costArray[0], $itemPrice, $itemWeight, $itemLength, $itemKf);

        $nn = (int) array_search($item, $group) + 1;
        $num = '99'.$nn.$nid;
        $groupNameL = str_replace("\"", "", $groupName);
        $ymlOffer .= '
        <offer id="'.$num.'" available="true">
            <url>http://www.trimet.ru/1cengine/site/index.php?ref='.rawurlencode($groupNameL.' '.$itemName).'</url>
            <price>'.$itemPrice.'</price>
            <currencyId>RUR</currencyId>
            <categoryId>'.$nid.'</categoryId>
            <store>'.$inStock.'</store>
            <pickup>true</pickup>
            <delivery>false</delivery>
            <name>'.$groupName.' '.$itemName.'</name>
            <param name="мера" unit="м">'.$itemName.'</param>
        </offer>';

    }
    return $ymlOffer;
}

function getKfPrice($kf, $basePrice, $weight, $length, $iKf){
    setlocale(LC_MONETARY, 'ru_RU');
    
    $TN = bigRound(($basePrice/(1-($kf/100))));
    $PC = (round(($TN/1000)*round($weight*$length)*$iKf*100)/100);

    if($length==0 || $iKf==0){
        $PC = '-';
        $PM = '-';
    } else {
        $PM = (round(($PC/($length))*$iKf*100)/100);
    }

    return money_format('%i', $TN);

    // if($ik=='3'){
    //     return money_format('%i', $TN);
    // }
}

function bigRound($i){
    $i = $i/10;
    $i = ceil($i);
    $i = $i*10;
    return $i;
}

$yml = '<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE yml_catalog SYSTEM "shops.dtd">';

$today = date('Y-m-d H:i');

$yml .= '<yml_catalog date="'.$today.'"><shop>';
$yml .= '<name>Тримет</name>
    <company>Тримет</company>
    <url>http://www.trimet.ru/</url>
    <currencies>
        <currency id="RUR" rate="1"/>
    </currencies>
    <categories>';

$ymlCO = createPrice($groupArrays, 0, $costArray, 0, '--');

$yml .= $ymlCO[0].'</categories>';
$yml .= '<offers>'.$ymlCO[1];
$yml .= '</offers>
</shop></yml_catalog>';

$filename = 'yml.xml';
$handle = fopen($filename, 'w+');
fwrite($handle, $yml);
fclose($handle);


echo 'YML файл создан успешно!';

?>
</html>