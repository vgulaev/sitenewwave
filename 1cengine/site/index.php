<?php session_start(); ?>
<?php
require_once('mobile.inc.php');
$m = new Mobile_Detect();
if( $m->isMobile() ){
   
    if(isset($_GET["linkUID"])){    
        $URL = "pda/qrorder.php?linkUID=".$_GET['linkUID'];
        header("Location: $URL");
    }
    
}
?>
<!DOCTYPE html>
<?php
$fp = fopen("../../locate/ru/templates/mainpage_template.html","r");
$template_string = fread($fp, filesize("../../locate/ru/templates/mainpage_template.html"));
fclose($fp);

$titleTemplate = '<title> Тримет </title>';
$keywordsTemplate = '"металлопрокат, профнастил, металлосайдинг, купить, онлайн, тюмень, арматура, балка, швеллер, трубы, угол, штрипс, квадрат, круг, лист, проволока" />';
$descriptionTemplate = '"Покупка металлосайдинга, профнастила, металлопроката в Тюмени онлайн" />';
$description = $descriptionTemplate;

if(isset($_GET["ref"])){
    $ntitle = str_replace("\\\"", "\"",$_GET["ref"]);
    $ntitle = str_replace("(", "", $ntitle);
    $ntitle = str_replace(")", "", $ntitle);
    $ntitle = str_replace("\"", "", $ntitle);

    $title = '<title> '.$ntitle.' купить онлайн | Тримет ООО </title>';

    $keywordsArray = explode(" ", $ntitle);
    $keywordsString = "";
    foreach($keywordsArray as $keyword){
        $keywordsString .= $keyword.", ";
    }
    $keywordsString .= "купить, онлайн, тюмень";

    $keywords = '"'.$keywordsString.'" />';
    
} else {
    $title = '<title> Купить Online </title>';
    $keywords = $keywordsTemplate;
}

if(isset($_GET["catalog"])){
    $fp = fopen("seotags.json","r");
    $json_string = fread($fp, filesize("seotags.json"));
    fclose($fp);
    $tag = $_GET["catalog"];
    $tag = str_replace(" ", "_", $tag);
    $tag = str_replace("%20", "_", $tag);

    $tags_obj = json_decode($json_string);
    if($tags_obj->$tag->title!=""){
        $title = '<title> ' . $tags_obj->$tag->title . ' </title>';
        $description = '"' . $tags_obj->$tag->description . '" />'; 
    } 
}

$template_string = str_replace($titleTemplate, $title, $template_string); 
$template_string = str_replace($keywordsTemplate, $keywords, $template_string); 
$template_string = str_replace($descriptionTemplate, $description, $template_string);
$template_string = str_replace("</body>", "", $template_string); 
$template_string = str_replace("</html>", "", $template_string); 


echo $template_string;

?>

<div id="main2">

    <a id="top" title="Перейти к содержимому" tabindex="1" href="#sm"></a><div id="header"></div>
      <!-- /header -->
    <div class="clear"></div><div id="post-header"></div>

<script type="text/javascript" src='/lib/frameworks/jqrequired/jquery.blockUI.js'> </script>
<script type="text/javascript" src='/lib/frameworks/jqrequired/jquery.cookie.js'> </script>
<script type="text/javascript" src='/1cengine/site/js/modern_uiJs.js'> </script>
<script type="text/javascript" src='/1cengine/site/js/modern_ui_goods_handler.js'> </script>
<script type="text/javascript" src="/lib/frameworks/raf_sha256.js"> </script>


<link rel="stylesheet" type="text/css" href="/1cengine/site/modern_style.css" />

<h1 style="font-size:14px;display:none">Продажа металлопроката, профнастила и металлосайдинга онлайн в Тюмени и Тюменской Области</h1>

