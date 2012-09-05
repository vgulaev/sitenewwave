<?php

setlocale(LC_ALL, "ru_RU.UTF-8");

function my_dbConnect(){
    $dbCon = mysql_connect('localhost','trimetru_goods','&rUI24*(^o') OR DIE("Не могу создать соединение ");

    mysql_select_db('trimetru_goods') or die(mysql_error());
    mysql_query('SET NAMES utf8');

    return $dbCon;
}

function qr($iName, $pHash, $cName, $weight, $length, $kf, $iHash, $edIzm, $price, $priceType, $groupSecondName, $itemHashN, $inStock){

    $dbCon = my_dbConnect();

    $query2 = "INSERT INTO `trimetru_goods`.`offers` (`id`, `name`, `hash`, `parent_hash`, `display_name`, `char_name`, `weight`, `length`, `kf`, `edIzm`, `price`, `price_type`, `father_hash`, `stock`)
VALUES ('null','".mysql_escape_string($groupSecondName)." ".mysql_escape_string($cName)." ','".$iHash."','".$pHash."','".mysql_escape_string($iName)."','".mysql_escape_string($cName)."','".$weight."','".$length."','".$kf."','".$edIzm."','".mysql_escape_string($price)."','".mysql_escape_string($priceType)."','".$itemHashN."', '".$inStock."');";
    $result2 = mysql_query($query2, $dbCon);
    print_r($iName.' '.$cName.' : '.$result2.'<br />');
    //echo 'done<br />';
    //return mysql_insert_id();
}

