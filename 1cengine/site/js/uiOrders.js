function defineBrowser(){
	var userAgent = navigator.userAgent.toLowerCase();
	// Определим используемый браузер
	browser = {
		version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1],
		safari: /webkit/.test( userAgent ),
		opera: /opera/.test( userAgent ),
		msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ),
		firefox3: /firefox\/3/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent ),
		firefox2: /firefox\/2/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent ),
		firefox1: /firefox\/1/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent ),
		firefox: /firefox/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent )
	}
}
function IE(стр){
	if (browser.firefox || browser.msie) return 'm:'+стр
	else return стр
}

function getXmlHttp(){
	var xmlhttp;
	try {
		xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
	} catch (e) {
		try {
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		} catch (E) {
			xmlhttp = false;
		}
	}
	if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
		xmlhttp = new XMLHttpRequest();
	}
  return xmlhttp;
}




function getOrder(uid){
	// var xmlhttp = getXmlHttp();
	// var params = 'uid=' + uid

	$.ajax({
        type: "POST",
        url: "getOrder.php",
        data: "uid="+uid+"",
        success: function(html){
        	// alert(html)
            parseOrder(html)

            //ПриОтветеВебСервиса(xmlhttp)
        }
    });
	
	// xmlhttp.open('POST', 'getOrder.php');
	// xmlhttp.onreadystatechange = function(){ 
	// 	ПриОтветеВебСервиса(xmlhttp)
	// }
 //    xmlhttp.send(params);

}

function ПриОтветеВебСервиса(xmlhttp){
	if (xmlhttp.readyState == 4) {// когда ответ готов.
		if(xmlhttp.status != 200) {// Если всё плохо - скажем об этом
			alert("Запрос завершился неудачно. Ответ сервера: " + xmlhttp.responseText);
		} else {
			//alert(xmlhttp.innerHTML)
			parseOrder(xmlhttp);

		}
		
	}
}

function parseOrder(xmlhttp){
	defineBrowser();
	
	//alert(xmlhttp)

	var orders = xmlhttp.split('||')

	var orderNum = orders[0]

	var orderEdit = orders[1]

	document.getElementById("nOrder").innerHTML = orderNum

	var ordersArray = orders[2].split(';')

	
	var j = ordersArray.length-1
	$('tbody#lItemTab').empty()
	$('a[href="Обновить заказ"]').remove()
	$('.basketCount').empty()
	$('.basketCount').append(j)
	for(var i in ordersArray){
	    var orderStr = ordersArray[i];

	    if(orderStr!=''){
	    	var orderArray = orderStr.split(':')
	    
		    var nomen = orderArray[0]
		    var char = orderArray[1]
		    var count = orderArray[2]
		    var weight = orderArray[3]
		    var price = orderArray[4]


		    if(orderEdit=='ДА'){
		    	var ccc = $('a[name="'+char+'"]').attr('onClick')
			    var ccn = $('a[name="'+nomen+'"]').attr('onClick')

			    //alert(count)
			    //alert(weight)

			    if(count==0){
			    	count = '--'
			    }
			    if(weight==0){
			    	weight = '--'
			    }
			    
			    if(ccc!=undefined){
			    	ccc = ccc.replace("; return false", "")
			    	eval(ccc);
			    	nrClass = $('a[name="'+char+'"]').parent().parent().attr('id').replace('list ', '')
			    	ch = '-'
			    	setWeight(nrClass, weight, '--', '-')
			    	//alert(id)
			    	//alert('1')
			    }

			    if(ccn!=undefined){
			    	ccn = ccn.replace("; return false", "")
			    	eval(ccn);
			    	nrClass = $('a[name="'+nomen+'"]').parent().parent().attr('id').replace('list ', '')
			    	ch = char
			    	setWeight(nrClass, weight, '--', char)
			    }
			    
		    } else {

		    	var length = orderArray[5]
		    	var edIzm = orderArray[6]

		    	if(count=='0'){
		    		count='--'
		    	}
		    	if(length=='0'){
		    		length='--'
		    	}

		    	var nrClass = nomen+' '+char;
			    var newRow = '<tr id="'+nrClass+'" class="itemTR">';

			    var cells = "<td class='itemNum' style='width:10px !important;'>"+j+"</td>";
		        cells += "<td class='itemName'>"+nomen+'</td>';
	
		        cells += "<td class='itemChar'>"+char+'</td>';

		        cells += "<td class='itemWeight'><input class='itemWeightInput' type='text' size='10' value='"+weight+"' readonly /></td>";
		        
		        cells +="<td class='itemType'>"+edIzm+"</td>";
		        cells += "<td class='itemCount'><input class='itemCountInput' type='text' size='10' value='"+count+"' readonly /></td>";
		        cells += "<td class='itemLength'><input class='itemLengthInput' type='text' size='10' value='"+length+"' readonly /></td>";
		        cells += "<td class='itemNDS'>18%</td>";
		        priceN = (price-0).toFixed(2)
		        cells += "<td class='itemPrice'><input class='itemPriceInput' type='text' size='10' value='"+priceN.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ')+'.'+priceN.split('.')[1]+"' readonly /></td>";
		        sumN = (price*weight).toFixed(2)
		        cells += "<td class='itemSum'><input class='itemSumInput' type='text' size='10' value='"+sumN.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ')+'.'+sumN.split('.')[1]+"' readonly /></td>";
		        
		        newRow += cells+'</tr>';
		        $('tbody#lItemTab').prepend(newRow);
		    }
		    
		
		}
		j--;
		
	}
	wAll = 0
    $(".itemWeightInput").each( function(){
        var cItemName = $(this).parent().parent().attr('id')
        var cEdIzm = $(this).parent().parent().find('td.itemType').html()

        var iPI = getItemPrice(cItemName, cEdIzm)
        $(this).attr('value',iPI)
    
    });
	wAll = wAll.toFixed(3)
    wAll = wAll.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ')+'.'+wAll.split('.')[1]
    $("#WeightAll").empty()
    $("#WeightAll").append(wAll)

    sAll = 0
    $(".itemSumInput").each( function(){
    	sAll = sAll + (this.value.replace(/\s/g,"")-0)
    });

    sAll = sAll.toFixed(2)
    nAll = ((sAll/118)*18).toFixed(2)
    nAll = nAll.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ')+'.'+nAll.split('.')[1]
    sAll = sAll.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ')+'.'+sAll.split('.')[1]
    
    $("#SumAll").empty()
    $("#SumAll").append(sAll)
    
    $("#NDSAll").empty()
    $("#NDSAll").append(nAll)


	
}