<table style="width:100%;">
    <tr>
        <td id="leftTr">

            <div id='showBasketSpan'>
                <p><a href='Показать%20заказ' title='Заказ' id='tabBasket' onClick='return false'>Показать заказ (<span class='basketCount'>0</span>)</a></p>
                <p style="display:none;"><a href="http://trimet.ru/1cengine/productinformation/cataloginformation/index_products.php" title="Просмотреть индекс каталога товаров">Индекс</a></p>
                <p>Скачать прайс:
                    <ul>
                        <li><a href="/download/files/price.xlsx" title="Скачать прайс в формате xls">xls</a></li>
                        <li><a href="/download/files/price.pdf" title="Скачать прайс в формате pdf">pdf</a></li>
                        <li><a href="/download/files/price.ods" title="Скачать прайс в формате ods">ods</a></li>
                    </ul>
                </p>
            </div>
            <div id='showPriceSpan'>
                <p><a href='Показать%20прайс' title='В прайс' id='tabPrice' onClick='return false'>Добавить товар</a></p>
                <p><a href='javascript:createOrder()' title='Сохранить заказ'>Оформить заказ</a></p>
                <p>Скачать заказ:
                    <ul>
                        <li><a href='javascript:getOrderFomat("xlsx")' title="Скачать прайс в формате xls">xls</a></li>
                        <li><a href='javascript:getOrderFomat("pdf")' title="Скачать прайс в формате pdf">pdf</a></li>
                        <li><a href='javascript:getOrderFomat("odf")' title="Скачать прайс в формате ods">ods</a></li>
                    </ul>
                </p>

            </div>
            
        </td>
        <td id="mainTr" rowspan="2">
            <div id="pTableContentTab">
                <div id="searchDiv">
                    <input id="itemName" placeholder="Введите здесь интересующий вас товар" <?php if($_GET["catalog"]!=""){ echo 'value="'.$_GET["catalog"].'"'; } ?> />
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
                            if($_GET["catalog"]!=""){
                                $_GET["term"]=$_GET["catalog"];
                                require_once("getItems.php");
                            }
                        ?>
                    </table>
                </div>
                <p>
                    <a id="showAll" <?php if($_GET["catalog"]==""){ echo 'style="display:none;"'; } ?>prstat -s rss href="Все%20результаты" onClick="return false">
                        Показать все результаты
                    </a>
                </p>

                <div id="tags" <?php if($_GET["catalog"]!=""){ echo 'style="display:none;"'; } ?> >
                    <table class="tagTab" style="font-size:16px">
                        <tr>
                            <td class="iRefTd armaTagTd"><a href="#" onclick="yaCounter15882208.reachGoal('onCloudLinkPressed', 'Арматура'); showGroup2('Арматура'); return false;"><div class="armaTagDiv"></div><span><strong>Арматура</strong></span></a></td>
                            <td class="iRefTd listTagTd"><a href="#" onclick="yaCounter15882208.reachGoal('onCloudLinkPressed', 'Лист'); showGroup2('Лист'); return false;"><div class="listTagDiv"></div><span><strong>Лист</strong></span></a></td>
                            <td class="iRefTd shvellerTagTd"><a href="#" onclick="yaCounter15882208.reachGoal('onCloudLinkPressed', 'Швеллер'); showGroup2('Швеллер'); return false;"><div class="shvellerTagDiv"></div><span><strong>Швеллер</strong></span></a></td>
                        </tr>
                        <tr>
                            <td class="iRefTd balkaTagTd"><a href="#" onclick="yaCounter15882208.reachGoal('onCloudLinkPressed', 'Балка'); showGroup2('Балка'); return false;"><div class="balkaTagDiv"></div><span><strong>Балка</strong></span></a></td>
                            <td class="iRefTd trubaTagTd"><a href="#" onclick="yaCounter15882208.reachGoal('onCloudLinkPressed', 'Труба'); showGroup2('Труба'); return false;"><div class="trubaTagDiv"></div><span><strong>Труба</strong></span></a></td>
                            <td class="iRefTd profnastilTagTd"><a href="#" onclick="yaCounter15882208.reachGoal('onCloudLinkPressed', 'Профнастил'); showGroup2('Профнастил'); return false;"><div class="profnastilTagDiv"></div><span><strong>Профнастил</strong></span></a></td>
                        </tr>
                        <tr>
                            <td class="iRefTd kvadratTagTd"><a href="#" onclick="yaCounter15882208.reachGoal('onCloudLinkPressed', 'Квадрат'); showGroup2('Квадрат'); return false;"><div class="kvadratTagDiv"></div><span><strong>Квадрат</strong></span></a></td>
                            <td class="iRefTd provolokaTagTd"><a href="#" onclick="yaCounter15882208.reachGoal('onCloudLinkPressed', 'Проволока'); showGroup2('Проволока'); return false;"><div class="provolokaTagDiv"></div><span><strong>Проволока</strong></span></a></td>
                            <td class="iRefTd ugolTagTd"><a href="#" onclick="yaCounter15882208.reachGoal('onCloudLinkPressed', 'Угол'); showGroup2('Угол'); return false;"><div class="ugolTagDiv"></div><span><strong>Угол</strong></span></a></td>
                        </tr>
                        <tr>
                            <td class="iRefTd krugTagTd"><a href="#" onclick="yaCounter15882208.reachGoal('onCloudLinkPressed', 'Круг'); showGroup2('Круг'); return false;"><div class="krugTagDiv"></div><span><strong>Круг</strong></span></a></td>
                            <td class="iRefTd metallosaidingTagTd"><a href="#" onclick="yaCounter15882208.reachGoal('onCloudLinkPressed', 'Металлосайдинг'); showGroup2('Металлосайдинг'); return false;"><div class="metallosadingTagDiv"></div><span><strong>Металлосайдинг</strong></span></a></td>
                            <td class="iRefTd shtripsTagTd"><a href="#" onclick="yaCounter15882208.reachGoal('onCloudLinkPressed', 'Штрипс'); showGroup2('Штрипс'); return false;"><div class="shtripsTagDiv"></div><span><strong>Штрипс</strong></span></a></td>
                        </tr>
                        <tr>
                            <td class="iRefTd metallocherepicaTagTd"><a href="#" onclick="yaCounter15882208.reachGoal('onCloudLinkPressed', 'Металлочерепица'); showGroup2('Металлочерепица'); return false;"><div class="metallocherepicaTagDiv"></div><span><strong>Металлочерепица</strong></span></a></td>
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
                    <div class="inactiveDiv" id="switchPaymentDiv">Оплатить заказ</div>
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
                            <tr>
                                <td>Стоимость доп. услуг:</td>
                                <td id='SumRezka'></td>
                            </tr>
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
                                            <option price='2400' value='Длинномер' checked > Длинномер </option>
                                            <option price='1200' value='Газель'> Газель </option>
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

                    <a href="Посмотреть%20заказ" onClick="$('#switchOrderDiv').click(); return false"><div id="backToBasketButton">Посмотреть заказ</div></a>

                    <a href="javascript:createOrder()" style="text-decoration:none;"><div id="sendOrderButton">Оформить</div></a>

                    <!-- <span id='email'>E-mail для уведомлений: <input id='emailInput' type='textarea' value='' /></span> -->
                </div>

                <div id="paymentDiv">
                    <form action="https://e-commerce.raiffeisen.ru/vsmc3ds/pay/3dsproxy_init.jsp" method="post" name="form1" id="form1">
                        <table>
                            <tr>
                                <td colspan="3" class="HeaderColor"><h4>Запрос на платежную странцу Райффайзенбанка</h4>      </td>
                            </tr>
                            <tr style="vertical-align: top">
                                <td style="text-align: right" class="LabelColor" nowrap="nowrap">
                                    <label for="username"> MerchantID*</label>      </td>
                                <td colspan="2" class="TitleColor">
                                <p>
                                  <input name="MerchantID" type="text" id="MerchantID"  value="000001680213001-80213001" />
                                </p>
                                <p><span class="small">*Номер, состоящий из MerchantID и TerminalID вида 00000168XXXXXXX-XXXXXXXX</span> </p></td>
                            </tr>
                            <tr style="vertical-align: top">
                                <td style="text-align: right" class="LabelColor">
                                    <label for="password"> MerchantName</label>  
                                </td>
                                <td colspan="2" class="TitleColor">
                                    <input name="MerchantName" type="text" id="MerchantName"  value="Trimet" />
                                </td>
                            </tr>
                            <tr style="vertical-align: top">
                                <td style="text-align: right" class="LabelColor">
                                    <label for="PCurrencyCode"> MerchantURL</label>
                                </td>
                                <td colspan="2" class="TitleColor">
                                    <input name="MerchantURL" type="text" id="MerchantURL"  value="http://www.trimet.ru" />
                                </td>
                            </tr>
                            <tr style="vertical-align: top">
                                <td style="text-align: right" class="LabelColor">
                                    <label for="label3">SuccesURL*</label>
                                </td>
                                <td colspan="2" class="TitleColor">
                                    <p>
                                        <input name="SuccessURL" type="text" id="TargetURL2"   value="http://success.com"/>
                                    </p>
                                    <p>*URL страницы, на которую будет осуществлен переход клиентом после завершения платежа </p>
                                </td>
                            </tr>
                            <tr style="vertical-align: top">
                                <td style="text-align: right" class="LabelColor"><label for="label3">FailURL*</label>      </td>
                                <td colspan="2" class="TitleColor">
                                    <p>
                                        <input name="FailURL" type="text" id="TargetURL"   value="http://fail.org"/>
                                    </p>
                                    <p>*URL страницы, на которую будет осуществлен переход клиентом после завершения платежа </p>
                                </td>
                            </tr>
                            <tr style="vertical-align: top">
                                <td style="text-align: right" class="LabelColor">
                                    <label for="label"> MerchantCity</label>
                                </td>
                                <td colspan="2" class="TitleColor">
                                    <input name="MerchantCity" type="text" id="MerchantCity"  value="MOSCOW"/>
                                </td>
                            </tr>
                            <tr style="vertical-align: top">
                                <td style="text-align: right" class="LabelColor">
                                    <label for="label4"> Language*</label>
                                </td>
                                <td colspan="2" class="TitleColor">
                                    <p>
                                        <input name="Language" type="text" id="Language"  value="01" />
                                    </p>
                                    <p>
                                        <span class="small">*01 - русский, 02 - английский</span>
                                    </p>
                                </td>
                            </tr>
                            <tr style="vertical-align: top">
                                <td style="text-align: right" class="LabelColor">
                                    <label for="label5">CountryCode*</label>
                                </td>
                                <td colspan="2" class="TitleColor">
                                    <p>
                                        <input name="CountryCode" type="text" id="CountryCode"   value="643"/>
                                    </p>
                                    <p>* Страна платежа по договору. Обычно 643 - Россия</p>
                                </td>
                            </tr>
                            <tr style="vertical-align: top">
                                <td style="text-align: right" class="LabelColor">
                                    <label for="label8">CurrencyCode*</label>
                                </td>
                                <td colspan="2" class="TitleColor">
                                    <p>
                                        <input name="CurrencyCode" type="text" id="CurrencyCode"   value="643"/>
                                    </p>
                                    <p>* Код валюты по договору. Обычно 643. Если платеж проводится в валюте, отличной от рублей, в данное поле все равно проставляется 643, как в договоре.
                                    </p>
                                </td>
                            </tr>
                            <tr style="vertical-align: top">
                                <td style="text-align: right" class="LabelColor">
                                    <label for="label6">PurchaseDesc*</label>
                                </td>
                                <td colspan="2" class="TitleColor">
                                    <p>
                                        <input name="PurchaseDesc" type="text" id="PurchaseDesc"  value="test_descriptor" />
                                </p>
                                <p>* Номер платежа, он же номер заказа, он же дескриптор платежа. Строка не более 40 символов, содержащая символы латинского алфавита, цифры, а также некоторые спецсимволы (точка, запятая, тире, двоеточие; полный список символов уточняйте у сотрудников Банка.</p></td>
                            </tr>
                            <tr style="vertical-align: top">
                                <td style="text-align: right" class="LabelColor">
                                    <label for="label7">PurchaseAmt*</label>
                                </td>
                                <td colspan="2" class="TitleColor">
                                    <p>
                                        <input name="PurchaseAmt" type="text" id="PurchaseAmt"  value="1.00" />
                                    </p>
                                    <p>* Сумма платежа в рублях. Разделитель целой и дробной части - точка. В случае, если платеж проводится в валюте отличной от рублей в это поле следует проставлять 0.</p>
                                </td>
                            </tr>
                            <tr style="vertical-align: top">
                              <td style="text-align: right" class="LabelColor"><label for="label9">PCurrencyCode*</label>      </td>
                              <td colspan="2" class="TitleColor"><p>
                                  <input name="PCurrencyCode" type="text" id="PCurrencyCode"  />
                                </p>
                                  <p>* Код валюты платежа. В случае, если оплата происходит в рублях это поле не заполняется.</p></td>
                            </tr>
                            <tr style="vertical-align: top">
                              <td style="text-align: right" class="LabelColor"><label for="label10">PPurchaseAmt*</label>      </td>
                              <td colspan="2" class="TitleColor"><p>
                                  <input name="PPurchaseAmt" type="text" id="PPurchaseAmt"  />
                                </p>
                                  <p>* Сумма платежа в валюте, отличной от рублей (если указан PCurrencyCode). В случае, если оплата происходит в рублях это поле не заполняется.</p></td>
                            </tr>
                            <tr style="vertical-align: top">
                              <td style="text-align: right" class="LabelColor">Выбор дополнительных полей в запросе</td>
                              <td colspan="2">        <p class="TitleColor">
                                  <label for="male"></label>
                                  <label>
                                  <input type="checkbox" name="CardholderName" id="CardholderName"  value="Y" checked="checked"/>
                                  Имя и Фамилия</label>
                              </p>
                              <p class="TitleColor">
                                <label>
                                <input type="checkbox" name="Email" id="Email"  value="Y" />
                                </label>
                              E-mail</p>
                              <p class="TitleColor">
                                <label>
                                <input type="checkbox" name="Country" id="Country"  value="Y" /> 
                                Страна</label>
                              </p>
                              <p class="TitleColor">
                                <label>
                                <input type="checkbox" name="City" id="City"  value="Y" />
                                Город        </label>
                              </p>
                              <p class="TitleColor">
                                <label>
                                <input type="checkbox" name="Address" id="Address"  value="Y" />
                                Адрес        </label>
                              </p>
                              <p class="TitleColor">
                                <label>
                                <input type="checkbox" name="Phone" id="Phone"  value="Y" /> 
                                Телефон</label><label></label>
                              </p>      </td>
                            </tr>
                            <tr style="vertical-align: top">
                              <td style="text-align: right" class="LabelColor">        HMAC      </td>
                              <td colspan="2">
                                <table width="550" border="1" cellpadding="0" cellspacing="0" bordercolor="#660033">
                                <tr>
                                  <td width="13%">Ключ в формате Base64</td>
                                  <td colspan="2"><label>
                                    <input name="key_b" type="text" id="key_b"  value="adz2dvZ7g0e9dDr/RHx/uez4/0jcG2I+ymjw3XEuriU="/>
                                  </label></td>
                                  <td width="17%" rowspan="2">
                                    <input type="button" name="base_to_hex" id="base_to_hex" value="Base64ToHex" onclick="javascript: BTH();" />
                                    <input type="button" name="hex_to_base" id="hex_to_base" value="HexToBase64" onclick="javascript: HTB();"/>          </td>
                                </tr>
                                <tr>
                                  <td>Ключ в формате Hex</td>
                                  <td colspan="2"><input name="key_h" type="text" id="key_h"  /></td>
                                  </tr>

                                <tr>
                                  <td rowspan="3">Временное окно</td>
                                  <td colspan="2"><label>
                                    <input type="checkbox" name="use_time_window" id="use_time_window" />
                                  Использовать временное окно</label></td>
                                  <td rowspan="3">&nbsp;</td>
                                </tr>
                                <tr>
                                  <td width="33%"><p>Значение в секундах</p></td>
                                  <td width="37%"><input name="Window" type="text" id="window_val"  /></td>
                                </tr>
                                <tr>
                                  <td>Текущее время</td>
                                  <td><input name="Time" type="text" id="time_val"  /></td>
                                </tr>
                                <tr>
                                  <td>Параметр Options</td>
                                  <td colspan="2"><label>
                                    <input name="Options" type="text" id="Options" />
                                  </label></td>
                                  <td>&nbsp;</td>
                                </tr>
                                <tr>
                                  <td>Контольная строка</td>
                                  <td colspan="2"><input name="control_string" type="text" id="control_string"  /></td>
                                  <td><input type="button" name="compute_result" id="compute_result" value="Вычислить строку" onClick="javascript: ComputeCString();"/></td>
                                </tr>
                                <tr>
                                  <td>HMAC для отправки</td>
                                  <td colspan="2"><input name="HMAC" type="text" id="HMAC" />
                                    <label></label></td>
                                  <td><input type="button" name="gen_hmac" id="gen_hmac" value="HMAC Base64" onclick="javascript:GENb64();"/><input type="button" name="gen_hmac" id="gen_hmac" value="HMAC Hex"  onclick="javascript:GENhex();" /></td>
                                </tr>
                              </table></td>
                        </tr>
                        <tr style="vertical-align: top" class="FooterColor">
                          <td colspan="3">
                            <input type="submit" name="SubmitName" value="Создать платеж" />      </td>
                        </tr>
                      </table>
                    </form>
                </div>
            </div>
        </td>
    </tr>
    <tr>
        <td id="leftTrBottomTd">
            <p><a href="http://trimet.ru/banking/">Правила онлайн оплаты</a></p>
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
