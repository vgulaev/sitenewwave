<HTML><HEAD>
<META content="text/html; charset=utf-8" http-equiv=Content-Type>
<META name=GENERATOR content="MSHTML 9.00.8112.16437"></HEAD>
<BODY>

<?php

setlocale(LC_ALL, "ru_RU");

function my_dbConnect(){
    mysql_connect('localhost','trimetru_goods','&rUI24*(^o') OR DIE("Не могу создать соединение ");

    mysql_select_db('trimetru_goods') or die(mysql_error());
    mysql_query('SET NAMES utf8');
}

my_dbConnect();

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


$filename = 'yml.xml';
$handle = fopen($filename, 'w');
fwrite($handle, $yml);

$r1 = mysql_query("SELECT `groups`.`name`, `groups`.`id` FROM `groups` WHERE `groups`.`parent_hash`=`groups`.`hash` ");

if (mysql_num_rows($r1)>0){
    while($row = mysql_fetch_array($r1, MYSQL_NUM)){
        
        $addRow = '<category id="'.$row[1].'">'.$row[0].'</category>
        ';
        fwrite($handle, $addRow);
    }
}

fwrite($handle, '</categories><offers>');

$r = mysql_query("SELECT `groups`.`name`, `offers`.`display_name`, `offers`.`char_name`, `offers`.`price`, `groups`.`id`, `offers`.`stock` FROM `offers`, `groups` WHERE `offers`.`parent_hash`=`groups`.`hash` ");


if (mysql_num_rows($r)>0){
	$num = 0;
    while($row = mysql_fetch_array($r, MYSQL_NUM)){
        $price = explode('|', $row[3]);
        if($row[5]!=0){
            $inStock = 'true';
        } else {
            $inStock = 'false';
        }

        if($row[2]!='<'){
            $addRow = '<offer id="99'.$num.'" available="true">
            <url>http://www.trimet.ru/1cengine/site/index.php?ref='.rawurlencode($row[1]).' '.rawurlencode($row[2]).'</url>
            <price>'.$price[0].'</price>
            <currencyId>RUR</currencyId>
            <categoryId>'.$row[4].'</categoryId>
            <store>'.$inStock.'</store>
            <pickup>true</pickup>
            <delivery>false</delivery>
            <name>'.$row[1].' '.htmlspecialchars($row[2]).'</name>           
        </offer>';

            fwrite($handle, $addRow);
            $num++;
        }

        
    }
}




fwrite($handle, '</offers></shop></yml_catalog>');

fclose($handle);

echo 'YML generated';

?>

</BODY></HTML>