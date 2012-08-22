<?php

setlocale(LC_ALL, "ru_RU");

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


echo '<ul id="ПрайсЛист">';
function createPrice($groupArrays, $i, $costArray, $flag){
    if(!isset($groupArrays[0])){
        $gg = $groupArrays;
        $groupArrays = array();
        $groupArrays[0] = $gg;
    } else {
        $groupArrays = $groupArrays;
    }

    foreach($groupArrays as $group){
        $groupName = $group['_c']['m:НаименованиеГруппы']['_v'];
        $groupArrays2 = $group['_c']['m:Группа'];
        $groupN = $group['_c']['m:ФлагНоменклатуры']['_v'];
        $itemHashN = $group['_c']['m:НоменклатураСсылка']['_v'];
        
        if($groupN==1){
            echo '<ul id="'.htmlspecialchars($groupName).'" >
            <li class="UlName level'.$i.' itemGroup">
                <span><strong>'.$groupName.'</strong></span>
            </li>';
            if(isset($group['_c']['m:Предмет'])){
                echo '<ul class="groupHolder">
                <table>';
            
                createPriceItem($group['_c']['m:Предмет'], $costArray, $groupName, $itemHashN);
                echo '</table>';
            } else {
                echo '<ul class="groupHolder hollow">
                <table><tbody class="hollow">';
            
                createPriceItemHollow($group, $costArray, $groupName);
                echo '</tbody></table>';
            }
            
            
        } else {
            echo '<ul id="'.$groupName.'" class="level'.$i.' group">
            <li class="UlName level'.$i.'">
                <span><strong>'.$groupName.'</strong></span>
            </li>
            <ul class="groupHolder">';
            if(isset($groupArrays2)){
                

                    createPrice($groupArrays2, $i+1, $costArray, 0);
                
                
            }
        
        }
            

        echo '</ul></ul>';
    
    }


}

function createPriceItemHollow($group, $costArray, $groupName){
    $itemName = 'кастом';

    //$itemName = $item['_c']['m:Характеристика']['_v'];
    $itemPrice = $group['_c']['m:Цена'];
    $itemWeight = $group['_c']['m:Вес']['_v'];
    $itemLength = $group['_c']['m:Кратность']['_v'];
    $itemKf = $group['_c']['m:Коэффициент']['_v'];
    $itemHash = $group['_c']['m:НоменклатураСсылка']['_v'];
    $itemEd = $item['_c']['m:ЕдИзмерения']['_v'];

    $groupName = str_replace("\"", "", $groupName);


    $ral = explode('RAL ', $groupName);
        if(isset($ral[1])){
            $rkey = $ral[1];
            $ralColor = '<div style="width:60px;height:15px;background-color:'.getRAL($rkey).';border:1px solid black;float:right">'.' '.'</div>';
        } else {
            $ralColor= '';
        }
        if(isset($_GET["ref"])){
            if(rawurldecode($_GET["ref"]) == $groupName." ".$itemName){
                echo "<tr class='item hollow' name='".$groupName." ".$itemName."' id='list ".$groupName." ".$itemName."' itemscope itemtype=\"http://schema.org/Product\">
                        <td class='iName'>
                        <a title='Купить ".$groupName." ".$itemName."' name='".$itemHash."' href='Добавить в заказ' class='addItem' onClick=\"addItem('".htmlspecialchars($groupName)."','".$itemName."','".$itemPrice."','".$cAr."','".$itemWeight."','".$itemLength."','".$itemKf."', '','".$itemHash."','".$itemEd."','1'); return false\">
                            <img src='/bitrix/templates/trimet/css/basket.png' /></a>
                        <span itemprop=\"name\">".$groupName.'</span> '.$ralColor."</td>"; 
                echo '<td>'.$itemName.'</td>';
                $rflag =1;
            } else {
                echo "<tr class='item hollow' name='".$groupName." ".$itemName."' id='list ".$groupName." ".$itemName."'>
                        <td class='iName'>
                        <a title='Купить ".$groupName." ".$itemName."' name='".$itemHash."' href='Добавить в заказ' class='addItem' onClick=\"addItem('".htmlspecialchars($groupName)."','".$itemName."','".$itemPrice."','".$cAr."','".$itemWeight."','".$itemLength."','".$itemKf."', '','".$itemHash."','".$itemEd."','1'); return false\">
                            <img src='/bitrix/templates/trimet/css/basket.png' /></a>
                        <span>".$groupName.'</span> '.$ralColor."</td>"; 
                echo '<td>'.$itemName.'</td>';
                $rflag = 0;
            }
        } else {
            echo "<tr class='item hollow' name='".$groupName." ".$itemName."' id='list ".$groupName." ".$itemName."' itemscope itemtype=\"http://schema.org/Product\">
                    <td class='iName'>
                    <a title='Купить ".$groupName." ".$itemName."' name='".$itemHash."' href='Добавить в заказ' class='addItem' onClick=\"addItem('".htmlspecialchars($groupName)."','".$itemName."','".$itemPrice."','".$cAr."','".$itemWeight."','".$itemLength."','".$itemKf."', '','".$itemHash."','".$itemEd."','1'); return false\">
                        <img src='/bitrix/templates/trimet/css/basket.png' /></a>
                    <span itemprop=\"name\">".$groupName.'</span> '.$ralColor."</td>"; 
            echo '<td>'.$itemName.'</td>';
            $rflag =1;
        }
        
    
    $ik = 0;
    $hollow = 1;
    foreach($itemPrice as $price){
       echo getPrice($price['_c']['m:Цена']['_v'], $itemWeight, $itemLength, $itemKf, $ik, $rflag, $hollow);
       $ik++;
    }
    echo '</tr>';
}

