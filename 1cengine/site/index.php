<?php session_start(); ?>
<!--DOCTYPE html-->
<?php
require_once('mobile.inc.php');
$m = new Mobile_Detect();
if( $m->isMobile() ){
   
    if(isset($_GET["linkUID"])){    
        $URL = "pda/qrorder.php?linkUID=".$_GET['linkUID'];
        header("Location: $URL");
    }
    
}

$fp = fopen("../../locate/ru/templates/mainpage_template.html","r");
$template_string = fread($fp, filesize("../../locate/ru/templates/mainpage_template.html"));
fclose($fp);

$titleTamplate = '<title> Тримет </title>';

if(isset($_GET["ref"])){
    $ntitle = str_replace("\\\"", "\"",$_GET["ref"]);
    $ntitle = str_replace("(", "", $ntitle);
    $ntitle = str_replace(")", "", $ntitle);
    $ntitle = str_replace("\"", "", $ntitle);

    $title = '<title> '.$ntitle.' купить онлайн | Тримет ООО </title>';
    // $APPLICATION->SetPageProperty("keywords", "".$_GET["ref"].", купить, тримет, тюмень");
    // $APPLICATION->SetPageProperty("description", "Купить ".$_GET["ref"]." в компании Тримет");
} else {
    $title = '<title> Купить Online </title>';
    // $APPLICATION->SetPageProperty("keywords", "металлопрокат, профнастил, металлосайдинг, купить, онлайн, тюмень, арматура, балка, швеллер, трубы, угол, штрипс, квадрат, круг, лист, проволока");
    // $APPLICATION->SetPageProperty("description", "Покупка металлосайдинга, профнастила, металлопроката в Тюмени онлайн");
}

$template_string = str_replace($titleTamplate, $title, $template_string); 
$template_string = str_replace("</body>", "", $template_string); 
$template_string = str_replace("</html>", "", $template_string); 


echo $template_string;

if(isset($_GET["ref"])){
    if(strstr($_GET["ref"], "кастом")!=false){

        header( 'Refresh: 0; url=http://trimet.ru/404.html?ref='.urlencode($_GET["ref"]).'' );
    }
}

?>

<div id="main2">

    <a id="top" title="Перейти к содержимому" tabindex="1" href="#sm"></a><div id="header"></div>
      <!-- /header -->
    <div class="clear"></div><div id="post-header"></div>

<script type="text/javascript" src='/lib/frameworks/jqrequired/jquery.blockUI.js'> </script>
<script type="text/javascript" src='/lib/frameworks/jqrequired/jquery.cookie.js'> </script>

<script type="text/javascript" src='js/modern_uiJs.js'> </script>


<link rel="stylesheet" type="text/css" href="modern_style.css" />

<h1 style="font-size:14px;display:none">Продажа металлопроката, профнастила и металлосайдинга онлайн в Тюмени и Тюменской Области</h1>

