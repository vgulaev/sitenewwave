function htmlspecialchars_decode(string, quote_style) {  

    string = string.toString();  
      
    // Always encode  
    string = string.replace('/&/g', '&');  
    string = string.replace('/</g', '<');  
    string = string.replace('/>/g', '>');  
      
    // Encode depending on quote_style  
    if (quote_style == 'ENT_QUOTES') {  
        string = string.replace('/"/g', '"');  
        string = string.replace("/'/g", '\'');  
    } else if (quote_style != 'ENT_NOQUOTES') {  
        // All other cases (ENT_COMPAT, default, but not ENT_NOQUOTES)  
        string = string.replace('/"/g', '"');  
    }  
      
    return string;  
}  

$(function(){

    $("#closeBasket").click( function () {
        $('#basketDiv').hide()
        $('#pTableContentTab').show()
        $('#showPriceSpan').hide()
        $('#showBasketSpan').show()
    })
    
    $("#tabBasket").click( function () {

        $('#pTableContentTab').hide()
        $('#basketDiv').show()
        $('#showBasketSpan').hide()
        $('#showPriceSpan').show()
    })
    $("#tabPrice").click( function () {

        $('#basketDiv').hide()
        $('#pTableContentTab').show()
        $('#showPriceSpan').hide()
        $('#showBasketSpan').show()
    }) 

    $("#switchOrderDiv").click( function(){
        $("#orderDiv").show()
        $("#deliveryDiv").hide()
        $("#notificationDiv").hide()
        $("#switchOrderDiv").removeClass("inactiveDiv").addClass("activeDiv")
        $("#switchDeliveryDiv").removeClass("activeDiv").addClass("inactiveDiv")
        $("#switchNotificationDiv").removeClass("activeDiv").addClass("inactiveDiv")
    })
    $("#switchDeliveryDiv").click( function(){
        $("#deliveryDiv").show()
        $("#orderDiv").hide()
        $("#notificationDiv").hide()
        $("#switchDeliveryDiv").removeClass("inactiveDiv").addClass("activeDiv")
        $("#switchOrderDiv").removeClass("activeDiv").addClass("inactiveDiv")
        $("#switchNotificationDiv").removeClass("activeDiv").addClass("inactiveDiv")
    })
    $("#switchNotificationDiv").click( function(){
        $("#notificationDiv").show()
        $("#deliveryDiv").hide()
        $("#orderDiv").hide()
        $("#switchNotificationDiv").removeClass("inactiveDiv").addClass("activeDiv")
        $("#switchDeliveryDiv").removeClass("activeDiv").addClass("inactiveDiv")
        $("#switchOrderDiv").removeClass("activeDiv").addClass("inactiveDiv")
    })

                
});

function searchItem2(item){
    var squery = item.replace(/%2F/g, "/")
    var squery = squery.replace(/\s\s/g, " ")
    var squery = squery.replace(/%2C/g, ",")
    var squery = squery.replace(/\.com/, '')
    $("#itemName").attr('value', squery)
    $(".buySpan").find("a").attr("style", "text-shadow: black 0 0 2px;float:right;color:#ffe06f;")
    //$("#itemName").change()
}

function showGroup2(groupName){
    $("#itemName").attr('value', groupName)
    $("#itemName").change()
}

function openLink(linkUID,type){
    $.ajax({
        type: "POST",
        url: "getfilelink.php",
        async: false,
        data: "linkUID="+linkUID+"&type="+type+"",
        success: function(html){
            //var success = 'true';
            window.location.href = html
            // alert(html)
        }
    });
}

function getItemChar(hash){
    ret = ''
    $.ajax({
        type: "POST",
        url: "getItemChar.php",
        async: false,
        data: "item_hash="+hash,
        success: function(html){
            ret = html
            return ret
        }
    });
    return ret
}

