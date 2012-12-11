<?php 

$GLOBALS["name_register"] = "";
$GLOBALS["depth_level"] = -1;
$GLOBALS["item_name_register"] = "";
$GLOBALS["item_hash_register"] = "";

$GLOBALS["price_name_array"] = array();
$GLOBALS["price_array"] = array();

$GLOBALS["groupName"] = array();
$GLOBALS["itemHashN"] = array();
$GLOBALS["itemName"] = array();
$GLOBALS["itemWeight"] = array();
$GLOBALS["itemLength"] = array();
$GLOBALS["itemKf"] = array();
$GLOBALS["itemHash"] = array();
$GLOBALS["itemEd"] = array();

function webi_xml($file)
{

    ####################################################
    ### функция работы с данными
    function data ($parser, $data)
    {
        $reg_data = str_replace(" ", "", $data);
        $reg_data = str_replace("\n", "", $reg_data);
        if($reg_data!=""){
            if($GLOBALS["name_register"]=="НаименованиеГруппы"){
                echo '<ul id="'.$data.'" class="level'.$GLOBALS["depth_level"].' group">
                <li class="UlName level'.$GLOBALS["depth_level"].'">
                    <span><strong>'.$data.'</strong></span>
                </li>
                <ul class="groupHolder">';
                $GLOBALS["item_name_register"] = $data;
            } else if($GLOBALS["name_register"]=="НаименованиеПредмета"){
                echo '<ul id="'.htmlspecialchars($data).'" >
                    <li class="UlName level'.$GLOBALS["depth_level"].' itemGroup">
                        <span><strong>'.$data.'</strong></span>
                    </li>';

            }
            if($GLOBALS["name_register"]=="НоменклатураСсылка"){
                $GLOBALS["item_hash_register"] = $data;
            } 
            if($GLOBALS["name_register"]=="ФлагНоменклатуры"){
                if($data=='1'){
                    echo '<ul class="groupHolder">
                <table>';
                }
            }
            if($GLOBALS["name_register"]=="Предмет"){
                
                $GLOBALS["groupName"][] = $GLOBALS["item_name_register"];
                $GLOBALS["itemHashN"][] = $GLOBALS["item_hash_register"];
                
            } 
            if($GLOBALS["name_register"]=="Характеристика"){
                $GLOBALS["itemName"][] = $data;
                
            } 
            if($GLOBALS["name_register"]=="Вес"){
                
                $GLOBALS["itemWeight"][] = $data;
                
            } 
            if($GLOBALS["name_register"]=="Кратность"){
                $GLOBALS["itemLength"][] = $data;
            } 
            if($GLOBALS["name_register"]=="Коэффициент"){
                $GLOBALS["itemKf"][] = $data;
            } 
            if($GLOBALS["name_register"]=="ХарактеристикаСсылка"){
                $GLOBALS["itemHash"][] = $data;
            } 
            if($GLOBALS["name_register"]=="ЕдИзмерения"){
                $GLOBALS["itemEd"][] = $data;
            } 
            if($GLOBALS["name_register"]=="Цена"){
                $GLOBALS["price_array"][] = $data;
            } 
            if($GLOBALS["name_register"]=="НазваниеЦены"){
                $GLOBALS["price_name_array"][] = $data;
            }
        }
        
        // print_r($data);
    }
    ############################################


    ####################################################
    ### функция открывающих тегов
    function startElement($parser, $name, $attrs)
    {
        // print_r($name);

        if($name=="Группа"){
            if($GLOBALS["name_register"]=="НаименованиеГруппы"){
                $GLOBALS["name_register"] = $name;
            } else {
                $GLOBALS["name_register"] = "НаименованиеПредмета";
            }
            
            $GLOBALS["depth_level"]++;
        } else {
            $GLOBALS["name_register"] = $name;
        }
    }
    ###############################################

    ###############################################
    ### функция создание предмета
    function createPriceItem(){
        $ral = array();
        $rkey = '';
        //$ral = array();
        //$pattern = 'RAL\s\d\d\d\d';
        //$pattern = 'RAL 6002';

        $GLOBALS["itemHashN"][] = $GLOBALS["item_hash_register"];

        print_r($GLOBALS["item_hash_register"]);
        
        $itemPrice = $GLOBALS["price_array"];
        $groupName = $GLOBALS["item_name_register"];

        $groupName = str_replace("  ", " ", $groupName);
        $groupName = str_replace("\"", "", $groupName);

        $ral = explode('RAL ', $groupName);
        if(isset($ral[1])){
            $rkey = $ral[1];
            $ralColor = '<div style="width:60px;height:15px;background-color:'.getRAL($rkey).';border:1px solid black;float:right">'.' '.'</div>';
        } else {
            $ralColor= '';
        }
        //$ralColor = '<div style="width:60px;height:15px;background-color:'.$ralArray['RAL 6002'].'">'.$ral.'</div>';
        if(isset($_GET["ref"])){
            if(rawurldecode($_GET["ref"]) == $groupName." ".$GLOBALS["itemName"][0]){

                echo "<tr class='item' name='".$groupName." ".$GLOBALS["itemName"][0]."' id='list ".$groupName." ".$GLOBALS["itemName"][0]."' itemscope itemtype=\"http://schema.org/Product\">
                    <td class='iName'>                       
                        <span itemprop=\"name\">".$groupName.'</span> '.$ralColor."</td>"; 
                echo '<td itemprop="model">'.$GLOBALS["itemName"][0].'</td>';
                $rflag = 1;
            } else {
                echo "<tr class='item' name='".$groupName." ".$GLOBALS["itemName"][0]."' id='list ".$groupName." ".$GLOBALS["itemName"][0]."'>
                    <td class='iName'>
                        <span>".$groupName.'</span> '.$ralColor."</td>"; 
                echo '<td>'.$GLOBALS["itemName"][0].'</td>';
                $rflag = 0;
            }
        } else {
            echo "<tr class='item' name='".$groupName." ".$GLOBALS["itemName"][0]."' id='list ".$groupName." ".$GLOBALS["itemName"][0]."' itemscope itemtype=\"http://schema.org/Product\">
                <td class='iName'>
                    <span itemprop=\"name\">".$groupName.'</span> '.$ralColor."</td>"; 
            echo '<td itemprop="model">'.$GLOBALS["itemName"][0].'</td>';
            $rflag = 1;
        }
         
        $ik = 0;
        $hollow = 0;

        foreach($itemPrice as $price){
            echo getPrice($price, $GLOBALS["itemWeight"][0], $GLOBALS["itemLength"][0], $GLOBALS["itemKf"][0], $ik, $rflag, $hollow);
            $ik++;
        }
        echo '</tr>';
    }
    #################################################

    ###############################################
    function getPrice($TNPrice, $weight, $length, $iKf, $ik, $rflag, $n){
        setlocale(LC_MONETARY, 'ru_RU');
        
        //$TN = bigRound(($basePrice/(1-($kf/100))));
        $TN = $TNPrice;
        $PC = (round(($TN/1000)*round($weight*$length)*$iKf*100)/100);

        if($length==0 || $iKf==0){
            $PC = '-';
            $PM = '-';
        } else {
            $PM = (round(($PC/($length))*$iKf*100)/100);
        }

        if($hollow==0){

            if($ik=='3'){
                if($rflag==1){
                    $prices = "<td class='itemPrice itemTN ".$ik."' itemprop=\"offers\" itemscope itemtype=\"http://schema.org/Offer\">
                            <span class='sP' itemprop=\"price\">".$TN."</span>
                            <meta itemprop=\"priceCurrency\" content=\"RUB\" />
                            <span style='display:none;' itemprop=\"availability\" href=\"http://schema.org/InStock\">В наличии</span>
                            <div style='display:none' itemprop=\"seller\" itemscope itemtype=\"http://schema.org/Organization\">
                                <span itemprop=\"name\">Тримет ООО</span>
                                <div itemprop=\"address\" itemscope itemtype=\"http://schema.org/PostalAddress\">
                                    <span itemprop=\"streetAddress\">ул. Республики, 278 а, строение 1</span>
                                    <span itemprop=\"postalCode\">625014</span>
                                    <span itemprop=\"addressLocality\">Тюмень, Россия</span> 
                                </div>
                                <span itemprop=\"telephone\">+7 (3452) 520-670</span>
                            </div></td>";
                } else {
                    $prices = "<td class='itemPrice itemTN ".$ik."'><span class='sP'>".$TN."</span></td>";
                }
                
            } else {
                $prices = "<td class='itemPrice itemTN ".$ik."'><span class='sP'>".$TN."</span></td>";
            }
            if($PC!='-'){
                $prices .= "<td class='itemPrice itemPC_hid'>".$PC."</td>";
            } else {
                $prices .= "<td class='itemPrice itemPC_hid'>-</td>";
            }
            if($PM!='-'){
                $prices .= "<td class='itemPrice itemPM_hid'>".$PM."</td>";
            } else {
                $prices .= "<td class='itemPrice itemPM_hid'>-</td>";
            }
        } else {
            if($ik=='2'){
                if($rflag==1){
                    $prices = "<td class='itemPrice itemTN ".$ik."' itemprop=\"offers\" itemscope itemtype=\"http://schema.org/Offer\">
                            <span class='sP' itemprop=\"price\">".$TN."</span>
                            <meta itemprop=\"priceCurrency\" content=\"RUB\" />
                            <span style='display:none;' itemprop=\"availability\" href=\"http://schema.org/InStock\">В наличии</span>
                            <div style='display:none' itemprop=\"seller\" itemscope itemtype=\"http://schema.org/Organization\">
                                <span itemprop=\"name\">Тримет ООО</span>
                                <div itemprop=\"address\" itemscope itemtype=\"http://schema.org/PostalAddress\">
                                    <span itemprop=\"streetAddress\">ул. Республики, 278 а, строение 1</span>
                                    <span itemprop=\"postalCode\">625014</span>
                                    <span itemprop=\"addressLocality\">Тюмень, Россия</span> 
                                </div>
                                <span itemprop=\"telephone\">+7 (3452) 520-670</span>
                            </div></td>";
                } else {
                    $prices = "<td class='itemPrice itemTN ".$ik."'><span class='sP'>".$TN."</span></td>";
                }
                
            } else {
                $prices = "<td class='itemPrice itemTN ".$ik."'><span class='sP'>".$TN."</span></td>";
            }
            if($PC!='-'){
                $prices .= "<td class='itemPrice itemPC_hid'>".$PC."</td>";
            } else {
                $prices .= "<td class='itemPrice itemPC_hid'>-</td>";
            }
            if($PM!='-'){
                $prices .= "<td class='itemPrice itemPM_hid'>".$PM."</td>";
            } else {
                $prices .= "<td class='itemPrice itemPM_hid'>-</td>";
            }
        }


        return $prices;
    }
    ###############################################

    #################################################
    ## функция закрывающих тегов
    function endElement($parser, $name)
    {
        // print_r($name);

        if($name=="Группа"){
            
            $GLOBALS["depth_level"]--;

            if( $GLOBALS["name_register"]=="itemEnd"){
                echo "</table></ul>";
            }

            echo "</ul></ul>";
        } else if($name=="НаименованиеГруппы") {
            $GLOBALS["name_register"] = "";
        } else if($name=="Предмет") {
            $GLOBALS["name_register"] = "itemEnd";

            // print_r($GLOBALS);

            createPriceItem();


            $GLOBALS["groupName"] = array();
            $GLOBALS["itemHashN"] = array();
            $GLOBALS["itemName"] = array();
            $GLOBALS["itemWeight"] = array();
            $GLOBALS["itemLength"] = array();
            $GLOBALS["itemKf"] = array();
            $GLOBALS["itemHash"] = array();
            $GLOBALS["itemEd"] = array();
            $GLOBALS["price_name_array"] = array();
            $GLOBALS["price_array"] = array();

            // echo '</table>';
        } 
    }
    ############################################


    $xml_parser = xml_parser_create();
    xml_parser_set_option($xml_parser, XML_OPTION_CASE_FOLDING, true);

    // указываем какие функции будут работать при открытии и закрытии тегов
    xml_set_element_handler($xml_parser, "startElement", "endElement");

    // указываем функцию для работы с данными
    xml_set_character_data_handler($xml_parser,"data");

    $GLOBALS['content'] = "";
    // открываем файл
    $fp = fopen($file, "r");

    $perviy_vxod=1; // флаг для проверки первого входа в файл
    $data="";  // сюда собираем частями данные из файла и отправляем в разборщик xml

    // цикл пока не найден конец файла
    while (!feof ($fp) and $fp)
    {

        $simvol = fgetc($fp); // читаем один символ из файла
        $data.=$simvol; // добавляем этот символ к данным для отправки

        // если символ не завершающий тег, то вернемся к началу цикла и добавим еще один символ к данным, и так до тех пор, пока не будет найден закрывающий тег
        if($simvol!='>') { continue;}
        // если закрывающий тег был найден, теперь отправим эти собранные данные в обработку

        // проверяем, если это первый вход в файл, то удалим все, что находится до тега <?
        // так как иногда может встретиться мусор до начала XML (корявые редакторы, либо файл получен скриптом с другого сервера)
        if($perviy_vxod) {$data=strstr($data, '<?'); $perviy_vxod=0;}


        // теперь кидаем данные в разборщик xml
        if (!xml_parse($xml_parser, $data, feof($fp))) {

            // здесь можно обработать и получить ошибки на валидность...
            // как только встретится ошибка, разбор прекращается
            echo "<br>XML Error: ".xml_error_string(xml_get_error_code($xml_parser));
            echo " at line /".xml_get_current_line_number($xml_parser);
            break;
        }

        // после разбора скидываем собранные данные для следующего шага цикла.
        $data="";
    }
    fclose($fp);
    xml_parser_free($xml_parser);

    // echo $GLOBALS['content'];
    print_r($GLOBALS['gArrayPointer']);

}

echo '<ul id="ПрайсЛист">';

webi_xml('price.xml');

echo '</ul>';

?>