<table style="width:100%;">
    <tr>
        <td id="leftTr">

            <span id='showBasketSpan'>
                <p><a href='Показать заказ' title='Заказ' id='tabBasket' onClick='return false'>Показать заказ (<span class='basketCount'>0</span>)</a></p>
                <!-- <p><a href="javascript:showGroups()" title="Показать группы товаров">Показать группы товаров</a></p> -->
                <p style="display:none;"><a href="http://trimet.ru/1cengine/productinformation/cataloginformation/index_products.php" title="Просмотреть индекс каталога товаров">Индекс</a></p>
                <p>Скачать прайс:
                    <li><a href="/download/files/price.xlsx" title="Скачать прайс в формате xls">xls</a></li>
                    <li><a href="/download/files/price.pdf" title="Скачать прайс в формате pdf">pdf</a></li>
                    <li><a href="/download/files/price.ods" title="Скачать прайс в формате ods">ods</a></li>
                </p>
            </span>
            <span id='showPriceSpan'>
                <p><a href='Показать прайс' title='В прайс' id='tabPrice' onClick='return false'>Добавить товар</a></p>
                <p><a href='javascript:createOrder()' title='Сохранить заказ'>Оформить заказ</a></p>
                <p>Скачать заказ:
                    <li><a href='javascript:getOrderFomat("xlsx")' title="Скачать прайс в формате xls">xls</a></li>
                    <li><a href='javascript:getOrderFomat("pdf")' title="Скачать прайс в формате pdf">pdf</a></li>
                    <li><a href='javascript:getOrderFomat("odf")' title="Скачать прайс в формате ods">ods</a></li>
                </p>

            </span>
            
        </td>
        <td id="mainTr" rowspan="2">
            <div id="pTableContentTab">
                <div id="searchDiv">
                    <input id="itemName" placeholder="Введите здесь интересующий вас товар" />
                    <div id="searchButton">Найти</div>
                </div><br />
                <a href="javascript:showGroups()" title="Показать группы товаров"><div id="showGroupsDiv">Показать группы</div></a>
                <span id="hollowResult"></span>
                <div id="qRes">
                    <table id="tableRes">
                        <?php
                            if($_GET["ref"]!=""){
                                $_GET["term"]=$_GET["ref"];
                                $_GET["strict"]="yes";
                                require_once("getItems.php");
                            }
                        ?>
                    </table>
                </div>
                <p>
                    <a id="showAll" style="display:none" href="Все результаты" onClick="return false">
                        Показать все результаты
                    </a>
                </p>

                <div id="tags">
                    <table class="tagTab" style="font-size:16px">
                        <tr>
                            <td class="iRefTd armaTagTd"><a href="Открыть группу" onclick="yaCounter15882208.reachGoal('onCloudLinkPressed', 'Арматура'); showGroup2('Арматура'); return false;"><div class="armaTagDiv"></div><span><strong>Арматура</strong></span></a></td>
                            <td class="iRefTd listTagTd"><a href="Открыть группу" onclick="yaCounter15882208.reachGoal('onCloudLinkPressed', 'Лист'); showGroup2('Лист'); return false;"><div class="listTagDiv"></div><span><strong>Лист</strong></span></a></td>
                            <td class="iRefTd shvellerTagTd"><a href="Открыть группу" onclick="yaCounter15882208.reachGoal('onCloudLinkPressed', 'Швеллер'); showGroup2('Швеллер'); return false;"><div class="shvellerTagDiv"></div><span><strong>Швеллер</strong></span></a></td>
                        </tr>
                        <tr>
                            <td class="iRefTd balkaTagTd"><a href="Открыть группу" onclick="yaCounter15882208.reachGoal('onCloudLinkPressed', 'Балка'); showGroup2('Балка'); return false;"><div class="balkaTagDiv"></div><span><strong>Балка</strong></span></a></td>
                            <td class="iRefTd trubaTagTd"><a href="Открыть группу" onclick="yaCounter15882208.reachGoal('onCloudLinkPressed', 'Труба'); showGroup2('Труба'); return false;"><div class="trubaTagDiv"></div><span><strong>Труба</strong></span></a></td>
                            <td class="iRefTd profnastilTagTd"><a href="Открыть группу" onclick="yaCounter15882208.reachGoal('onCloudLinkPressed', 'Профнастил'); showGroup2('Профнастил'); return false;"><div class="profnastilTagDiv"></div><span><strong>Профнастил</strong></span></a></td>
                        </tr>
                        <tr>
                            <td class="iRefTd kvadratTagTd"><a href="Открыть группу" onclick="yaCounter15882208.reachGoal('onCloudLinkPressed', 'Квадрат'); showGroup2('Квадрат'); return false;"><div class="kvadratTagDiv"></div><span><strong>Квадрат</strong></span></a></td>
                            <td class="iRefTd provolokaTagTd"><a href="Открыть группу" onclick="yaCounter15882208.reachGoal('onCloudLinkPressed', 'Проволока'); showGroup2('Проволока'); return false;"><div class="provolokaTagDiv"></div><span><strong>Проволока</strong></span></a></td>
                            <td class="iRefTd ugolTagTd"><a href="Открыть группу" onclick="yaCounter15882208.reachGoal('onCloudLinkPressed', 'Угол'); showGroup2('Угол'); return false;"><div class="ugolTagDiv"></div><span><strong>Угол</strong></span></a></td>
                        </tr>
                        <tr>
                            <td class="iRefTd krugTagTd"><a href="Открыть группу" onclick="yaCounter15882208.reachGoal('onCloudLinkPressed', 'Круг'); showGroup2('Круг'); return false;"><div class="krugTagDiv"></div><span><strong>Круг</strong></span></a></td>
                            <td class="iRefTd metallosaidingTagTd"><a href="Открыть группу" onclick="yaCounter15882208.reachGoal('onCloudLinkPressed', 'Металлосайдинг'); showGroup2('Металлосайдинг'); return false;"><div class="metallosadingTagDiv"></div><span><strong>Металлосайдинг</strong></span></a></td>
                            <td class="iRefTd shtripsTagTd"><a href="Открыть группу" onclick="yaCounter15882208.reachGoal('onCloudLinkPressed', 'Штрипс'); showGroup2('Штрипс'); return false;"><div class="shtripsTagDiv"></div><span><strong>Штрипс</strong></span></a></td>
                        </tr>
                        <tr>
                            <td class="iRefTd metallocherepicaTagTd"><a href="Открыть группу" onclick="yaCounter15882208.reachGoal('onCloudLinkPressed', 'Металлочерепица'); showGroup2('Металлочерепица'); return false;"><div class="metallocherepicaTagDiv"></div><span><strong>Металлочерепица</strong></span></a></td>
                        </tr>
                        
                    </table>
                    
                </div>

            </div>
            <div id="basketDiv" style="display:none">
                <span id="basketCaption">Заказ покупателя</span>

                <div id="switchDiv">
                    <div class="activeDiv" id="switchOrderDiv">Товары</div>
                    <div class="inactiveDiv" id="switchDeliveryDiv">Доставка</div>
                    <div class="inactiveDiv" id="switchNotificationDiv">Оформить заказ</div>
                    <div id="showNDSlabel"><input type="checkbox" id="showNds" /><label for="showNds">Показать НДС</label></div>
                </div>
                <div id="orderDiv">
                    <table id='basketTab' cellspacing='0' cellpadding='0'>
                      <thead>
                         <tr>
                            <th class='itemHeader'>
                                №
                            </th>
                            
                            <th class='itemHeader'>
                                Номенклатура
                            </th>
                            
                            <th class='itemHeader'>
                                Хар-ка
                            </th>
                            
                            <th class='itemHeader'>
                                Кол-во
                            </th>
                            
                            <th class='itemHeader'>
                                Ед.
                            </th>

                            <th class='itemHeader'>
                                Цена
                            </th>
                            
                            <th class='itemHeader NDSHeader'>
                                Ставка НДС
                            </th>

                            <th class='itemHeader NDSHeader'>
                                Сумма НДС
                            </th>
                            
                            <th class='itemHeader'>
                                Сумма
                            </th>

                            <th style='display:none'>
                            </th>
                         </tr>
                      </thead>
                      <tbody id='lItemTab'>
  
                      </tbody>
                    </table>
                    <div id='Summary'>
                        <table>
                            <tr>
                                <td>Общий вес:</td>
                                <td id='CountAll'></td>
                            </tr>
                            <tr>
                                <td>Стоимость товара:</td>
                                <td id='SumGoods'></td>
                            </tr>
                            <tr>
                                <td><span class='withDelivery' style='display:none'>Стоимость доставки:</span><span class='withoutDelivery'>Без доставки</span></td>
                                <td id='SumDelivery'></td>
                            </tr>
                            <!-- <tr>
                                <td>Стоимость доп. услуг:</td>
                                <td id='SumRezka'></td>
                            </tr> -->
                            <tr>
                                <td>Общая стоимость:</td>
                                <td name='0' id='SumAll'></td>
                            </tr>
                            <tr class="ndsAllsum" style="display:none">
                                <td>НДС (в т. ч.):</td>
                                <td id='NDSAll'></td>
                            </tr>
                        </table>                     
                    </div>
                </div>
                <div id="deliveryDiv">
                    <!-- <div id='shipment'> -->
                        <!-- <form id='shipmentForm'> -->

                            <div id="deliver_choise">
                                <label for="selfCarry"> Самовывоз</label>
                                <input type="radio" id="selfCarry" name="deliver_selfCarry" checked />
                                <label for="toDeliver" class="tDC"> Доставка</label>
                                <input type="radio" id="toDeliver" name="deliver_selfCarry" />
                            </div>

                            <table id='deliveryTab'>
                                <tr>
                                    <td>Выберете город</td>
                                    <td>
                                        <select id='townSelect'>
                                            <option value='' selected disabled>--</option>
                                            <option value='72000001'>Тюмень</option>
                                            <option price='44600' value='74002003'>Аша</option>
                                            <option price='30700' value='660000280005'>В. Салда</option>
                                            <option price='19500' value='66000001'>Екатеринбург</option>
                                            <option price='7900' value='72009001'>Заводоуковск</option>
                                            <option price='17800' value='72011001'>Ишим</option>
                                            <option price='12300' value='03020000139'>Курган</option>
                                            <option price='7400' value='72013000001'>Н. Тавда</option>
                                            <option price='27900' value='66000023'>Н. Тагил</option>
                                            <option price='41800' value='86000014'>Нефтеюганск</option>
                                            <option price='58500' value='86000011'>Нижневартовск</option>
                                            <option price='72500' value='54000001'>Новосибирск</option>
                                            <option price='92000' value='89000006'>Новый Уренгой</option>
                                            <option price='36200' value='55000001'>Омск</option>
                                            <option price='22300' value='66000016'>Первоуральск</option>
                                            <option price='22300' value='66000017'>Полевской</option>
                                            <option price='39000' value='86000007'>Пыть-Ях</option>
                                            <option price='44600' value='86000010'>Сургут</option>
                                            <option price='8400' value='660000360005'>Тавда</option>
                                            <option price='13900' value='72000002'>Тобольск</option>
                                            <option price='22300' value='72018000001'>Уват</option>
                                            <option price='53000' value='86000001'>Ханты-Мансийск</option>
                                            <option price='27900' value='74000001'>Челябинск</option>
                                            <option price='12300' value='45000002'>Шадринск</option>
                                            <option price='6800' value='72021001'>Ялуторовск</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Введите адрес</td>
                                    <td>
                                        <input type='textarea' name='destination' id='destination' value='' placeholder='Введите здесь адрес' /> 
                                    </td>
                                </tr>
                                <tr>
                                    <td>Выберете транспорт</td>
                                    <td>
                                        <select id='carry' name='carry'>
                                            <option disabled selected>--</option>
                                            <option price='2400' value='Длинномер' checked /> Длинномер </option>
                                            <option price='1200' value='Газель' /> Газель </option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Стоимость доставки</td>
                                    <td><span id="delivery_cost"></span></td>
                                </tr>
                                
                            </table>
                        <!-- </form> -->
                    <!-- </div> -->
                    <!-- <p id="sCP"></p> -->
                    
                </div>
                <div id="notificationDiv">

                    <table class="orderFormTable">
                        <tr>
                            <td>Фамилия</td>
                            <td>
                                <input type="textarea" class="orderFormInput" id="lastNameInput" />
                            </td>
                        </tr>
                        <tr>
                            <td>Имя и Отчество</td>
                            <td>
                                <input type="textarea" class="orderFormInput" id="nameSurnameInput" />
                            </td>
                        </tr>
                        <tr>
                            <td>*Электронная почта</td>
                            <td>
                                <input type="textarea" id='emailInput' class="orderFormInput" />
                            </td>
                        </tr>
                        <tr>
                            <td>*Телефон для связи</td>
                            <td>
                                <input type="textarea" class="orderFormInput" id="mainPhoneInput" />
                            </td>
                        </tr>
                        <tr>
                            <td>Дополнительный телефон для связи</td>
                            <td>
                                <input type="textarea" class="orderFormInput" id="otherPhoneInput" />
                            </td>
                        </tr>
                    </table>

                    <p>*Обязательны для заполнения</p>

                    <a href="Посмотреть заказ" onClick="$('#switchOrderDiv').click(); return false"><div id="backToBasketButton">Посмотреть заказ</div></a>

                    <a href="javascript:createOrder()" style="text-decoration:none;"><div id="sendOrderButton">Оформить</div></a>

                    <!-- <span id='email'>E-mail для уведомлений: <input id='emailInput' type='textarea' value='' /></span> -->
                </div>
            </div>
        </td>
    </tr>
    <tr>
        <td id="leftTrBottomTd">
            <p><a href="http://trimet.ru/1cengine/site/howmakeorder.php">Как выписать счёт?</a></p>
            <p><a href="http://trimet.ru/1cengine/site/howitcreating.php">Оставить отзыв</a></p>
        </td>
    </tr>
</table>
    <a class='scrollTop' href='#header' style='display:none;'></a>  


</div> <!-- /main -->

<?php 

// $fp = fopen("../../mainfooter_template.html","r");
echo file_get_contents("../../locate/ru/templates/mainfooter_template.html");
// fclose($fp);
?>


</body>
</html>