function createPriceItem($group, $costArray, $groupName, $itemHashN){
    if(!isset($group[0])){
        $gg = $group;
        $group = array();
        $group[0] = $gg;
    } else {
        $group = $group;
    }

    $cAr = $costArray[0].','.$costArray[1].','.$costArray[2].','.$costArray[3];
    foreach($group as $item){
        $itemName = $item['_c']['m:Характеристика']['_v'];
        $itemPrice = $item['_c']['m:Цена'];
        $itemWeight = $item['_c']['m:Вес']['_v'];
        $itemLength = $item['_c']['m:Кратность']['_v'];
        $itemKf = $item['_c']['m:Коэффициент']['_v'];
        $itemHash = $item['_c']['m:ХарактеристикаСсылка']['_v'];
        $itemEd = $item['_c']['m:ЕдИзмерения']['_v'];
        //$itemPrice = $item['_c']['m:']
        
        $ral = array();
        $rkey = '';
        //$ral = array();
        //$pattern = 'RAL\s\d\d\d\d';
        //$pattern = 'RAL 6002';

        $groupName = str_replace("  ", " ", $groupName);
        $groupName = str_replace("\"", "", $groupName);

        $ral = explode('RAL ', $groupName);
        if(isset($ral[1])){
            $rkey = $ral[1];
            $ralColor = '<div style="width:60px;height:15px;background-color:'.getRAL($rkey).';border:1px solid black;float:right">'.' '.'</div>';
        } else {
            $ralColor= '';
        }
        //$ralColor = '<div style="width:60px;height:15px;background-color:'.$ralArray['RAL 6002'].'">'.$ral.'</div>';
        if(isset($_GET["ref"])){
            if(rawurldecode($_GET["ref"]) == $groupName." ".$itemName){

                echo "<tr class='item' name='".$groupName." ".$itemName."' id='list ".$groupName." ".$itemName."' itemscope itemtype=\"http://schema.org/Product\">
                    <td class='iName'>
                        <a title='Купить ".$groupName." ".$itemName."' name='".$itemHash."' href='Добавить в заказ' class='addItem' onClick=\"addItem('".$groupName."','".$itemName."','".$itemPrice."','".$cAr."','".$itemWeight."','".$itemLength."','".$itemKf."','".$itemHash."','".$itemHashN."','".$itemEd."','0'); return false\">
                            <img src='/bitrix/templates/trimet/css/basket.png' />
                        </a>
                        <span itemprop=\"name\">".$groupName.'</span> '.$ralColor."</td>"; 
                echo '<td itemprop="model">'.$itemName.'</td>';
                $rflag = 1;
            } else {
                echo "<tr class='item' name='".$groupName." ".$itemName."' id='list ".$groupName." ".$itemName."'>
                    <td class='iName'>
                        <a title='Купить ".$groupName." ".$itemName."' name='".$itemHash."' href='Добавить в заказ' class='addItem' onClick=\"addItem('".$groupName."','".$itemName."','".$itemPrice."','".$cAr."','".$itemWeight."','".$itemLength."','".$itemKf."','".$itemHash."','".$itemHashN."','".$itemEd."','0'); return false\"><img src='/bitrix/templates/trimet/css/basket.png' /></a><span>".$groupName.'</span> '.$ralColor."</td>"; 
                echo '<td>'.$itemName.'</td>';
                $rflag = 0;
            }
        } else {
            echo "<tr class='item' name='".$groupName." ".$itemName."' id='list ".$groupName." ".$itemName."' itemscope itemtype=\"http://schema.org/Product\">
                <td class='iName'>
                    <a title='Купить ".$groupName." ".$itemName."' name='".$itemHash."' href='Добавить в заказ' class='addItem' onClick=\"addItem('".$groupName."','".$itemName."','".$itemPrice."','".$cAr."','".$itemWeight."','".$itemLength."','".$itemKf."','".$itemHash."','".$itemHashN."','".$itemEd."','0'); return false\"><img src='/bitrix/templates/trimet/css/basket.png' /></a><span itemprop=\"name\">".$groupName.'</span> '.$ralColor."</td>"; 
            echo '<td itemprop="model">'.$itemName.'</td>';
            $rflag = 1;
        }
        

        
        $ik = 0;
        $hollow = 0;

        foreach($itemPrice as $price){
            echo getPrice($price['_c']['m:Цена']['_v'], $itemWeight, $itemLength, $itemKf, $ik, $rflag, $hollow);
            $ik++;
        }

        // foreach($costArray as $costs){
        //     echo getKfPrice($costs, $itemPrice, $itemWeight, $itemLength, $itemKf, $ik, $rflag);
        //     $ik++;
        // }

        echo '</tr>';
    }
}

