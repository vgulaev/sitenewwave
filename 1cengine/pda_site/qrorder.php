<?php 

$fp = fopen("../../locate/ru/templates/mainpage_template.html","r");
$template_string = fread($fp, filesize("../../locate/ru/templates/mainpage_template.html"));
$qq = '<link rel="stylesheet" type="text/css" href="/mainpage_template.css" media="all" />';
$titleTamplate = '<title> Главная страница </title>';
$title = '<title> Тримет мобильный заказ </title>';
$template_string = str_replace($titleTamplate, $title, $template_string); 
echo $template_string;
fclose($fp);

?>

<script type="text/javascript"> 
$(document).ready(function(){ 
    file_download();
    $(".FileTypeInputClass").change(function(){ 
        if($(this).is(":checked")){
            $('.file_label').removeClass("LabelSelected");
            $(this).next("label").addClass("LabelSelected"); 
        }else{ 
            $(this).next("label").removeClass("LabelSelected"); 
        } 
    });   
}); 
function file_download(){
    if($('.LabelSelected').attr('for')!=undefined){
        var id = $('.LabelSelected').attr('for')
        inp = $('#'+id)
        window.location.href = $(inp).attr('value')    
    } else {
        alert("Вы не выбрали формат файла")
    }
    
}

function send(){
    var id = $('.LabelSelected').attr('for')
    inp = $('#'+id)
    alert($(inp).attr('value'))
}
</script>

<style>
.file_label img{
    width:100px;
    cursor:pointer;
}
.LabelSelected img{
    margin-bottom:10px;
    width:128px;
}
</style>

<?php 
    if(isset($_GET['linkUID']) or isset($_POST['linkUID'])){
        require_once('../php_scripts/getfilelink.php');  
    } else {
        echo "Пустая ссылка";
    }
?>

        <div style="margin-left: 200px"> <h2 style="font-size:24px">Скачать интересующий вас формат:</h2> <br />  
        <form method='POST' action='mail.php'> 
            <input class="FileTypeInputClass" type="radio" name="file_format" value=<?php echo '"'.$answerArray[0].'"'; ?> style="display:none;" id="pdf" checked />
                <label class="file_label" id="label_pdf" for="pdf">
                    <img src='pdf.png' />
                </label>

            <p style="margin-top:15px;margin-left:10px;width:425px;margin-bottom:30px">
                <font style="font-size:22px" > E-mail: </font>
                <input type="textarea" style="width:340px;height:30px;font-size:20px;margin-bottom:20px;" name="mail_to" /> <br /> 
                <input type="submit" value="Отправить" style="width:200px;height:100px;font-size:24px;float:left;margin-left:5px" />
                <input type="button" style="width:200px;height:100px;font-size:24px;float:right;margin-right:10px;" value="Скачать" onClick="file_download()" />
            </p>
            </form>
            <br />
            <p>
                Зарегистрируйтесь, и мы запомним ваш электронный адрес, а так же вы получите возможность самостоятельно создавать счёт и просматривать историю заказов.
            </p>
        </div>

<?php

// $fp = fopen("../../mainfooter_template.html","r");
echo file_get_contents("../../locate/ru/templates/mainfooter_template.html");
// fclose($fp);
?>
</div> <!-- /main -->

</body>
