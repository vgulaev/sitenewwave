<?php
 
// Для запуска требуется PHP 5 
header ("Content-Type: text/html;charset=utf-8");
 

//include "template_header.html";
 
// обработка полей формы
$host  = array_key_exists('host', $_REQUEST)  ? $_REQUEST['host']  : 'www.yandex.ru';

$query = array_key_exists('query', $_REQUEST) ? $_REQUEST['query'] : '';
 

$esc   = htmlspecialchars($query);
$ehost = htmlspecialchars($host);
 
//$search_tail = htmlspecialchars(" host:$ehost");
 

if ($_SERVER["REQUEST_METHOD"] =='GET') {
    $page  = array_key_exists('page', $_GET)     ? $_GET['page'] : 0;

} else $page = 0;
 
$found = 0;
$pages = 9;
 

?>

<style>
    td{
        padding:3px;
        border-right:1px dotted black;
        border-bottom:1px dotted black;
        font-size:10px;
    }
    table{
        border-left:1px dotted black;
        border-top:1px dotted black;
    }
</style>

<?php

$searchArray = array('металлочерепица', 'швеллер', 'лист рифлёный', 'трубы', 
	'квадрат', 'угол', 'металлосайдинг', 'круг', 'штрипс', 'арматура','двутавр',
	'лист просечно вытяжной','профнастил','сетка кладочная','трубы профильные',
	'трубы оцинкованные','балка','купить металлопрокат','продажа металлопроката',
    'металлопрокат ','металлопрокат тюмень','продажа профнастила');
print "<table>";
foreach($searchArray as $query){
	$flag = 0;

    $filename = $query.'.csv';
    $handle = fopen($filename, 'r');
    $contents = fread($handle, filesize($filename));
    fclose($handle);

    $contentsArr = explode("\n", $contents);
    $avr = 0;
    $k = 1;
    foreach($contentsArr as $cline){
        $pos = explode(",",$cline);
        $avr = $avr+$pos[1];
        $k++;
    }
    $avr = $avr/($k-2);

 
    // XML запрос
    $doc = <<<DOC
<?xml version='1.0' encoding='utf-8'?>
<request>
    <query>$query</query>

    <groupings>
        <groupby attr="d" mode="deep" groups-on-page="100"  docs-in-group="1" />
    </groupings>

    <page>$page</page>
</request>
DOC;
 
    $context = stream_context_create(array(

        'http' => array(
            'method'=>"POST",
            'header'=>"Content-type: application/xml\r\n" .
                      "Content-length: " . strlen($doc),
            'content'=>$doc

        )
    ));
 
    $response = file_get_contents('http://xmlsearch.yandex.ru/xmlsearch?user=Elf607&key=03.13977823:e95167db7719613bbe9c579e723e3c66&lr=55', true, $context);
    if ( $response ) {

 
        $xmldoc = new SimpleXMLElement($response);
 
        $error = $xmldoc->response->error;
        $found_all = $xmldoc->response->found;
        $found = $xmldoc->xpath("response/results/grouping/group/doc");
 
        if ($error) {

            print "Ошибка: " . $error[0];
        } else {

            $pq = ($page * 100 + 1);

            $i = $pq;
            foreach ($found as $item) {

                if(strpos($item->domain, 'trimet')){
                	print '<tr><td><font color="green" >НАЙДЕНО</font> </td><td style="font-weight:bold;font-size:12px;">'.$query.'</td> <td>позиция <strong>'.$i.'</strong></td><td> Среднее: <strong>'.round($avr,3).'</strong></td></tr>';
                	$cdate = date('d.m.y H:m:s');

                	$content = $cdate.','.$i."\n";

					$flag = 1;
                }  



                $i++;
            }
            if($flag==0){
            	print '<tr><td><font color="red">НЕ НАЙДЕНО</font> </td><td style="font-weight:bold;font-size:12px;">'.$query.'</td><td>позиция >100</td><td> Среднее: <strong>'.round($avr,3).'</strong></td></tr>';
            	$cdate = date('d.m.y H:m:s');

            	$content = $cdate.','.'100'."\n";

            }
        }

    } else {
        print "Внутренняя ошибка сервера.\n";
    }
    
}
print "</table>";
?>