function getPrice($TNPrice, $weight, $length, $iKf, $ik, $rflag, $n){
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

        if($ik=='3'){
            if($rflag==1){
                $prices = "<td class='itemPrice itemTN ".$ik."' itemprop=\"offers\" itemscope itemtype=\"http://schema.org/Offer\">
                        <span class='sP' itemprop=\"price\">".money_format('%!i', $TN)."</span>
                        <meta itemprop=\"priceCurrency\" content=\"RUB\" />
                        <span style='display:none;' itemprop=\"availability\" href=\"http://schema.org/InStock\">В наличии</span>
                        <div style='display:none' itemprop=\"seller\" itemscope itemtype=\"http://schema.org/Organization\">
                            <span itemprop=\"name\">Тримет ООО</span>
                            <div itemprop=\"address\" itemscope itemtype=\"http://schema.org/PostalAddress\">
                                <span itemprop=\"streetAddress\">ул. Республики, 278 а, строение 1</span>
                                <span itemprop=\"postalCode\">625014</span>
                                <span itemprop=\"addressLocality\">Тюмень, Россия</span> 
                            </div>
                            <span itemprop=\"telephone\">+7 (3452) 520-670</span>
                        </div></td>";
            } else {
                $prices = "<td class='itemPrice itemTN ".$ik."'><span class='sP'>".money_format('%!i', $TN)."</span></td>";
            }
            
        } else {
            $prices = "<td class='itemPrice itemTN ".$ik."'><span class='sP'>".money_format('%!i', $TN)."</span></td>";
        }
        if($PC!='-'){
            $prices .= "<td class='itemPrice itemPC_hid'>".money_format('%!i', $PC)."</td>";
        } else {
            $prices .= "<td class='itemPrice itemPC_hid'>-</td>";
        }
        if($PM!='-'){
            $prices .= "<td class='itemPrice itemPM_hid'>".money_format('%!i', $PM)."</td>";
        } else {
            $prices .= "<td class='itemPrice itemPM_hid'>-</td>";
        }
    } else {
        if($ik=='2'){
            if($rflag==1){
                $prices = "<td class='itemPrice itemTN ".$ik."' itemprop=\"offers\" itemscope itemtype=\"http://schema.org/Offer\">
                        <span class='sP' itemprop=\"price\">".money_format('%!i', $TN)."</span>
                        <meta itemprop=\"priceCurrency\" content=\"RUB\" />
                        <span style='display:none;' itemprop=\"availability\" href=\"http://schema.org/InStock\">В наличии</span>
                        <div style='display:none' itemprop=\"seller\" itemscope itemtype=\"http://schema.org/Organization\">
                            <span itemprop=\"name\">Тримет ООО</span>
                            <div itemprop=\"address\" itemscope itemtype=\"http://schema.org/PostalAddress\">
                                <span itemprop=\"streetAddress\">ул. Республики, 278 а, строение 1</span>
                                <span itemprop=\"postalCode\">625014</span>
                                <span itemprop=\"addressLocality\">Тюмень, Россия</span> 
                            </div>
                            <span itemprop=\"telephone\">+7 (3452) 520-670</span>
                        </div></td>";
            } else {
                $prices = "<td class='itemPrice itemTN ".$ik."'><span class='sP'>".money_format('%!i', $TN)."</span></td>";
            }
            
        } else {
            $prices = "<td class='itemPrice itemTN ".$ik."'><span class='sP'>".money_format('%!i', $TN)."</span></td>";
        }
        if($PC!='-'){
            $prices .= "<td class='itemPrice itemPC_hid'>".money_format('%!i', $PC)."</td>";
        } else {
            $prices .= "<td class='itemPrice itemPC_hid'>-</td>";
        }
        if($PM!='-'){
            $prices .= "<td class='itemPrice itemPM_hid'>".money_format('%!i', $PM)."</td>";
        } else {
            $prices .= "<td class='itemPrice itemPM_hid'>-</td>";
        }
    }


    return $prices;
}

