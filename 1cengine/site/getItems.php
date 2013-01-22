<?php

// header('Content-Type: text/html; charset=utf-8');
$req = $_GET['term'];


require_once("secrets.php");

function getItems($req){

    $ret = array();

    $pArray = array();

    $reqArray = explode(" ", $req);

    $c = count($reqArray);

    $cond = 'WHERE ';
    if($_GET["strict"]=="yes"){
        /*$ij=0;
        foreach($reqArray as $rA){
            // print_r($rA." | ");
            if($ij==$c-1){
                $cond .= "`offers`.`char_name` = '".$rA."' AND ";
            } else {
                $cond .= "`offers`.`name` LIKE '%".$rA." %' AND ";
            }
            $ij++;
        }*/
        $cond .= "CONCAT(display_name, ' ', char_name) LIKE '%".$req."%' AND ";
        //echo $cond;
    } else {
        
        foreach($reqArray as $rA){
            if (strlen($rA) > 1){
                $cond .= "`offers`.`name` LIKE '%".$rA."%' AND ";
            } elseif (strlen($rA) == 1) {
                $cond .= "`offers`.`name` LIKE '% ".$rA." %' AND ";
            }
        }
    }

    

    if(isset($_GET["show_all"])){
        $r = mysql_query("SELECT `offers`.`display_name`, `offers`.`char_name`, `offers`.`price`, 
                `offers`.`price_type`, `groups`.`name`, `offers`.`hash`, `offers`.`edIzm`, `offers`.`father_hash`, `offers`.`stock`
                FROM `offers`, `groups` ".$cond." `offers`.`parent_hash`=`groups`.`hash`");
    } else {
        if($_GET["strict"]=="yes"){
            $r = mysql_query("SELECT `offers`.`display_name`, `offers`.`char_name`, `offers`.`price`, 
                `offers`.`price_type`, `groups`.`name`, `offers`.`hash`, `offers`.`edIzm`, `offers`.`father_hash`, `offers`.`stock`
                FROM `offers`, `groups` ".$cond." `offers`.`parent_hash`=`groups`.`hash` LIMIT 1");
        } else {
            $r = mysql_query("SELECT `offers`.`display_name`, `offers`.`char_name`, `offers`.`price`, 
                `offers`.`price_type`, `groups`.`name`, `offers`.`hash`, `offers`.`edIzm`, `offers`.`father_hash`, `offers`.`stock`
                FROM `offers`, `groups` ".$cond." `offers`.`parent_hash`=`groups`.`hash` ORDER BY `offers`.`stock` DESC LIMIT 20");
        }
        
    }
    
    // print_r(mysql_num_rows($r));

    
    if (mysql_num_rows($r)>0){
        while($row = mysql_fetch_array($r, MYSQL_NUM)){
            
            //echo $row[2];

            $ral = explode('RAL ', $row[0]);
            if(isset($ral[1])){
                $rkey = explode(' ',$ral[1]);
                $ralColor = getRAL($rkey[0]);
                // $ralColor = '<div style="width:60px;height:15px;background-color:'.getRAL($rkey).';border:1px solid black;float:right">'.' '.'</div>';
            } else {
                $ralColor = '';
            }


            if(!isset($pArray[$row[4]])){
                $pArray[$row[4]] = array();
                echo '<tr class="iHeader"><td><strong>'.$row[4].'</strong></td><td>Размер</td>';
                $priceTypeArray = explode("|", $row[3]);
                $i=0;
                foreach($priceTypeArray as $priceType){
                    if($priceType!=''){
                        if($i==0){
                            echo '<td class="priceHeader">'.$priceType.'<br /><span>Цена <font color="red">Я</font>ндекса</span></td>';
                        } else {
                            echo '<td class="priceHeader">'.$priceType.'<br /><span>Цена</span></td>';
                        }
                        $i++;
                    }        
                }
                echo '</tr>';
            }

            $priceArray = explode("|", $row[2]);

            $rt = '<tr class="item" id="'.$row[5].':'.$row[7].'" itemscope itemtype="http://schema.org/Product">
                <td name="'.$row[0].'" class="itemName" >
                <span itemprop="name">'.$row[0].'</span>   
                    <span class="buySpan">';
            if($row[8]!=0){
                $rt .= '<a class="bItem" href="Добавить в корзину" onClick="yaCounter15882208.reachGoal(\'onBuyLinkPressed\', \'купить\'); openItem(\''.$row[5].':'.$row[7].'\', \''.$row[6].'\', \''.$row[2].'\',\'1\'); return false">купить</a>
                    </span></td>'; 
            } else {
                $rt .= '<a class="oItem" href="Добавить в корзину" onClick="yaCounter15882208.reachGoal(\'onBuyLinkPressed\', \'заказать\'); openItem(\''.$row[5].':'.$row[7].'\', \''.$row[6].'\', \''.$row[2].'\',\'0\'); return false">заказать</a>
                    </span></td>';
            }
            
            if($ralColor!=""){
                $rt .= '<td name="'.$row[1].'" class="itemChar" itemprop="model" style="background-color:'.$ralColor.';"><span style="color:#cfcfcf;text-shadow: 1px 1px 2px black, 0 0 1em grey;">'.$row[1].'</span></td>';
            } else {
                $rt .= '<td name="'.$row[1].'" class="itemChar" itemprop="model">'.$row[1].'</td>';
            }
            
            $paLength = count($priceArray)-2;
            $j=0;
            foreach($priceArray as $price){
                if($price!=''){
                    if($j==$paLength){
                        $rt .= '<td class="price itemPrice'.$j.'" itemprop="offers" itemscope itemtype="http://schema.org/Offer">
                                <span itemprop="price">'.$price.'</span>
                                <meta itemprop="priceCurrency" content="RUB" />
                                <span style="display:none;" itemprop="availability" href="http://schema.org/InStock">В наличии</span>
                                <div style="display:none;" itemprop="seller" itemscope itemtype="http://schema.org/Organization">
                                    <span itemprop="name">Тримет ООО</span>
                                    <div itemprop="address" itemscope itemtype="http://schema.org/PostalAddress">
                                        <span itemprop="streetAddress">ул. Республики, 278 а, строение 1</span>
                                        <span itemprop="postalCode">625014</span>
                                        <span itemprop="addressLocality">Тюмень, Россия</span> 
                                    </div>
                                    <span itemprop="telephone">+7 (3452) 520-670</span>
                                </div>
                            </td>';
                    } else {
                        $rt .= '<td class="price itemPrice'.$j.'"><span>'.$price.'</span></td>';
                    }        
                    $j++;
                }
            }
            $rt .= '</tr>';

            array_push($pArray[$row[4]], $rt);
            echo $rt;
            $ret[] = $rt;
        

        }
    }
    
    return $ret;
}

function getItemsFromHash($hash, $char, $count,$rezka){

    $hashArray = explode(":", $hash);

    $itemHash = $hashArray[0];
    $pHash = $hashArray[1];
    $newRow = "";

    // echo $itemHash." | ".$pHash;

    $r = mysql_query("SELECT `offers`.`display_name`, `offers`.`char_name`, `offers`.`price`, `offers`.`edIzm` FROM `offers` WHERE `offers`.`hash`='".$itemHash."' AND `offers`.`father_hash`='".$pHash."' ");
    if (mysql_num_rows($r)>0){
        while($row = mysql_fetch_array($r, MYSQL_NUM)){
                
            $cell = "<tr class='itemTr' name='".$hash."'><td></td>";
            
            if($char==''){
                $char = $row[1];
            } else {
                $char = $char;
            }
            $cell .= "<td class='itemNameTd'>".$row[0];
            $cell .= '<span class="delEdSpan">';
            
            $cell .= '<a href="Убрать из корзины" onClick="delModernItem(\''.$hash.'\'); return false">X</a>';
            $cell .= '<a href="#" onClick="modern_editItem(\''.$hash.'\'); return false"><img src="edit.png" /></a></span></td>';

            $cell .= "<td class='itemCharTd'>".$char."</td>";
            $cell .= "<td class='itemCountTd'><input class='itemCountInput' name='".$row[3]."' type='textarea' value='".$count."' disabled /></td>";
            $cell .= "<td class='itemEdIzmTd' name='".$row[3]."'>".$row[3]."</td>";
            $cell .= "<td class='itemPriceTd' name='".$row[2]."'></td>";
            $cell .= "<td class='itemNdsKfTd'>18%</td>";
            $cell .= "<td class='itemNdsSumTd'></td>";
            $cell .= "<td class='itemSumTd'></td>";
            $cell .= "<td class='itemRezlaTd' style='display:none'>".$rezka."</td>";

            $newRow .= $cell.'</tr>';
        
        }

    }

    echo $newRow;
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

$cdate = date('d.m.y H:i:s');

$content = $cdate.';'.$_GET['term']."\n";

$filename = 'searchQueries.csv';
$handle = fopen($filename, 'a+');
fwrite($handle, $content);
fclose($handle);

my_dbConnect();
//print_r(getStreets($town,$req));

if($_POST["from_hash"]=="true"){
    $hash = $_POST["hash"];
    $char = $_POST["char"];
    $count = $_POST["count"];
    $rezka = $_POST["rezka"];
    getItemsFromHash($hash, $char, $count,$rezka);
} else {
    $res = getItems($req);

    if($_GET["strict"]=="yes"){
        if(!isset($res[0])){
            echo "<tr><td>Извините, данный товар в настоящее время отсутствует на складе</td></tr>";
        }
    }
}



?>