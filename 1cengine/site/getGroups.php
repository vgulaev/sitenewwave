<?php
function my_dbConnect(){
    $dbCon = mysql_connect('localhost','trimetru_goods','&rUI24*(^o') OR DIE("Не могу создать соединение ");

    mysql_select_db('trimetru_goods') or die(mysql_error());
    mysql_query('SET NAMES utf8');

    return $dbCon;
}

function getGroups(){
	$query = "SELECT `name`
		FROM `groups`
		WHERE `hash` = `parent_hash`
	";

	$r = mysql_query($query);
	echo "<ul>";
	if(mysql_num_rows($r)>0){
		while($row=mysql_fetch_row($r)){
			echo "<li><a href=\"javascript:showGroup2('".$row[0]."')\"><strong>".$row[0]."</strong></a></li>";
		}
	}
	echo "</ul>";
}

my_dbConnect();
getGroups();

?>