function setModalWeight(){
    if($(".itemPWeightInput").attr("value")!=undefined){
        father = $(".itemPWeightInput").parent().parent()
        cW = $(".itemPWeightInput").attr("value")
        

        var pricesArray = $(".TNPrice").attr("name").split('|');

        var wAll = $(".itemPWeightInput").attr('value') - 0
        //var edIzm = $(".popUpTab").attr("name")

        if( wAll<2 ){
            k = 0
        } else if( wAll>=2 && wAll <8) {
            k = 1
        } else if( wAll>=8 && wAll <15) {
            k = 2
        } else if( wAll>=15) {
            k = 3
        }
        

        TN = pricesArray[k]
        $(".TNPrice").html(TN)
        var itemKf = $(".itemPCountInput").attr("name")
        var itemLength = $(".itemPLengthInput").attr("name")
        var itemWeight =  $(".itemPWeightInput").attr("name")
        if(itemLength!=0){
            //alert(itemWeight*itemLength)
            var PC = Math.round((TN/1000)*Math.round(itemWeight*itemLength*1000)*itemKf*100)/100;
            var PM = Math.round((PC/(itemLength))*itemKf*100)/100;
        } else {
            var PC = '--'
            var PM = '--'
        }
        $(".PCPrice").html(PC)
        $(".PMPrice").html(PM)
    }
}

function setModalLength(){

    
    cKr = $(".itemPLengthInput").attr("value")
    father = $(".itemPLengthInput").parent().parent()

    
    //alert($(".TNPrice").attr("name"))
    var pricesArray = $(".TNPrice").attr("name").split('|');

    var wAll = $(".itemPLengthInput").attr('value') - 0
    //var edZim = $(".popUpTab").attr("name")

    if( wAll<100 ){
        k = 0
    } else if( wAll>=100 && wAll <200) {
        k = 1
    } else if( wAll>=200) {
        k = 2
    } 
    
    TN = pricesArray[k]
    $(".TNPrice").html(TN)
    var itemKf = $(".itemPCountInput").attr("name")
    var itemLength = $(".itemPCharInput").attr("value")

    if(itemLength!=0){
        //alert(itemWeight*itemLength)
        var PC = Math.round(TN*itemLength*100)/100;
        
    } else {
        var PC = '--'
    }

    var itemSM = $(".SMPrice").attr("name") - 0

    if(itemSM!=undefined){
        var SM = Math.round(TN/itemSM*100)/100;
        $(".SMPrice").html( SM )
    }

    $(".pPCPrice").html(PC)
}

