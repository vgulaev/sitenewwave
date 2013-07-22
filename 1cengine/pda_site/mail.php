<?php 

$fp = fopen("../../../locate/ru/templates/mainpage_template.html","r");
$template_string = fread($fp, filesize("../../../locate/ru/templates/mainpage_template.html"));
$qq = '<link rel="stylesheet" type="text/css" href="/mainpage_template.css" media="all" />';
$titleTamplate = '<title> Главная страница </title>';
$title = '<title> Тримет мобильный заказ </title>';
$template_string = str_replace($titleTamplate, $title, $template_string); 
echo $template_string;
fclose($fp);

?>
<?php
    $filename = $_POST['file_format']; //Имя файла для прикрепления
    $to = $_POST['mail_to']; //Кому
    $from = "admin@trimet.ru"; //От кого
    $subject = '=?utf-8?B?'.base64_encode('Заказ Тримет').'?=';
    $message = "Компания Тримет благодарит вас за покупку и расчитывает на дальнейшее сотрудничество"; //Текст письма
    $boundary = "---"; //Разделитель
    /* Заголовки */
    $headers = "From: $from\nReply-To: $from\n";
    $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"";
    $body = "--$boundary\n";
    /* Присоединяем текстовое сообщение */
    $body .= "Content-type: text/html; charset=utf-8\n";
    $body .= "Content-Transfer-Encoding: quoted-printablenn";
    $body .= "Content-Disposition: attachment; filename==?utf-8?B?".base64_encode($filename)."?=\n\n";
    $body .= $message."\n";
    $body .= "--$boundary\n";
    $file = fopen($filename, "r"); //Открываем файл
    $contents = '';
    while (!feof($file)) {
      $contents .= fread($file, 8192);
    }
    // $text = fread($file, filesize($filename)); //Считываем весь файл
    fclose($file); //Закрываем файл
    /* Добавляем тип содержимого, кодируем текст файла и добавляем в тело письма */
    $body .= "Content-Type: application/octet-stream; name==?utf-8?B?".base64_encode($filename)."?=\n";
    $body .= "Content-Transfer-Encoding: base64\n";
    $body .= "Content-Disposition: attachment; filename==?utf-8?B?".base64_encode($filename)."?=\n\n";
    $body .= chunk_split(base64_encode($contents))."\n";
    $body .= "--".$boundary ."--\n";
    if(mail($to, $subject, $body, $headers)){
        echo 'Отправлено';
        echo "
            <script type='text/javascript'>
                function jumpToPrice(){
                    window.location = '../index.php'
                }
                setTimeout('jumpToPrice()', 5000);        
            </script>
            ";
    }
?>

<?php 

// $fp = fopen("../../mainfooter_template.html","r");
echo file_get_contents("../../../locate/ru/templates/mainfooter_template.html");
// fclose($fp);
?>
</body>