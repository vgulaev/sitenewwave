<?php
 
// Для запуска требуется PHP 5 
header ("Content-Type: text/html;charset=utf-8");
 
$found = 0;
$pages = 9;
 

?>
 
<?php

$searchArray = array('металлочерепица', 'швеллер', 'лист рифлёный', 'трубы', 
	'квадрат', 'угол', 'металлосайдинг', 'круг', 'штрипс', 'арматура','двутавр',
	'лист просечно вытяжной','профнастил','сетка кладочная','трубы профильные',
	'трубы оцинкованные','балка','купить металлопрокат','продажа металлопроката',
    'металлопрокат ','металлопрокат тюмень','продажа профнастила');

foreach($searchArray as $query){
	$flag = 0;

 
 
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
            $page = 0;
            $pq = ($page * 100 + 1);
            $i = $pq;
            foreach ($found as $item) {

                if(strpos($item->domain, 'trimet')){
                	print 'FOUND '.$query.' on line '.$i.'<br />';
                	$cdate = date('d.m.y H:i:s');

                	$content = $cdate.','.$i."\n";

                	$filename = $query.'.csv';
					$handle = fopen($filename, 'a+');
					fwrite($handle, $content);
					fclose($handle);
					$flag = 1;
                }  

                $i++;
            }
            if($flag==0){
            	print 'NOT FOUND '.$query.' on lines less than 100<br />';
            	$cdate = date('d.m.y H:i:s');

            	$content = $cdate.','.'100'."\n";

            	$filename = $query.'.csv';
				$handle = fopen($filename, 'a+');
				fwrite($handle, $content);
				fclose($handle);
            }
        }

    } else {
        print "Внутренняя ошибка сервера.\n";
    }
    
}
 
?>