function showModalItem(hash, edIzm, prices){
    var mesDiv = '';
    $('tr[id="'+hash+'"]').each(function(){

        var iC = getItemChar(hash)
        var iCArray = iC.split("|")
        var itemLength = iCArray[0]
        var itemWeight = iCArray[1] / 1000
        var itemKf = iCArray[2]

        var pricesArray = prices.split('|');

        TN = pricesArray[0]

        if(itemLength!=0){
            //alert(itemWeight*itemLength)
            var PC = Math.round((TN/1000)*Math.round(itemWeight*itemLength*1000)*itemKf*100)/100;
            var PM = Math.round((PC/(itemLength))*itemKf*100)/100;
        } else {
            
            var PC = '--'
            var PM = '--'

        }
        
        

        if(hash.split(':')[0]=='0'){

            dL = $(this).find(".itemName").attr("name")
            dL = dL.match(/\(.+\)/) + ""
            dL = dL.replace(/\(/, "")
            dL = dL.replace(/\)/, "")
            smK = dL.replace(/,/,".")
            dL = dL + " м"
            //alert(smK)
            SM = Math.round((TN-0)/(smK-0)*100)/100
            //alert(SM)
            mesDiv += '<div><p>'+$(this).find(".itemName").attr("name")+' '+$(this).find(".itemChar").attr("name")+'</p>';
            mesDiv += '<div id="slider-vertical"></div>';
            mesDiv += '<img src="profnastilSample.gif" />'
            mesDiv += '<div style="margin-left:30px;">'+dL+'</div>'
            mesDiv += '<table class="popUpTab" name="'+edIzm+'"><tr><td>Цена за пог. метр:</td><td class="TNPrice" name="'+prices+'">'+TN+'</td></tr>';
            mesDiv += '<tr><td>за кв. метр:</td><td class="SMPrice" name="'+smK+'">'+SM+'</td></tr>';
            mesDiv += '<tr><td>за штуку:</td><td class="pPCPrice">'+TN+'</td></tr>';
            mesDiv += '</table>';
            mesDiv += '<span class="popUpInnerSpan"><input class="pUi itemPLengthInput" value="0" name="2" /> погонный метр это ';
            mesDiv += '<input class="pUi itemPCountInput" name="'+itemKf+'" value="0" /> ';


            mesDiv += 'штук по <input class="pUi itemPCharInput" id="amount" value="2"> метра ';
            mesDiv += 'общей площадью <input class="pUi itemSQuareInput" name="'+smK+'" /> квадратных метров.';

            mesDiv += '<div><span class="popUpCancel"><a href="Выбрать другой товар" onClick="$.unblockUI(); return false">Отменить</a></span>';
            mesDiv += '<span class="popUpContinue"><a href="Добавить в корзину" onClick="modern_addItem(\''+hash+'\',\''+edIzm+'\',\''+prices+'\'); return false">Добавить</a></span></div>';
            mesDiv += '</div>';

            $.blockUI.defaults.css.borderRadius = '10px'; //убираем серую границу
            $.blockUI.defaults.fadeIn = 100;  //ускоряем появление
            $.blockUI.defaults.fadeOut = 100; //и исчезновение
            //$.blockUI.defaults.css.left = '39%'; //окно будет в центре
            $.blockUI.defaults.css.backgroundColor = 'white'
            $.blockUI.defaults.css.cursor = 'defaults'
            $.blockUI.defaults.css.boxShadow = '0px 0px 5px 5px rgb(207, 207, 207)'
            $.blockUI.defaults.css.fontSize = '14px'
            $.blockUI.defaults.css.width = '400px'
            $.blockUI.defaults.css.height = '320px'
            $.blockUI.defaults.css.paddingTop = '10px'


        } else {
            mesDiv += '<div><p>'+$(this).find(".itemName").attr("name")+' '+$(this).find(".itemChar").attr("name")+'</p>';
            mesDiv += '<table class="popUpTab" name="'+edIzm+'"><tr><td>Цена за тонну:</td><td class="TNPrice" name="'+prices+'">'+TN+'</td></tr>';
            mesDiv += '<tr><td>за штуку:</td><td class="PCPrice">'+PC+'</td></tr>';
            mesDiv += '<tr><td>за метр:</td><td class="PMPrice">'+PM+'</td></tr></table>';
            mesDiv += '<span class="popUpInnerSpan"><input class="pUi itemPWeightInput" value="0" name="'+itemWeight+'" /> тонн это ';
            mesDiv += '<input class="pUi itemPCountInput" name="'+itemKf+'" value="0" /> ';


            mesDiv += 'штук по '+$(this).find(".itemChar").attr("name")+' метра, общей длинной ';
            mesDiv += '<input class="pUi itemPLengthInput" value="0" name="'+itemLength+'" /> метра</span>';

            mesDiv += '<div><span class="popUpCancel"><a href="Выбрать другой товар" onClick="$.unblockUI(); return false">Отменить</a></span>';
            mesDiv += '<span class="popUpContinue"><a href="Добавить в корзину" onClick="modern_addItem(\''+hash+'\',\''+edIzm+'\',\''+prices+'\'); return false">Добавить</a></span></div>';
            mesDiv += '</div>';

            $.blockUI.defaults.css.borderRadius = '10px'; //убираем серую границу
            $.blockUI.defaults.fadeIn = 100;  //ускоряем появление
            $.blockUI.defaults.fadeOut = 100; //и исчезновение
            //$.blockUI.defaults.css.left = '39%'; //окно будет в центре
            $.blockUI.defaults.css.backgroundColor = 'white'
            $.blockUI.defaults.css.cursor = 'defaults'
            $.blockUI.defaults.css.boxShadow = '0px 0px 5px 5px rgb(207, 207, 207)'
            $.blockUI.defaults.css.fontSize = '14px'
            $.blockUI.defaults.css.width = '400px'
            $.blockUI.defaults.css.height = '220px'
            $.blockUI.defaults.css.paddingTop = '10px'
        }

    })

    

    $.blockUI({ message: mesDiv});

    $(function() {
        $( "#slider-vertical" ).slider({
            orientation: "vertical",
            range: "max",
            min: 0.2,
            max: 6,
            value: 2,
            step: 0.1,
            slide: function( event, ui ) {
                $( "#amount" ).val( ui.value );
                $("#amount").change()
            }
        });
        $( "#amount" ).val( $( "#slider-vertical" ).slider( "value" ) );
        
    });


    $(".itemPCharInput").change(function(){
        ch = this.value
        ch = ch.replace(/,/, ".")
        ch = ch.match(/\d+\.\d{0,2}|\d+/)
        if((ch-0)<0.2){
            //alert(1)
            ch = 0.2
        } else if((ch-0)>6){
            //alert(2)
            ch = 6
        } else {
            ch = ch
        }
        $(".itemPCharInput").attr("value", ch)
        father = $(this).parent().parent()
        $(father).find($(".itemPLengthInput")).attr("name", ch)

        var nL = this.value.length*10
            nL = nL + "px"
            //alert(nL)
            $(this).css("width", nL);

        //father.find($(".itemPCountInput")).change();
        father.find($(".itemPLengthInput")).change();
    })

    $(".itemPCountInput").change(function() {
        num = this.value
        //num = num.match(/\d+/)
        father = $(this).parent().parent()
        if(num != '--'){
            var div = num%1
            if (div!=0){
                num = ((num-num%1)+1)
            } else {
                num = num
            }            
            //var father; 
            var wN;
            var krN;

            $('.itemPCountInput').attr('value',num)
            //alert(this.value.length + " | " + this.size + " | " + $(this).css("width").replace(/px/, "")-0)
            
            var nL = this.value.length*10
            nL = nL + "px"
            //alert(nL)
            $(this).css("width", nL); 
            
            if(father.find($(".itemPLengthInput")).attr('name')!=0){
                wN = num * father.find($(".itemPWeightInput")).attr('name') * father.find($(".itemPLengthInput")).attr('name')
                krN = num * father.find($(".itemPLengthInput")).attr('name')
                var oldWn =  father.find($(".itemPWeightInput")).attr('value')
                father.find($(".itemPWeightInput")).attr('value',(wN).toFixed(3))  
                father.find($(".itemPLengthInput")).attr('value',(krN).toFixed(2))
                father.find($(".itemSQuareInput")).attr('value',((krN).toFixed(2)*($(".itemSQuareInput").attr('name')-0)).toFixed(3))
                setModalWeight()
                setModalLength()
                
            } else {
                father.find($(".itemPCountInput")).attr('value','--')
                father.find($(".itemPLengthInput")).attr('value','--')
                father.find($(".itemPWeightInput")).attr('value',(wN).toFixed(3))
            
            }
        }
    })

    $(".itemSQuareInput").change(function(){
        var nL = this.value.length*9 + 30
        nL = nL + "px"
        //alert(nL)
        $(this).css("width", nL);

        sQ = this.value
        sQ = sQ.replace(/,/,".")
        sQ = sQ.match(/\d+\.\d{0,3}|\d+/)

        $(this).attr("value", sQ)

        var father;
        father = $(this).parent().parent()

        var cLength = ($(this).attr("value")-0) / ($(this).attr("name")-0)
        
        father.find($(".itemPLengthInput")).attr('value',cLength)
        father.find($(".itemPLengthInput")).change();
    })

    $(".itemPWeightInput").change(function() {
       // wAll = 0
       // sAll = 0
        var nL = this.value.length*9 + 30
        nL = nL + "px"
        //alert(nL)
        $(this).css("width", nL);

        cW = this.value
        cW = cW.replace(/,/, ".")
        cW = cW.match(/\d+\.\d{0,3}|\d+/)
        
        $(this).attr("value", cW)
        
   
        var father;
        father = $(this).parent().parent()
        
        weightName = father.find($(".itemPWeightInput")).attr('name')
        
        if(weightName!=0){
            num = cW/(father.find($(".itemPWeightInput")).attr('name') * father.find($(".itemPLengthInput")).attr('name'))
            father.find($(".itemPCountInput")).attr('value',num)
            father.find($(".itemPCountInput")).change();
            setModalWeight()
            
        } else {
            father.find($(".itemPCountInput")).attr('value','--')
            father.find($(".itemPLengthInput")).attr('value','--')
            father.find($(".itemPCountInput")).change();
        
        }
        
        
    })
    
    $(".itemPLengthInput").change(function() {
       // wAll = 0
       // sAll = 0
        var nL = this.value.length*9 + 20
        nL = nL + "px"
            //alert(nL)
        $(this).css("width", nL);

        cKr = this.value
        cKr = cKr.replace(/,/, ".")
        cKr = cKr.match(/\d+\.\d{0,2}|\d+/)
        
        
         
        
        var father;
        father = $(this).parent().parent()
        
        weightName = father.find($(".itemPLengthInput")).attr('name')
        
        if(weightName!=0){
            num = cKr/father.find($(".itemPLengthInput")).attr('name')
            father.find($(".itemPCountInput")).attr('value',num)
            father.find($(".itemPCountInput")).change();

            setModalLength()

        } else {
            father.find($(".itemPCountInput")).attr('value','--')
            father.find($(".itemPLengthInput")).attr('value','--')
            father.find($(".itemPCountInput")).change();
        }
        
    })

    $(".itemPCountInput").keyup( function(){
        var nL = this.value.length*10
            nL = nL + "px"
            //alert(nL)
            $(this).css("width", nL);
    })

    $(".itemPWeightInput").keyup( function(){
        var nL = this.value.length*10
            nL = nL + "px"
            //alert(nL)
            $(this).css("width", nL);
    })

    $(".itemPLengthInput").keyup( function(){
        var nL = this.value.length*10
            nL = nL + "px"
            //alert(nL)
            $(this).css("width", nL);
    })

}

