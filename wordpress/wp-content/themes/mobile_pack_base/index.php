<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="initial-scale=1.0, user-scalable=no">
		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name="apple-mobile-web-app-status-bar-style" content="black">
		<title>My prj</title>
		<link rel="stylesheet" href="https://s3.amazonaws.com/codiqa-cdn/mobile/1.2.0/jquery.mobile-1.2.0.min.css" />
		<!--link rel="stylesheet" href="m/my.css" /-->
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
		<!--script src="https://s3.amazonaws.com/codiqa-cdn/mobile/1.2.0/jquery.mobile-1.2.0.min.js"></script-->
        <!--script src="http://code.jquery.com/mobile/1.3.0/jquery.mobile-1.3.0.min.js"></script-->
		<script src="lib/frameworks/jquerymobile/1.3.0/jquery.mobile-1.3.0.min.js"></script>
		<script src="m/my.js"></script>
		<!-- User-generated css -->
		<style>
		</style>
		<!-- User-generated js -->
		<script>
			try {

				$(function() {

				});

			} catch (error) {
				console.error("Your javascript has an error: " + error);
			}

		</script>
	</head>
	<body>
<!-- Home -->
<div data-role="page" id="Main">
    <div data-role="content">
        <div class="ui-grid-a">
            <div class="ui-block-a" style="width: 180px;">
                <div style="">
                    <img style="width: 160px; height: 47px" src="img/logo.png">
                </div>
            </div>
            <div class="ui-block-b" style="width: 110px;">
                <div>	<a href="http://trimet.ru" data-transition="fade"> Полная версия сайта </a>

                </div>
            </div>
        </div>
        <ul data-role="listview" data-divider-theme="b" data-inset="true">
            <li data-theme="c">	<a href="#page3" data-transition="slide"> Новости </a>

            </li>
            <li data-theme="c">	<a href="#page4" data-transition="slide"> Контакты </a>

            </li>
            <li data-theme="c">	<a href="#assortiment" data-transition="slide"> Ассортимент </a>

            </li>
        </ul>
        <!--select id="sdsfsd" name="select-choice-1">
            <option value="null">Выберите группу товаров</option>
        </select-->
        <div id="output">	<b> Enter content here... </b>

        </div>
    </div>
</div>
<!-- news -->
<div data-role="page" id="page3">
    <div class="ui-grid-a">
        <div class="ui-block-a" style="width: 180px;">
            <div style="">
                <img style="width: 160px; height: 47px" src="img/logo.png">
            </div>
        </div>
        <div class="ui-block-b" style="width: 110px;">
            <div>	<a href="http://trimet.ru" data-transition="fade"> Полная версия сайта </a>

            </div>
        </div>
    </div>
    <div data-role="content">
        <ul data-role="listview" data-divider-theme="b" data-inset="true">
            <li data-theme="c" data-icon="arrow-l">	<a href="#Main" data-transition="slide"> Назад </a>

            </li>
        </ul>
    </div>
</div>
<!-- Contacts -->
<div data-role="page" id="page4">
    <div data-role="content">
        <div class="ui-grid-a">
            <div class="ui-block-a" style="width: 180px;">
                <div style="">
                    <img style="width: 160px; height: 47px" src="img/logo.png">
                </div>
            </div>
            <div class="ui-block-b" style="width: 110px;">
                <div>	<a href="http://trimet.ru" data-transition="fade"> Полная версия сайта </a>

                </div>
            </div>
        </div>
        <div data-role="collapsible-set">
            <div data-role="collapsible">
                	<h3> Телефоны </h3>

                <div>
                    <p>	<b> Отдел продаж: <a title="Звонить" href="tel:+73452-520-670" data-mce-href="tel:+73452-520-670"> +7-3452-520670
								<br>
								<br>
								</a> </b>
	<b> Снабжение: <a title="Звонить" href="tel:+73452-520-675" data-mce-href="tel:+73452-520-675"> +7-3452-520675 </a> </b>

                    </p>
                </div>
            </div>
        </div>
        <div data-role="collapsible-set">
            <div data-role="collapsible">
                	<h3> Адреса </h3>

                <div>
                    <p>	<b> Офис: 625014 г. Тюмень, ул. Республики, 278а, стр.1 </b>

                    </p>
                </div>
            </div>
        </div>
        <ul data-role="listview" data-divider-theme="b" data-inset="true">
            <li data-theme="c" data-icon="arrow-l">	<a href="#Main" data-transition="slide"> Назад </a>

            </li>
        </ul>
    </div>
</div>
<div data-role="page" id="assortiment">
    <div data-role="content">
        <ul data-role="listview" data-divider-theme="b" data-inset="true">
            <li data-theme="c" data-icon="arrow-l">	<a href="#Main" data-transition="slide"> Назад </a>

            </li>
        </ul>
        <!--a id=" ButtonEx" data-role="button" href="#page1" onclick="doSomething(); return false" rel="external"> Button </a-->
        <select id="NamingRules" name="select-choice-1">
            <option value="null">Выберите группу товаров</option>
        </select>
		<fieldset data-role="controlgroup">
		<div id="queryconditionfields"></div>
		</fieldset>
        <ul id="nomenklaturalist" data-role="listview" data-divider-theme="b" data-inset="true"></ul>
		<!--a id=" ButtonEx" data-role="button" href="#page1" onclick="doSomething2(); return false" rel="external"> Button </a-->
    </div>
</div>
	</body>
</html>