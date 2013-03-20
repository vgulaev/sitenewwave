<!DOCTYPE html>
<?php 
    $fp = fopen("../../locate/ru/templates/mainpage_template.html","r");
    $template_string = fread($fp, filesize("../../locate/ru/templates/mainpage_template.html"));
    fclose($fp);

    $titleTemplate = '<title> Тримет </title>';
    $keywordsTemplate = '"металлопрокат, профнастил, металлосайдинг, купить, онлайн, тюмень, арматура, балка, швеллер, трубы, угол, штрипс, квадрат, круг, лист, проволока" />';


    $template_string = str_replace($titleTemplate, $title, $template_string); 
    $template_string = str_replace($keywordsTemplate, $keywords, $template_string); 
    $template_string = str_replace("</body>", "", $template_string); 
    $template_string = str_replace("</html>", "", $template_string); 


    echo $template_string;

    $fp = fopen("seotags.json","r");
    $json_string = fread($fp, filesize("seotags.json"));
    fclose($fp);

    // echo $tags_obj->Ооло->title;

    if($tags_obj->ололо==""){
        echo "nya";
    }

    $tags_obj=json_decode($json_string);
    // echo $json_string;
    // print_r($tags_obj);
    echo "<ul>Арматура";
    echo "<li>" . $tags_obj->Арматура_12->url . "</li>";
    echo "<li>" . $tags_obj->Арматура->title . "</li>";
    echo "<li>" . $tags_obj->Арматура->description . "</li>";
    echo "<li>" . $tags_obj->Арматура->text . "</li>";
    echo "</ul>";

    echo $tags_obj->Ооло;

?>