function modern_addItem(hash, edIzm, prices){
    weight = $(".itemPWeightInput").attr("value")
    $.unblockUI()

    var cell = "<tr class='itemTr' name='"+hash+"'><td></td>";
    $('tr[id="'+hash+'"]').each(function(){
        cell += "<td class='itemNameTd'>"+$(this).find(".itemName").attr("name")+"</td>";
        cell += "<td class='itemCharTd'>"+$(this).find(".itemChar").attr("name")+"</td>";
        cell += "<td class='itemCountTd'><input class='itemCountInput' type='textarea' value='"+weight+"' /></td>";
        cell += "<td class='itemEdIzmTd' name='"+edIzm+"'>"+edIzm+"</td>";
        cell += "<td class='itemPriceTd' name='"+prices+"'></td>";
        cell += "<td class='itemNdsKfTd'>18%</td>";
        cell += "<td class='itemNdsSumTd'></td>";
        cell += "<td class='itemSumTd'></td>";
    })
    newRow = cell+'</tr>';

    var bCount = $('span.basketCount').html();
    bCount = (bCount - 0)+1;
    $('span.basketCount').html(bCount);  

    $('tbody#lItemTab').prepend(newRow);

    $('tbody#lItemTab tr').each(function(i) {
        var number = i + 1;
        $(this).find('td:first').text(number);
    });

    $(".itemCountInput").change()

    $(".itemCountInput").change(function() {

        var father =  $(this).parent().parent();

        wAll = 0
        $(".itemCountInput").each( function(){
            if($(this).parent().parent().find('td.itemEdIzmTd').attr('name')=='т'){
                wAll = (wAll + (this.value-0))
            }   
        
        });

        if(edIzm=='т'){
            if( wAll<2 ){
                k = 0
            } else if( wAll>=2 && wAll <8) {
                k = 1
            } else if( wAll>=8 && wAll <15) {
                k = 2
            } else if( wAll>=15) {
                k = 3
            }
        } else {
            if( wAll<100 ){
                k = 0
            } else if( wAll>=100 && wAll <200) {
                k = 1
            } else if( wAll>=200) {
                k = 2
            } 
        }

        sAll = 0
        cAll = 0

        $(".itemPriceTd").each( function(){
            var father = $(this).parent();
            var pricesArray = $(father).find(".itemPriceTd").attr("name").split('|');
            var count = $(father).find(".itemCountInput").attr("value")

            $(father).find(".itemPriceTd").html(pricesArray[k]);

            var sum = ((pricesArray[k]-0)*count).toFixed(2)
            var nds = ((sum/118)*18).toFixed(2)

            hSum = sum.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ')+'.'+sum.split('.')[1]
            nds = nds.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ')+'.'+nds.split('.')[1]
            $(father).find(".itemSumTd").html(hSum)
            $(father).find(".itemNdsSumTd").html(nds)
        
            sAll = (sAll - 0) + (sum - 0)

            cAll = (cAll - 0) + (count - 0)

        })
        cAll = cAll.toFixed(3)
        //sAll = sAll.toFixed(2)
        

        $("#SumAll").attr("name",sAll)

        if($("#selfCarry").is(":checked")){
            sAll = sAll.toFixed(2)
        } else {
            if($("#delivery_cost").html()!=""){
                sAll = ((sAll-0) + ($("#delivery_cost").html().replace(/\s/g, "") - 0 )).toFixed(2)
            } else {
                sAll = sAll.toFixed(2)
            }
        }
        
        nAll = ((sAll/118)*18).toFixed(2)

        nAll = nAll.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ')+'.'+nAll.split('.')[1]
        sAll = sAll.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ')+'.'+sAll.split('.')[1]
        cAll = cAll.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ')+'.'+cAll.split('.')[1]
        
        $("#CountAll").empty()
        $("#CountAll").append(cAll)

        $("#SumAll").empty()
        $("#SumAll").append(sAll)
        
        $("#NDSAll").empty()
        $("#NDSAll").append(nAll)

    })
}

