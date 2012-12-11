<?php
print "Content-type: text/html\n\n"; 

setlocale(LC_ALL, "ru_RU");

function my_dbConnect(){
    $dbCon = mysql_connect('localhost','trimetru_goods','&rUI24*(^o') OR DIE("Не могу создать соединение ");

    mysql_select_db('trimetru_goods') or die(mysql_error());
    mysql_query('SET NAMES utf8');

    return $dbCon;
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

function qr($iName, $pHash, $cName, $weight, $length, $kf, $iHash, $edIzm, $price, $priceType, $groupSecondName, $itemHashN, $inStock){

    $dbCon = my_dbConnect();

    $query2 = "INSERT INTO `trimetru_goods`.`offers` (`id`, `name`, `hash`, `parent_hash`, `display_name`, `char_name`, `weight`, `length`, `kf`, `edIzm`, `price`, `price_type`, `father_hash`, `stock`)
VALUES ('null','".mysql_escape_string($groupSecondName)." ".mysql_escape_string($cName)." ','".$iHash."','".$pHash."','".mysql_escape_string($iName)."','".mysql_escape_string($cName)."','".$weight."','".$length."','".$kf."','".$edIzm."','".mysql_escape_string($price)."','".mysql_escape_string($priceType)."','".$itemHashN."', '".$inStock."');";
    $result2 = mysql_query($query2, $dbCon);
    print_r($iName.' '.$cName.'<br />');
    //echo 'done<br />';
    //return mysql_insert_id();
}

function insertGroup($gName, $pHash, $gHash){

    $query = "INSERT INTO `trimetru_goods`.`groups` (`name`, `hash`, `parent_hash`)
VALUES ('".$gName."','".$gHash."','".$pHash."');";

    $result = mysql_query($query);

    //echo $result.'<br />';
    //return mysql_insert_id();
}



$xml=xml2ary(file_get_contents('price.xml'));


// Actual code

$groupArrays = $xml['soap:Envelope']['_c']['soap:Body']['_c']['m:GetPriceResponse']['_c']['m:return']['_c']['m:Группа'];


function createPrice($groupArrays, $i, $flag,$pHash,$hHash){
    if(!isset($groupArrays[0])){
        $gg = $groupArrays;
        $groupArrays = array();
        $groupArrays[0] = $gg;
    } else {
        $groupArrays = $groupArrays;
    }

    foreach($groupArrays as $group){
        $groupSecondName = $group['_c']['m:Синоним']['_v'];
        $groupName = $group['_c']['m:НаименованиеГруппы']['_v'];
        if(isset($group['_c']['m:Группа'])){
            $groupArrays2 = $group['_c']['m:Группа'];
        }
        
        $groupN = $group['_c']['m:ФлагНоменклатуры']['_v'];
        $itemHashN = $group['_c']['m:НоменклатураСсылка']['_v'];

        if($pHash==null){
            $hHash = $itemHashN;
        }
        
        if($groupN==1){
            
            if(isset($group['_c']['m:Предмет'])){

                insertGroup($groupName, $pHash, $itemHashN,$hHash);
                createPriceItem($group['_c']['m:Предмет'], $groupName, $hHash, $groupSecondName, $itemHashN);

            } else {

                insertGroup($groupName, $pHash, $itemHashN,$hHash);
                createPriceItemHollow($group, $groupName,$hHash, $groupSecondName);

            }            
        } else {

            insertGroup($groupName, $pHash, $itemHashN,$hHash);
            if(isset($groupArrays2)){

                    createPrice($groupArrays2, $i+1, 0, $itemHashN,$hHash);           
            }
        
        }
  
    }
}

function createPriceItemHollow($group, $groupName,$pHash, $groupSecondName){
    $itemName = 'кастом';

    //$itemName = $item['_c']['m:Характеристика']['_v'];
    $itemPrice = $group['_c']['m:Цена'];
    $itemWeight = $group['_c']['m:Вес']['_v'];
    $itemLength = $group['_c']['m:Кратность']['_v'];
    $itemKf = $group['_c']['m:Коэффициент']['_v'];
    $itemHash = $group['_c']['m:НоменклатураСсылка']['_v'];
    $itemEd = $group['_c']['m:ЕдИзмерения']['_v'];

    $groupName = str_replace("\"", "", $groupName);

    $ik = 0;
    $hollow = 1;

    $priceDB = '';
    $priceType = '';

    foreach($itemPrice as $price){
        //$cP = getPrice($price['_c']['m:Цена']['_v'], $itemWeight, $itemLength, $itemKf, $ik, $hollow);
       //echo $cP;
        $priceType .= $price['_c']['m:НазваниеЦены']['_v'].'|';
        $cP = $price['_c']['m:Цена']['_v'].'|';
        $priceDB .= money_format('%!i', $cP).'|';
        $ik++;

    }

    $inStock = 1;

    //insertItem($iName, $pHash, $cName, $weight, $length, $kf, $iHash, $edIzm, $price)
    qr($groupName, $pHash, $itemName, $itemWeight, $itemLength, $itemKf, "0", $itemEd, $priceDB, $priceType, $groupSecondName, $itemHash, $inStock);

}

function createPriceItem($group, $groupName, $pHash, $groupSecondName, $itemHashN){
    if(!isset($group[0])){
        $gg = $group;
        $group = array();
        $group[0] = $gg;
    } else {
        $group = $group;
    }

    
    foreach($group as $item){
        $itemName = $item['_c']['m:Характеристика']['_v'];
        $itemPrice = $item['_c']['m:Цена'];
        $itemWeight = $item['_c']['m:Вес']['_v'];
        $itemLength = $item['_c']['m:Кратность']['_v'];
        $itemKf = $item['_c']['m:Коэффициент']['_v'];
        $itemHash = $item['_c']['m:ХарактеристикаСсылка']['_v'];
        $itemEd = $item['_c']['m:ЕдИзмерения']['_v'];
        $itemStock = $item['_c']['m:ЕстьВНаличии']['_v'];
        //$itemPrice = $item['_c']['m:']
        
        $ik = 0;
        $hollow = 0;

        $priceDB = '';
        $priceType = '';

        foreach($itemPrice as $price){
            //$cP = getPrice($price['_c']['m:Цена']['_v'], $itemWeight, $itemLength, $itemKf, $ik, $hollow);
            $priceType .= $price['_c']['m:НазваниеЦены']['_v'].'|';
            $cP = $price['_c']['m:Цена']['_v'].'|';
            //echo $cP;
            $priceDB .= money_format('%!i', $cP).'|';
            $ik++;
        }
        
        if($itemStock!='0'){
            $inStock = 1;
        } else {
            $inStock = 0;
        }

        qr($groupName, $pHash, $itemName, $itemWeight, $itemLength, $itemKf, $itemHash, $itemEd, $priceDB, $priceType, $groupSecondName, $itemHashN, $inStock);

    }
}

function getPrice($TNPrice, $weight, $length, $iKf, $ik, $hollow){
    setlocale(LC_MONETARY, 'ru_RU');
    
    //$TN = bigRound(($basePrice/(1-($kf/100))));
    $TN = $TNPrice;
    $PC = (round(($TN/1000)*round($weight*$length)*$iKf*100)/100);

    if($length==0 || $iKf==0){
        $PC = '-';
        $PM = '-';
    } else {
        $PM = (round(($PC/($length))*$iKf*100)/100);
    }

    if($hollow==0){

        
        $prices = "".money_format('%!i', $TN).";";
        
        if($PC!='-'){
            $prices .= "".money_format('%!i', $PC).";";
        } else {
            $prices .= "-;";
        }
        if($PM!='-'){
            $prices .= "".money_format('%!i', $PM)."|";
        } else {
            $prices .= "-|";
        }
    } else {
        
        $prices = "".money_format('%!i', $TN).";";
        
        if($PC!='-'){
            $prices .= "".money_format('%!i', $PC).";";
        } else {
            $prices .= "-;";
        }
        if($PM!='-'){
            $prices .= "".money_format('%!i', $PM)."|";
        } else {
            $prices .= "-|";
        }
    }


    return $prices;
}

function bigRound($i){
    $i = $i/10;
    $i = ceil($i);
    $i = $i*10;
    return $i;
}

$dbCon = my_dbConnect();

$query = "TRUNCATE TABLE `offers`";
mysql_query($query);

$query = "TRUNCATE TABLE `groups`";
mysql_query($query);

createPrice($groupArrays, 0, 0, null, null);


?>