<?php session_start(); ?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<?php
//session_start();
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");

$APPLICATION->IncludeFile(
    SITE_TEMPLATE_PATH . '/include_areas/page_standart_header.php',
    array(),
    array('MODE' => 'php')
);


require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");


?>

<script src="/lib/frameworks/jquery/1.8.3/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src='/lib/frameworks/jqrequired/jquery.cookie.js'> </script>
<script src='authorization.js' type='text/javascript'></script>
<script src="http://loginza.ru/js/widget.js" type="text/javascript"></script>

<link rel="stylesheet" type="text/css" href="style-auth.css" />
<?php 
if($_GET['unreg']==1){
    unset($_SESSION['1cusername']);
    unset($_SESSION['1cuid']);
} 
if($_SESSION['1cusername']!=''){
    echo "
    <div id='loginContent'>
        <div id='loginDiv'>";
    echo "
    <script src='user.js' type='text/javascript'></script>
    <script type='text/javascript'>
        getUser();
    </script>
    <div id='userInfo'>
        <p><h3 class='nickname'>".$_SESSION['1cusername']."</h3></p>
        <p>
            <table id='userTable'>
                <tr>
                    <td>Полное имя</td>
                    <td id='fullname'></td>
                </tr>
                <tr>
                    <td>Электронная почта</td>
                    <td id='email'></td>
                </tr>
                <tr>
                    <td>YandexID</td>
                    <td id='YandexID'></td>
                </tr>
                <tr>
                    <td>GoogleID</td>
                    <td id='GoogleID'></td>
                </tr>
                <tr>
                    <td>VkontakteID</td>
                    <td id='VkontakteID'></td>
                </tr>
                <tr>
                    <td>FacebookID</td>
                    <td id='FacebookID'></td>
                </tr>
                <tr>
                    <td>MailruID</td>
                    <td id='MailruID'></td>
                </tr>
            </table>
        </p>
    </div>";
    echo "Желаете <a href='?unreg=1'>выйти</a>?</div></div>";
} else {
    if($_GET['frombasket']==1){
        $brString = '?frombasket=1';
    } else {
        $brString = '';
    }
    echo "<div id='loginContent'>
    <div id='loginDiv'>
        <form method='post' action='authorization.php' >
            <table>
                <tr>
                    <td>Логин</td>
                    <td>
                        <input id='loginInput' type='textarea' value='' name='login' />
                    </td>
                </tr>
                <tr>
                    <td>Пароль</td>
                    <td>
                        <input id='passwordInput' type='password' name='password' />
                    </td>
                </tr>
                
            </table>
            <input id='enterButton' type='submit' value='Войти' /> или <input id='regButton' type='button' value='Зарегистрироваться' onClick=\"location='http://trimet.ru/1cengine/site/loginza/registration.php'\" />
        </form>
    </div>
    <br />
    <p><strong>Вы так же можете войти, используя аккаунт от следующих сервисов:<br /></strong></p>
    <script src='http://loginza.ru/js/widget.js' type='text/javascript'></script>
    <a href='https://loginza.ru/api/widget?token_url=http://trimet.ru/1cengine/site/loginza/authorization.php".$brString."&provider=google&providers_set=vkontakte,facebook,mailru,yandex,google' class='loginza google_button'> Google </a>
     | <a href='https://loginza.ru/api/widget?token_url=http://trimet.ru/1cengine/site/loginza/authorization.php".$brString."&provider=yandex&providers_set=vkontakte,facebook,mailru,yandex,google' class='loginza yandex_button'> Яндекс </a>
     | <a href='https://loginza.ru/api/widget?token_url=http://trimet.ru/1cengine/site/loginza/authorization.php".$brString."&provider=vkontakte&providers_set=vkontakte,facebook,mailru,yandex,google' class='loginza vkontakte_button'> ВКонтакте </a>
     | <a href='https://loginza.ru/api/widget?token_url=http://trimet.ru/1cengine/site/loginza/authorization.php".$brString."&provider=facebook&providers_set=vkontakte,facebook,mailru,yandex,google' class='loginza facebook_button'> Facebook</a>
     | <a href='https://loginza.ru/api/widget?token_url=http://trimet.ru/1cengine/site/loginza/authorization.php".$brString."&provider=mailru&providers_set=vkontakte,facebook,mailru,yandex,google' class='loginza mailru_button'> Mail.ru </a>
</div>";
echo '<br />'.$_SESSION['1cusername'];
}?>


<?php
$APPLICATION->IncludeFile(
    SITE_TEMPLATE_PATH . '/include_areas/page_standart_pre_footer.php',
    array('css_class' => $cssClass),
    array('MODE' => 'php')
);

$APPLICATION->IncludeFile(
    SITE_TEMPLATE_PATH . '/include_areas/page_standart_footer.php',
    array(),
    array('MODE' => 'php')
);
?>