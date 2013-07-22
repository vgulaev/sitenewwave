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


if($_SESSION['1cusername']!=''){
	
	echo "
		<script type='text/javascript'>
			location='http://trimet.ru/1cengine/site/loginza/' 
		</script>
	";
}

?>


<script src="/lib/frameworks/jquery/1.8.3/jquery-1.8.3.min.js"></script>
<script src='registration.js' type='text/javascript'></script>
<link rel="stylesheet" type="text/css" href="style-auth.css" />

<div id='regDiv'>
	<table>
		<tbody>
			<tr>
				<td>Логин:</td>
				<td><input type='textarea' id='login' name='login' value='' /></td>
			</tr>
			<tr>
				<td>ФИО: </td>
				<td><input type='textarea' id='fio' name='fio' value='' /></td>
			</tr>
			<tr>
				<td>E-mail: </td>
				<td><input type='textarea' id='email' name='email' value='' /></td>
			</tr>
			<tr>
				<td>Номер телефона: </td>
				<td><input type='textarea' id='phoneNumber' name='phoneNumber' value='' /></td>
			</tr>
			<tr>
				<td>Пароль:</td>
				<td><input type='password' id='passwdh' name='passwd' value='' /><input type='textarea' id='passwdv' name='passwd' value='' /><br /><span><input type='checkbox' id='showPasswd' /> Показать пароль </span></td>
			</tr>
		</tbody>
	</table>
	<input type='button' id='regButton' value='Зарегистрироваться!' />
</div>
