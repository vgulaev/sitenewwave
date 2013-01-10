<html>
<head>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
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

// $filename = 'price.xml';
// $handle = fopen($filename, 'r');
// $size = filesize ( 'price.xml' );
//     // считываем весь файл в переменную $content
// $content = fread ( $handle, $size );
//     //  закрываем процесс
// fclose ( $handle ); 

$xml=xml2ary(file_get_contents('price.xml'));


// Actual code

$groupArrays = $xml['soap:Envelope']['_c']['soap:Body']['_c']['m:GetPriceResponse']['_c']['m:return']['_c']['m:Группа'];

// echo '<ul id="ПрайсЛист">';
// function createPrice($groupArrays, $i){
//     if(!isset($groupArrays[0])){
//         $gg = $groupArrays;
//         $groupArrays = array();
//         $groupArrays[0] = $gg;
//     } else {
//         $groupArrays = $groupArrays;
//     }

//     foreach($groupArrays as $group){
//         $groupName = $group['_c']['m:НаименованиеГруппы']['_v'];
//         $groupArrays2 = $group['_c']['m:Группа'];
//         if(isset($group[0]['_c']['m:Предмет']) || $group['_c']['m:Предмет']){
//             echo '<ul id="'.$groupName.'" class="itemGroup">
//             <li class="UlName">
//                 <span>'.$groupName.'</span>
//             </li>
//             <ul>';
//             createPriceItem($group['_c']['m:Предмет']);
//         } else {
//             echo '<ul id="'.$groupName.'" class="level'.$i.' group">
//             <li class="UlName">
//                 <span>'.$groupName.'</span>
//             </li>
//             <ul>';
//             if(isset($groupArrays2)){
//                 createPrice($groupArrays2, $i+1);    
//             }
        
//         }
            

//         echo '</ul></ul>';
    
//     }
// }

// function createPriceItem($group){
//     if(!isset($group[0])){
//         $gg = $group;
//         $group = array();
//         $group[0] = $gg;
//     } else {
//         $group = $group;
//     }
//     foreach($group as $item){
//         $itemName = $item['_c']['m:Характеристика']['_v'];
//         echo '<li class="item">
//             <span class="itemName" style="padding-left:45px;">'.$itemName.'</span></li>';
//     }
// }


// createPrice($groupArrays, 0);

// echo '</ul>';

$costArray = array();
foreach($xml['soap:Envelope']['_c']['soap:Body']['_c']['m:GetPriceResponse']['_c']['m:return']['_c']['m:Цены']['_c']['m:СписокЦен'] as $PriceType){
    $costArray[] = $PriceType['_c']['m:КоэфициентРасчёта']['_v'];
}


print_r($groupArrays[1]['_c']['m:Группа'][0]['_c']['m:Группа'][0]['_c']['m:Предмет']); 

?>
</body>
</html>