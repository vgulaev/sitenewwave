<?php
header('Content-Type: text/html; charset=utf-8');
$req = $_GET['term'];
$town = $_GET['town'];

function my_dbConnect(){
    mysql_connect('localhost','trimetru_street','trimetstreetkladr') OR DIE("Не могу создать соединение ");

    mysql_select_db('trimetru_street') or die(mysql_error());
    mysql_query('SET NAMES utf8');
}
function getStreets($town,$req){

    $ret = array();
    
    $r = mysql_query("SELECT `SOCR,C,10`, `NAME,C,40`, `CODE,C,17` FROM `Street`
WHERE `CODE,C,17` LIKE '".$town."%' AND `NAME,C,40` LIKE '".$req."%' ORDER BY `NAME,C,40`");
    if (mysql_num_rows($r)>0){
        while($row = mysql_fetch_array($r, MYSQL_NUM)){
            $t = substr($row[2], 0, 11);
            $r2 = mysql_query("SELECT `SOCR,C,10`, `NAME,C,40`, `CODE,C,13` FROM `Base`
WHERE `CODE,C,13` LIKE '".$t."%' LIMIT 1");
            if (mysql_num_rows($r2)>0){
                while($row2 = mysql_fetch_array($r2, MYSQL_NUM)){
                    //if($row2[2]!=$town.'0000'){
                        $ret[] = $row[0].'. '.$row[1].' ('.$row2[0].'. '.$row2[1].')';
                    //} else {
                    //    $ret[] = $row[0].'. '.$row[1];
                    //}
                } 
            } else {
                $ret[] = $row[0].'. '.$row[1];
            }
        }
    }
    return $ret;
}

my_dbConnect();
//print_r(getStreets($town,$req));
$res = getStreets($town,$req);

$response = json_encode($res);
print_r($response);

?>