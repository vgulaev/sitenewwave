<?php

header('Content-Type: text/html; charset=utf-8');
$req = $_GET['term'];


function my_dbConnect(){
    mysql_connect('localhost','trimetru_goods','&rUI24*(^o') OR DIE("Не могу создать соединение ");

    mysql_select_db('trimetru_goods') or die(mysql_error());
    mysql_query('SET NAMES utf8');
}
function getItems($req){

    $ret = array();

    $pArray = array();

    $reqArray = explode(" ", $req);

    $c = count($reqArray);

    $cond = 'WHERE ';
    if($_GET["strict"]=="yes"){
        $ij=0;
        foreach($reqArray as $rA){
            // print_r($rA." | ");
            if($ij==$c-1){
                $cond .= "`offers`.`char_name` = '".$rA."' AND ";
            } else {
                $cond .= "`offers`.`name` LIKE '%".$rA." %' AND ";
            }
            $ij++;
        }
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


            if(!isset($pArray[$row[4]])){
                $pArray[$row[4]] = array();
                echo '<tr class="iHeader"><td><strong>'.$row[4].'</strong></td><td></td>';
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
                $rt .= '<a class="bItem" href="Добавить в корзину" onClick="yaCounter15882208.reachGoal(\'onBuyLinkPressed\', \'купить\'); showModalItem(\''.$row[5].':'.$row[7].'\', \''.$row[6].'\', \''.$row[2].'\',\'1\'); return false">купить</a>
                    </span></td>'; 
            } else {
                $rt .= '<a class="oItem" href="Добавить в корзину" onClick="yaCounter15882208.reachGoal(\'onBuyLinkPressed\', \'заказать\'); showModalItem(\''.$row[5].':'.$row[7].'\', \''.$row[6].'\', \''.$row[2].'\',\'0\'); return false">заказать</a>
                    </span></td>';
            }
            
            $rt .= '<td name="'.$row[1].'" class="itemChar" itemprop="model">'.$row[1].'</td>';
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

function getItemsFromHash($hash, $char, $count){

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
            $cell .= '<span class="buySpan">';
            $cell .= '<a class="oItem" href="Убрать из корзины" onClick="delModernItem(\''.$hash.'\'); return false">X</a></span></td>';
            $cell .= "<td class='itemCharTd'>".$char."</td>";
            $cell .= "<td class='itemCountTd'><input class='itemCountInput' name='".$row[3]."' type='textarea' value='".$count."' /></td>";
            $cell .= "<td class='itemEdIzmTd' name='".$row[3]."'>".$row[3]."</td>";
            $cell .= "<td class='itemPriceTd' name='".$row[2]."'></td>";
            $cell .= "<td class='itemNdsKfTd'>18%</td>";
            $cell .= "<td class='itemNdsSumTd'></td>";
            $cell .= "<td class='itemSumTd'></td>";

            $newRow .= $cell.'</tr>';
        
        }

    }

    echo $newRow;
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
    getItemsFromHash($hash, $char, $count);
} else {
    $res = getItems($req);

    if($_GET["strict"]=="yes"){
        if(!isset($res[0])){
            echo "<tr><td>Извините, данный товар в настоящее время отсутствует на складе</td></tr>";
        }
    }
}



?>