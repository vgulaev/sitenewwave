<?php

function my_dbConnect(){
    mysql_connect('localhost','root','I08bn64a') OR DIE("Не могу создать соединение ");

    mysql_select_db('trimetru_goods') or die(mysql_error());
    mysql_query('SET NAMES utf8');
}

function getItemChar($itemHash){
	$query = "SELECT `length`,`weight`,`kf`
		FROM `offers`
		WHERE `hash` = '".$itemHash."'
	";

	$r = mysql_query($query);

	if(mysql_num_rows($r)>0){
		while($row=mysql_fetch_row($r)){
			echo $row[0]."|".$row[1]."|".$row[2];
		}
	}
}

function getItemCharP($itemHash){
	$query = "SELECT `length`,`weight`,`kf`
		FROM `offers`
		WHERE `father_hash` = '".$itemHash."'
	";

	$r = mysql_query($query);

	if(mysql_num_rows($r)>0){
		while($row=mysql_fetch_row($r)){
			echo $row[0]."|".$row[1]."|".$row[2];
		}
	}
}

if(isset($_POST["item_hash"])){
	$itemHash = $_POST["item_hash"];	
} else {
	$itemHash = $_GET["item_hash"];
}

//$itemHash = $_GET["item_hash"];

$hashArray = explode(":", $itemHash);

if(strlen($hashArray[0])>6){
	$itemHash = $hashArray[0];
	my_dbConnect();
	getItemChar($itemHash);
} else {
	$itemHash = $hashArray[1];
	my_dbConnect();
	getItemCharP($itemHash);
}

if(isset($_GET['commited'])){
	echo 'commited. again!';
}
if(isset($_GET['saved'])){
	echo 'saved from sftp';
}

?>