function updateOrder(uid){
	var i = 1

    var tabOrder = document.createElement('table')
    //var tbodyInst = $(htmlPrint).find('#productTabBody')
    // var tbodyInst = $(htmlPrint).find('#lItemTab')
    var sendRow = '';
    $('tr.itemTR').each( function(){
        
        var newRow = document.createElement('tr')
        var cells = '';
        cells += "<td>"+i+"</td>";
        if($(this).find('input.itemCharInput').length){
            cells += "<td>"+$(this).find('td.itemName').html()+" "+"("+$(this).find('input.itemCharInput').attr('value')+")"+" "+"("+$(this).find('input.itemCountInput').attr('value')+" шт.)"+"</td>"
        } else {
            cells += "<td>"+$(this).find('td.itemName').html()+" "+"("+$(this).find('td.itemChar').html()+")"+" "+"("+$(this).find('input.itemCountInput').attr('value')+" шт.)"+"</td>"
        }
		
		//cells += "<td>"+$(this).find('td.itemName').html()+" "+"("+$(this).find('td.itemChar').html()+")"+" "+"("+$(this).find('input.itemCountInput').attr('value')+" шт.)"+"</td>"
        
        cells += "<td>"+$(this).find('input.itemWeightInput').attr('value')+"</td>"
        cells += "<td>т</td>"
        cells += "<td>"+$(this).find('input.itemPriceInput').attr('value')+"</td>"
        cells += "<td>"+$(this).find('input.itemSumInput').attr('value')+"</td>"
        $(newRow).append(cells)
        
        //$(tbodyInst).append(newRow)
        $(tabOrder).append(newRow)

        if($(this).find('input.itemCharInput')){
            sendRow += ''+$(this).find('input.itemCharInput').attr('value')+''+$(this).attr('name')+':'+$(this).find('input.itemCountInput').attr('value')+':'+$(this).find('input.itemWeightInput').attr('value')+';';
        } else {
            sendRow += ''+$(this).attr('name')+':'+$(this).find('input.itemCountInput').attr('value')+':'+$(this).find('input.itemWeightInput').attr('value')+';';
        }
		
        i++;

        
    })


    $.ajax({
        type: "POST",
        url: "updateOrder.php",
        async: false,
        data: "orderString="+sendRow+"&uid="+uid+"",
        success: function(html){
            //var success = 'true';
            alert(html)
        }
    });
}