function sendOrder(orderString){
    if($('#selfCarry').is(':checked')==false){
        if($('#destination').attr('value')!="--"){   
            destination = $('input#destination').attr('value')
            delivery_cost = $("#delivery_cost").html()
        } else {    
            destination = ''
            delivery_cost = ''
        }
        if($('#sFormChecked').find('input:checked').attr('value')!="--"){
            carry = $('#sFormChecked').find('input:checked').attr('value')
        } else {
            carry = ''
        }
    } else {
        destination = ''
        carry = ''
        delivery_cost = ''
    }
    

    email = $('input#emailInput').attr('value')
        if(email!=''){
            if(isValidEmail(email)==false){
                alert('Проверьте правильность адреса электронной почты')
                return null
            }
        }      
    ret = ''
    $.ajax({
        type: "POST",
        url: "createOrder.php",
        async: false,
        data: "orderString="+orderString+"&carry="+carry+"&destination="+destination+"&email="+email+"&delivery_cost="+delivery_cost,
        success: function(html){
            //var success = 'true';
            ret = 'номер '+html
            return ret
        }
    });
    //alert(ret)
    return ret
}

function createOrder(){
    if($("#emailInput").attr("value")==""){
        $("#switchNotificationDiv").click()
        $("#emailInput").focus()
    } else {
        var sendRow = '';
        $('tr.itemTr').each( function(){

            if($(this).find('input.itemCharInput').length!=0){
                sendRow += ''+$(this).find('input.itemCharInput').attr('value')+':'+$(this).attr('name')+':-:'+$(this).find('input.itemCountInput').attr('value')+':'+$(this).find('.itemPriceTd').html()+';';
            } else {
                sendRow += ''+$(this).attr('name')+':-:'+$(this).find('input.itemCountInput').attr('value')+':'+$(this).find('.itemPriceTd').html()+';';
            }
      
        })
        var order = sendOrder(sendRow);
        $("#basketCaption").empty()

        var oA = order.split(",")
        $("#basketCaption").append("Заказ "+oA[0])

        $("#switchOrderDiv").click()

    }
    
}

