<?php 

$filename = 'http://37.1.196.142/yandex/yRequest.php';
$file = fopen($filename, "r"); //Открываем файл
$contents = '';
while (!feof($file)) {
  $contents .= fread($file, 8192);
}
// $text = fread($file, filesize($filename)); //Считываем весь файл
fclose($file); //Закрываем файл

echo $contents;

?>