function getKfPrice($kf, $basePrice, $weight, $length, $iKf, $ik, $rflag){
    setlocale(LC_MONETARY, 'ru_RU');
    
    $TN = bigRound(($basePrice/(1-($kf/100))));
    $PC = (round(($TN/1000)*round($weight*$length)*$iKf*100)/100);

    if($length==0 || $iKf==0){
        $PC = '-';
        $PM = '-';
    } else {
        $PM = (round(($PC/($length))*$iKf*100)/100);
    }

    if($ik=='3'){
        if($rflag==1){
            $prices = "<td class='itemPrice itemTN ".$ik."' itemprop=\"offers\" itemscope itemtype=\"http://schema.org/Offer\">
                    <span itemprop=\"price\">".money_format('%!i', $TN)."</span>
                    <meta itemprop=\"priceCurrency\" content=\"RUB\" />
                    <span style='display:none;' itemprop=\"availability\" href=\"http://schema.org/InStock\">В наличии</span>
                    <div style='display:none' itemprop=\"seller\" itemscope itemtype=\"http://schema.org/Organization\">
                        <span itemprop=\"name\">Тримет ООО</span>
                        <div itemprop=\"address\" itemscope itemtype=\"http://schema.org/PostalAddress\">
                            <span itemprop=\"streetAddress\">ул. Республики, 278 а, строение 1</span>
                            <span itemprop=\"postalCode\">625014</span>
                            <span itemprop=\"addressLocality\">Тюмень, Россия</span> 
                        </div>
                        <span itemprop=\"telephone\">+7 (3452) 520-670</span>
                    </div></td>";
        } else {
            $prices = "<td class='itemPrice itemTN'>".money_format('%!i', $TN)."</td>";
        }
        
    } else {
        $prices = "<td class='itemPrice itemTN'>".money_format('%!i', $TN)."</td>";
    }
    if($PC!='-'){
        $prices .= "<td class='itemPrice itemPC_hid'>".money_format('%!i', $PC)."</td>";
    } else {
        $prices .= "<td class='itemPrice itemPC_hid'>-</td>";
    }
    if($PM!='-'){
        $prices .= "<td class='itemPrice itemPM_hid'>".money_format('%!i', $PM)."</td>";
    } else {
        $prices .= "<td class='itemPrice itemPM_hid'>-</td>";
    }
    

    return $prices;
}

function bigRound($i){
    $i = $i/10;
    $i = ceil($i);
    $i = $i*10;
    return $i;
}

function getRAL($rkey){
    $ralArray = array('1014'=>'#DFCEA1','3003'=>'#870A24','3005'=>'#581E29','3011'=>'#791F24','5002'=>'#162E7B','5005'=>'#004389',
                '5021'=>'#00747D','6002'=>'#276230','6005'=>'#0E4438','6029'=>'#006F43','7004'=>'#999A9F','8017'=>'#45302B',
                '9002'=>'#DADBD5','9003'=>'#F8F9FB');

    foreach ($ralArray as $key => $value) {
        if($rkey==$key){
            return $value;
        }
    }
    return $rkey;
}





createPrice($groupArrays, 0, $costArray, 0);

echo '</ul>';


// print_r($groupArrays[1]['_c']['m:Группа'][0]['_c']['m:Группа']); 

?>