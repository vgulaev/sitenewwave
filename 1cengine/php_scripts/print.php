<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link type="text/css" rel="stylesheet" media="all" href="print.css" />
    <script type="text/javascript">
    	
    	setTimeout('window.stop()', 3000)
	</script>
</head>
<body>
<div id='printForm'>
<div id='title'>Калькуляция потребности <span id='calcNum'><?php echo $_POST['number']; ?></span></div>
<div id='product'>
<table id='productList' cellspacing='0'>
    <thead>
        <tr>
            <th>№</th>
            <th>Товар</th>
            <th>Кол-во</th>
            <th>Ед.</th>
            <th>Цена</th>
            <th>Сумма</th>
        <tr>
    </thead>
    <tfoot>
        <tr>
            <td></td>
            <td class='itogoTD'>Итого:</td>
            <td id='amountTD'><?php echo $_POST['weightSum']; ?></td>
            <td></td>
            <td></td>
            <td id='sumTD'><?php echo $_POST['sumSum']; ?></td>
        </tr>
        <tr>
            <td colspan='5'>В том числе НДС:</td>
            <td id='ndsSpan'><?php echo $_POST['ndsSum']; ?></td>
        </tr>
    </tfoot>
    <?php echo $_POST['table']; ?>
    <!-- <tbody id='productTabBody'>
    </tbody> -->
</table>

<div id='summary'>
Всего наименований <span id='itemAll'><?php echo $_POST['items']; ?></span>, на сумму <span id='sumSpan'><?php echo $_POST['sumSum']; ?></span><br />
<span id='parsedSum'><?php echo $_POST['parsedStrSum']; ?></span>
</div>
</div>
<table id='infoTab'>
    <thead>
        <tr>
            <td>ОФОРМЛЕНИЕ  ДОКУМЕНТОВ ДЛЯ  ПОГРУЗКИ:</td>
            <td>ПОГРУЗКА:</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <table>
                    <tr>
                        <td>ПН-ПТ</td>
                        <td class='moarrr'>08:30-17:30</td>
                    </tr>
                </table>
            </td>
            <td>
                <table>
                    <tr>
                        <td>ПН-ПТ</td>
                        <td class='moarrr'>08:30-17:30<br />
                            11:30 до 12:00   -   технологический  перерыв  на  складе																							
    </td>
    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td>
                <table>
                    <tr>
                        <td>СБ</td>
                        <td class='moarrr'>09:00-15:00</td>
                    </tr>
                </table>
            </td>
            <td>
                <table>
                    <tr>
                        <td>СБ</td>
                        <td class='moarrr'>09:00-15:00</td>
                    </tr>
                </table>            
            </td>
        </tr>
        <tr>
            <td>ВС - выходной день</td>
            <td>ВС - выходной день</td>
        </tr>
    </tbody>
</table>
<div id='infoDiv'>
    <p>1) Получить товар по безналичному расчету Вы можете по ФАКТУ ПОСТУПЛЕНИЯ денежных средств на р/с поставщика. Для получения товара необходимо иметь при себе ПАСПОРТ, копию счета, копию платежного поручения и ДОВЕРЕННОСТЬ на право получения товара.</p>
    <p>2) Погрузка краном ведется только в открытую машину. В крытую  машину погрузка осуществляется  платно, весом  до 75кг, общим количеством не более 1тн.</p>
    <p>3) Отгрузка металлопроката осуществляется по фактическому весу.</p>
</div>
<table id='dopUslugi' cellspacing='0'>
    <thead>
        <tr>
            <th colspan='3'>ДОПОЛНИТЕЛЬНЫЕ УСЛУГИ</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                Металлообработка:
                <ul>
                    <li>резка газом, маятниковой пилой;</li>
                    <li>рубка листового проката на гильотине;</li>
                    <li>размотка бухт в прутки.</li>
                </ul>
            </td>
            <td>
                Услуги по доставке:
                <ul>
                    <li>индивидуальный подход;</li>
                    <li>оптимальные цены.</li>
                </ul>
            </td>
            <td>
                Контроль веса:
                <ul>
                    <li>крановые весы;</li>
                    <li>автомобильные весы.</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>
</div>
</body>
</html>