function openLink(linkUID,type){
    $.ajax({
        type: "POST",
        url: "getfilelink.php",
        async: false,
        data: "linkUID="+linkUID+"&type="+type+"",
        success: function(html){
            //var success = 'true';
            window.location.href = html
            // alert(html)
        }
    });
}

function getOrderFomat(format){
    var sendRow = '';
    $('tr.itemTr').each( function(){

        if($(this).find('input.itemCharInput').length!=0){
            sendRow += ''+$(this).find('input.itemCharInput').attr('value')+':'+$(this).attr('name')+':-:'+$(this).find('input.itemCountnput').attr('value')+':'+$(this).find('.itemPriceTd').html()+';';
        } else {
            sendRow += ''+$(this).attr('name')+':-:'+$(this).find('input.itemCountInput').attr('value')+':'+$(this).find('.itemPriceTd').html()+';';
        }
  
  
    })
    var order = sendOrder(sendRow);
    var q = order.split(',')


    openLink(q[1],format)
}


$(document).ready( function(){

    if( ! $('#myCanvas').tagcanvas({
        textColour : '#242491',
        outlineColour : '#242491',
        outlineThickness : 1,
        maxSpeed : 0.03,
        depth : 0.75
    },'tags')) {
         // TagCanvas failed to load
        $('#myCanvasContainer').hide();
        $('#tags').hide();
    }

	// $("#itemName").focusin( function(){
	// 	$("#itemName").css("box-shadow", "0 0 5px 2px #ffe06f, 0px 1px 1px rgb(207, 207, 207) inset")
	// })
	// $("#itemName").focusout( function(){
	// 	$("#itemName").css("box-shadow", "0px 1px 1px rgb(207, 207, 207) inset")
	// })

	$("#itemName").focus();

	$("#showAll").click( function(){
		value = $("#itemName").attr('value')
		$.ajax({
	        type: "GET",
	        url: "getItems.php",
	        async: false,
	        data: "term="+encodeURIComponent(value)+"&show_all",
	        success: function(html){
	            $("#tableRes").empty()
				
				$(html).appendTo("#tableRes")
				$("#showAll").hide();
			}
        
    	});
	})
	
		
	tmOutId = 0

	$("#itemName").change(function () {

		value = $("#itemName").attr("value");
		$.ajax({
	        type: "GET",
	        url: "getItems.php",
	        async: false,
	        data: "term="+encodeURIComponent(value)+"",
	        success: function(html){
	            $("#tableRes").empty()
				
				$(html).appendTo("#tableRes")
                if($(".item").length>=1){
                    $("#myCanvasContainer").hide();
                    $("#tags").hide();
                } else {
                    $('#myCanvasContainer').show();
                }
				if($(".item").length==20){
					$("#showAll").show();
				} else {
					$("#showAll").hide();
				}
				
			}
        
    	});
		
	})

	$("#itemName").keyup( function () {
                
        keyEvent = this;
        window.clearTimeout(tmOutId);
        tmOutId = window.setTimeout(  
            function() {  
                $(keyEvent).change();  
            },  
            1000  
        );
    });

	var squery = String(document.location).replace(/\%2F/g, "\\")
    var squery = String(document.location).replace(/\s\s/g, "\s")
    if(squery.split("?",2)[1]){
        parts=squery.split("?",2)[1].split("&");
    GET={};
    for (i=0; i<parts.length; i++) {
            curr = parts[i].split('=');
            GET[curr[0]] = curr[1];
        }
        if(GET['ref']!=undefined){
            searchItem2(decodeURI(GET['ref']))
            $('#myCanvasContainer').hide();
            $('#tags').hide();
        }
        
        
        if(GET['catalog']!=undefined){
            showGroup2(decodeURI(GET['catalog']))
            $('#myCanvasContainer').hide();
            $('#tags').hide();
        }

        if(GET['linkUID']!=undefined){
            openLink(GET['linkUID'], GET['type'])
        }
    }

    townS = $('#townSelect option:selected').attr('value')
    
    $("#destination").autocomplete({
            source:"getStreet.php?town="+townS,
            delay:10,
            minChars:2,
            matchSubset:1,
            autoFill:false,
            matchContains:1,
            cacheLength:10,
            selectFirst:true,
            maxItemsToShow:10,
        });
    
    $("select").change(function () {
        
        townS = $('#townSelect option:selected').attr('value')
        $("#destination").autocomplete( "option", "source", "getStreet.php?town="+townS )
    })

    $("#townSelect").change( function(){
        if($("#townSelect :selected").val()!="72000001"){
            $("#carry [value='Длинномер']").attr("selected", "selected")
            $("#carry").attr("disabled", "disabled")

            $("#delivery_cost").empty()
            var d_price = $("#townSelect :selected").attr("price")
            if($("#selfCarry").is(":checked")==false){
                var totalCost = $("#SumAll").attr("name")
                totalCost = ((totalCost-0)+(d_price-0)).toFixed(2)
                totalCost = totalCost.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ')+'.'+totalCost.split('.')[1]
                $("#SumAll").empty()
                $("#SumAll").append(totalCost)
            }
            d_price = (d_price-0).toFixed(2)
            d_price = d_price.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ')+'.'+d_price.split('.')[1]
            $("#delivery_cost").append(d_price)

        } else if ($("#townSelect :selected").val()=="72000001") {
            $("#carry").removeAttr("disabled")

            if($("#carry :selected").val()=="--"){
                $("#carry [value='Газель']").attr("selected", "selected")
            }

            $("#delivery_cost").empty()
            var d_price = $("#carry :selected").attr("price")
            if($("#selfCarry").is(":checked")==false){
                var totalCost = $("#SumAll").attr("name")
                totalCost = ((totalCost-0)+(d_price-0)).toFixed(2)
                totalCost = totalCost.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ')+'.'+totalCost.split('.')[1]
                $("#SumAll").empty()
                $("#SumAll").append(totalCost)
            }
            d_price = (d_price-0).toFixed(2)
            d_price = d_price.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ')+'.'+d_price.split('.')[1]
            $("#delivery_cost").append(d_price)

             
        }
        $("#destination").attr('value', '');
    })
    $("#carry").change( function(){
        if($("#townSelect :selected").val()=="72000001"){
            $("#delivery_cost").empty()
            var d_price = $("#carry :selected").attr("price")
            if($("#selfCarry").is(":checked")==false){
                var totalCost = $("#SumAll").attr("name")
                totalCost = ((totalCost-0)+(d_price-0)).toFixed(2)
                nAll = ((totalCost/118)*18).toFixed(2)
                nAll = nAll.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ')+'.'+nAll.split('.')[1]
                totalCost = totalCost.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ')+'.'+totalCost.split('.')[1]
                $("#SumAll").empty()
                $("#SumAll").append(totalCost)
            }
            d_price = (d_price-0).toFixed(2)
            d_price = d_price.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ')+'.'+d_price.split('.')[1]
            $("#delivery_cost").append(d_price)
        }
    })
    $("#selfCarry").change( function(){
        var d_price = $("#delivery_cost").html().replace(/\s/g, "")
        if($("#selfCarry").is(":checked")){
            var totalCost = $("#SumAll").attr("name")
            totalCost = (totalCost-0).toFixed(2)
            nAll = ((totalCost/118)*18).toFixed(2)
            nAll = nAll.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ')+'.'+nAll.split('.')[1]
            totalCost = totalCost.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ')+'.'+totalCost.split('.')[1]
            $("#SumAll").empty()
            $("#SumAll").append(totalCost)
        } else {
            var totalCost = $("#SumAll").attr("name")
            totalCost = ((totalCost-0)+(d_price-0)).toFixed(2)
            nAll = ((totalCost/118)*18).toFixed(2)
            nAll = nAll.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ')+'.'+nAll.split('.')[1]
            totalCost = totalCost.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ')+'.'+totalCost.split('.')[1]
            
            $("#SumAll").empty()
            $("#SumAll").append(totalCost)
        }
    })

})


