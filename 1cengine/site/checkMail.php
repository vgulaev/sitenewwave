<?php
	$title = 'On-line shop Тримет.рф';
	$mess =  'Добрый день, '. "\r\n";
	$mess .= 'Контактный телефон: +7 (3452) 520-670'."\r\n";
	$mess .= 'С уважением, компания Тримет';
	// $to - кому отправляем
	$to = 'elf607@ya.ru';
	// $from - от кого
	$from='admin@trimet.ru';
	$headers  = 'MIME-Version: 1.0' . "\r\n";
	$headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
	$headers .= 'From:'.$from;
	// функция, которая отправляет наше письмо.
	mail($to, $title, $mess, $headers); 
?>