function insertGroup($gName, $gHash, $pHash){

    $query = "INSERT INTO `trimetru_goods`.`groups` (`name`, `hash`, `parent_hash`)
VALUES ('".$gName."','".$gHash."','".$pHash."');";

    $result = mysql_query($query);

    //echo $result.'<br />';
    //return mysql_insert_id();
}

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
                
                $GLOBALS["item_name_register"] = $data;
                // if($GLOBALS["depth_level"]==1){
                //     echo $data;
                // }
            } 
            if($GLOBALS["name_register"]=="НоменклатураСсылка"){
            	if(strlen($data)>6){
            		$GLOBALS["item_hash_register"] = $data;
                    if($GLOBALS["depth_level"]==1){
                        $GLOBALS["item_p_hash"] = $data;
                    }
                    insertGroup($GLOBALS["item_name_register"], $GLOBALS["item_hash_register"], $GLOBALS["item_p_hash"]);
            	}
            } 
            if($GLOBALS["name_register"]=="ФлагНоменклатуры"){
                
            }
            if($GLOBALS["name_register"]=="Предмет"){
                
                $GLOBALS["groupName"][0] = $GLOBALS["item_name_register"];
                $GLOBALS["groupName"][1] = $GLOBALS["item_hash_register"];
                $GLOBALS["groupName"][2] = $GLOBALS["item_p_hash"];
                
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

                // $GLOBALS["price_array"][] = $data;
                $reg_data = str_replace(" ", "", $data);
        		$reg_data = str_replace("\n", "", $reg_data);
                $pattern = "/\w*\.*\d*/";
        		$reg_data = preg_replace($pattern, "", $reg_data);
                // echo " > ".strlen($reg_data)." | ".$data." < ";
                if(strlen($reg_data)==0){
                    $GLOBALS["price_array"][] = $data;
                }
                
            } 
            if($GLOBALS["name_register"]=="НазваниеЦены"){

                $reg_data = str_replace(" ", "", $data);
                $reg_data = str_replace("\n", "", $reg_data);
                $pattern = "/[\w\.\d\-F\А-Яа-я]*/u";
                $reg_data = preg_replace($pattern, "", $reg_data);
                // echo " > ".strlen($reg_data)." | ".$data." | ".$reg_data." < ";
                if(strlen($reg_data)==0){
                    $GLOBALS["price_name_array"][] = $data;
                }
            }
            if($GLOBALS["name_register"]=="ЕстьВНаличии"){
                $GLOBALS["in_stock"][] = $data;
            }
            if($GLOBALS["name_register"]=="Синоним"){
                $reg_data = str_replace(" ", "", $data);
                $reg_data = str_replace("\n", "", $reg_data);
                $pattern = "/[\w\.\,\(\\\\\\/\*\'\"\)\d\-А-Яа-я]*/u";
                $reg_data = preg_replace($pattern, "", $reg_data);
                // echo " > ".strlen($reg_data)." | ".$data." | ".$reg_data." < ";
                if(strlen($reg_data)==0){
                    $GLOBALS["second_name"][] = $data;
                }
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
    ### функция создания предмета
    function createPriceItem(){
        
        $groupName = $GLOBALS["groupName"][0];
        $pHash = $GLOBALS["groupName"][2];
        $itemName = $GLOBALS["itemName"][0];
        $itemWeight = $GLOBALS["itemWeight"][0];
        $itemLength = $GLOBALS["itemLength"][0];
        $itemKf = $GLOBALS["itemKf"][0];
        $itemHash = $GLOBALS["itemHash"][0];
        $itemEd = $GLOBALS["itemEd"][0];
        $priceDB = implode("|", $GLOBALS["price_array"]);
        $priceType = implode("|", $GLOBALS["price_name_array"]);
        $groupSecondName = $GLOBALS["second_name"][0];
        $itemHashN = $GLOBALS["groupName"][1];
        $inStock = $GLOBALS["in_stock"][0];

        // echo "|| ".$groupName.", ".$pHash.", ".$itemName.", ".$itemWeight.", ".$itemLength.", ".$itemKf.", ".$itemHash.", ".$itemEd.", ".$priceDB.", ".$priceType.", ".$groupSecondName.", ".$itemHashN.", ".$inStock."<br />";

        qr($groupName, $pHash, $itemName, $itemWeight, $itemLength, $itemKf, $itemHash, $itemEd, $priceDB, $priceType, $groupSecondName, $itemHashN, $inStock);
    }
    #################################################

    #################################################
    ### функция создания предмета типа профнастила
    function createPriceItemHollow(){
        
        $groupName = $GLOBALS["item_name_register"];
        $itemName = 'кастом';
        $itemWeight = $GLOBALS["itemWeight"][0];
        $itemLength = $GLOBALS["itemLength"][0];
        $itemKf = $GLOBALS["itemKf"][0];
        $itemEd = $GLOBALS["itemEd"][0];

        $groupSecondName = $GLOBALS["second_name"][0];
        
        $itemEd = $GLOBALS["itemEd"][0];
        
        $itemHash = $GLOBALS["item_hash_register"];
        $itemHashN = $GLOBALS["item_hash_register"];
        $pHash = $GLOBALS["item_p_hash"];
        $priceDB = implode("|", $GLOBALS["price_array"]);
        $priceType = implode("|", $GLOBALS["price_name_array"]);
        $inStock = 1;

        $groupName = str_replace("\"", "", $groupName);

        // echo "|| ".$groupName.", ".$pHash.", ".$itemName.", ".$itemWeight.", ".$itemLength.", ".$itemKf.", ".$itemHash.", ".$itemEd.", ".$priceDB.", ".$priceType.", ".$groupSecondName.", ".$itemHashN.", ".$inStock."<br />";

        qr($groupName, $pHash, $itemName, $itemWeight, $itemLength, $itemKf, "0", $itemEd, $priceDB, $priceType, $groupSecondName, $itemHash, $inStock);

    }
    #################################################

    #################################################
    ## функция закрывающих тегов
    function endElement($parser, $name)
    {
        // print_r($name);

        if($name=="Группа"){
            
            $GLOBALS["depth_level"]--;

            if(isset($GLOBALS["price_array"][0])){
                
                createPriceItemHollow();

            }
            
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
            $GLOBALS["second_name"] = array();
            $GLOBALS["in_stock"] = array();

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
            $GLOBALS["second_name"] = array();
            $GLOBALS["in_stock"] = array();

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
    // print_r($GLOBALS['gArrayPointer']);

}

my_dbConnect();

$query = "TRUNCATE TABLE `offers`";
mysql_query($query);

$query = "TRUNCATE TABLE `groups`";
mysql_query($query);

webi_xml('price.xml');



?>