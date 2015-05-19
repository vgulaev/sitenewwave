<HTML><HEAD>
<META content="text/html; charset=utf-8" http-equiv=Content-Type>
<META name=GENERATOR content="MSHTML 9.00.8112.16437"></HEAD>
<BODY>

<?php

setlocale(LC_ALL, "ru_RU");

require_once("1cengine/site/secrets.php");

my_dbConnect();

$filename = 'sitemapBase.xml';
$handle = fopen($filename, 'r');
$size = filesize ( 'sitemapBase.xml' );
    // считываем весь файл в переменную $content
$sitemap = fread ( $handle, $size );
    //  закрываем процесс
fclose ( $handle ); 

$filename = 'sitemap.xml';
$handle = fopen($filename, 'w');
fwrite($handle, $sitemap);

$r = mysql_query("SELECT `offers`.`display_name`, `offers`.`char_name` FROM `offers`");

if (mysql_num_rows($r)>0){
    while($row = mysql_fetch_array($r, MYSQL_NUM)){
        
        $addRow = '<url>
                  <loc>http://trimet.ru/1cengine/site/?ref='.rawurlencode($row[0].' '.$row[1]).'</loc>
                  <priority>0.7</priority>
                  <changefreq>daily</changefreq>
               </url>
               ';

        fwrite($handle, $addRow);

    }
}

fwrite($handle, '</urlset>');

fclose($handle);

echo 'Sitemap generated';
// print_r($groupArrays[1]['_c']['m:Группа'][0]['_c']['m:Группа'][0]['_c']['m:Предмет']); 

?>

</BODY></HTML>