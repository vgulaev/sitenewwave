(function ($) {
			jQuery.expr[':'].Contains = function(a,i,m){
      		return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase())>=0;
  		};
  		

 
  		function filterList(header, list) {
  		    tmOutId = 0;
    		var form = $("<form>").attr({"class":"filterform","action":"#"}),
        	input = $("<input>").attr({"class":"filterinput","type":"text"});
        	form.append('Поиск по номенклатуре: ');
    		$(form).append(input).appendTo(header);
    		$(form).append("<input class='resetButton' type='reset' value='Очистить' onClick='showAll()' />");
    		$(input).attr({"placeholder":"Введите здесь наименование", "id":"filterInput"});
 			list = $('ul#ПрайсЛист');
    		$(input).change( function () {
       			var filter = $(this).val();
        		if(filter) {
 					$('ul').show();
          			$matches = $(list).find('span:Contains(' + filter + ')').parent().parent();
          			if ($matches.hasClass("itemGroup")){
          				$('li.itemGroup', list).not($matches).hide();
          				
          				$matches.show();
          				
          			} 
          			
          			if ($matches.hasClass("group")){
          				$('li.group', list).not($matches).hide();
          				
          				$('li.group').not($matches).hide();
          				//$('li.itemGroup').hide();
          				$matches.find('li.itemGroup').show();
          				$matches.find('li.group').show();
          				$matches.parents('li.group').show();
          				$matches.show();
          				
          			} else {
          				$(list).find("li.itemGroup").hide();
          				$('li.group').hide();
          			}
 					$.cookie('choise', filter)
        		} else {
          			$(list).find("li").show();
          			$.cookie('choise', null)
        		}
        			return false;
      			})
    		$(input).keyup( function () {
    		    
    		    keyEvent = this;
    		    window.clearTimeout(tmOutId);
    		    tmOutId = window.setTimeout(  
                    function() {  
                        $(keyEvent).change();  
                    },  
                    1000  
                );
            
        		
    		});
  		}
 
 		$(function () {
    		filterList($("#form"), $("#list"));
  		});
  		
  		
	}(jQuery));
	
	$(function(){
	    $("input[type='radio']").change(function() {
            if ($('input#brad').prop("checked")==true) {
                $('div#priceDiv').hide();
                $('div#basketDiv').show();
            } else {
                $('div#basketDiv').hide();
                $('div#priceDiv').show();
            }
        });
    $("div#tabPrice").click( function () {
        $(this).removeClass('pb_unactive').addClass('pb_active')
        $("div#tabBasket").removeClass('pb_active').addClass('pb_unactive')
        $('div#basketDiv').hide();
        $('div#priceDiv').show();
    })
    
    $("div#tabBasket").click( function () {
        $(this).removeClass('pb_unactive').addClass('pb_active')
        $("div#tabPrice").removeClass('pb_active').addClass('pb_unactive')
        $('div#priceDiv').hide();
        $('div#basketDiv').show();    
    })
    
    
});

function showAll(){
    
    $('ul').show();
    $('li.itemGroup').show();
    $('li.group').show();
    $('input#filterInput').attr('value', '')
    $.cookie('choise', null)
}

$(function(){
	$("label input:checkbox").change(function(){
		
		if ($("#itemTN").prop("checked")){
		
			$('table').find(".itemTN_hid").removeClass("itemTN_hid").addClass("itemTN");
		
		} else if ($("#itemTN").prop("checked")==false) {
			
			$('table').find(".itemTN").removeClass("itemTN").addClass("itemTN_hid");
		};
		
		if ($("#itemPC").prop("checked")){
		
			$('table').find(".itemPC_hid").removeClass("itemPC_hid").addClass("itemPC");
		
		} else if ($("#itemPC").prop("checked")==false) {
			
			$('table').find(".itemPC").removeClass("itemPC").addClass("itemPC_hid");
		};
		
		if ($("#itemPM").prop("checked")){
		
			$('table').find(".itemPM_hid").removeClass("itemPM_hid").addClass("itemPM");
		
		} else if ($("#itemPM").prop("checked")==false) {
			
			$('table').find(".itemPM").removeClass("itemPM").addClass("itemPM_hid");
		};
		
		//
		if ($("#p0").prop("checked")){
		
			$('table').find(".p0_hid").removeClass("p0_hid").addClass("p0");
		
		} else if ($("#p0").prop("checked")==false) {
			
			$('table').find(".p0").removeClass("p0").addClass("p0_hid");
		};
		
		if ($("#p1").prop("checked")){
		
			$('table').find(".p1_hid").removeClass("p1_hid").addClass("p1");
		
		} else if ($("#p1").prop("checked")==false) {
			
			$('table').find(".p1").removeClass("p1").addClass("p1_hid");
		};
		
		if ($("#p2").prop("checked")){
		
			$('table').find(".p2_hid").removeClass("p2_hid").addClass("p2");
		
		} else if ($("#p2").prop("checked")==false) {
			
			$('table').find(".p2").removeClass("p2").addClass("p2_hid");
		};
		
		if ($("#p3").prop("checked")){
		
			$('table').find(".p3_hid").removeClass("p3_hid").addClass("p3");
		
		} else if ($("#p3").prop("checked")==false) {
			
			$('table').find(".p3").removeClass("p3").addClass("p3_hid");
		};
		
		return true;
	});
});



function addItem(itemName, char, bPrice, kfArray, weight, kr, kf, flag){
    flag = flag || 0;
    
    var nrClass = itemName+' '+char;
    $trs = $("tbody#lItemTab").find($("tr"))
    if( $trs.hasClass(nrClass) ){
        
        //alert('1')
    } else {
        //alert('2')
        //alert(q)
	    var newRow = document.createElement("tr");
	    newRow.setAttribute('id', nrClass);
	    newRow.setAttribute('class', 'itemTR');
	    
	    cItem = document.getElementById(itemName);
	    
	    $.expr[":"].econtains = function(obj, index, meta, stack){
return (obj.textContent || obj.innerText || $(obj).text() || "").toLowerCase() == meta[3].toLowerCase();
}
    //alert(cItem);
    //
    
        ccItem = $(cItem).find('span.itemName:econtains(' + char + ')').parent()
        
        delItemButton = document.createElement('a')
        $(delItemButton).attr('class','delItem')
        $(delItemButton).attr('href','Убрать из заказа');
        $(delItemButton).attr('onClick',"delItem('"+nrClass+"', '"+itemName+"', '"+char+"', '"+bPrice+"', '"+kfArray+"', '"+weight+"', '"+kr+"', '"+kf+"'); return false");
        $(delItemButton).append('убрать');
        
        $(ccItem).find('a.addItem').remove()
        //$(ccItem).find('a.addItem').remove()
        $(ccItem).find('div.pr').prepend(delItemButton)
        ccItem.attr('style','background-color:yellow')
	    
	    
	    var cells = "<td class='itemNum'>"+" <a href='Убрать из заказа' class='delItem' onClick=\"delItem('"+nrClass+"', '"+itemName+"', '"+char+"', '"+bPrice+"', '"+kfArray+"', '"+weight+"', '"+kr+"', '"+kf+"'); return false\" >Убрать</a> </td>";
	    cells += "<td class='itemName'>"+itemName+'</td>';
	    cells += "<td class='itemChar'>"+char+'</td>';
	    cells += "<td class='itemWeight'><input class='itemWeightInput' name='"+weight/1000+"' type='text' size='10' value = '0' /></td>";
        cells += "<td class='itemCount'><input class='itemCountInput' type='text' size='10' value = 0 /></td>";
        cells += "<td class='itemLength'><input class='itemLengthInput' name='"+kr+"' type='text' size='10' value = 0 /></td>";
        cells += "<td class='itemNDS'>18%</td>";
        cells += "<td class='itemPrice'><input class='itemPriceInput' name='"+bPrice+"' type='text' size='10' value = 0 readonly /></td>";
        cells += "<td class='itemSum'><input class='itemSumInput' type='text' size='10' value = 0 readonly /></td>";

        
    

	    $(newRow).append(cells);
	    $('tbody#lItemTab').prepend(newRow);
	    //$(".itemWeightInput").change();
	    if(flag==0){
	        //$.cookie("basket", null);
	        var vars = "addItem('"+itemName+"', '"+char+"', '"+bPrice+"', '"+kfArray+"', '"+weight+"', '"+kr+"', '"+kf+"', 1)"
	        if($.cookie("basket")){
	            var cook1 = $.cookie("basket")
	            $.cookie("basket", null);
	            var cook = new Array()
	            cook.push(cook1)
	            cook.push(vars)
	        } else {
	            var cook = new Array()
	            cook = vars
	        }
	        //var cook = $('tbody#lItemTab').html();
	        $.cookie("basket", cook);
	    }
	    
        
            
        
    
    }
    
    
    $(function(){
    	
    	if (browser.msie==true){
			$(".itemCountInput").focusout(function(){
    			$(".itemCountInput").change()
        	})
	    	$(".itemWeightInput").focusout(function(){
	    		$(".itemWeightInput").change()
	    	})
	    	$(".itemLengthInput").focusout(function(){
	    		$(".itemLengthInput").change()
	    	})
		}
    	
        $(".itemCountInput").change(function() {
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
                var father; 
                var wN;
                var krN;
                
                
			    if(father.find($(".itemWeightInput")).attr('name')!=0){
                    wN = num * father.find($(".itemWeightInput")).attr('name') * father.find($(".itemLengthInput")).attr('name')
                    krN = num * father.find($(".itemLengthInput")).attr('name')
                    var oldWn =  father.find($(".itemWeightInput")).attr('value')
                    father.find($(".itemWeightInput")).attr('value',(wN).toFixed(3))  
                    father.find($(".itemLengthInput")).attr('value',(krN).toFixed(2))
                
                    
                } else {
                    father.find($(".itemCountInput")).attr('value','--')
                    father.find($(".itemLengthInput")).attr('value','--')
                    father.find($(".itemWeightInput")).attr('value',(wN).toFixed(3))
                
                }
            }
            wAll = 0
            $(".itemWeightInput").each( function(){
                wAll = (wAll + (this.value-0))
            
            });
            
            if( wAll<2 ){
                k = 10
            } else if( wAll>=2 && wAll <8) {
                k = 8
            } else if( wAll>=8 && wAll <15) {
                k = 5
            } else if( wAll>=15) {
                k = 2
            }
            
            wAll = wAll.toFixed(3)
            wAll = wAll.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ')+'.'+wAll.split('.')[1]
            $("#WeightAll").empty()
            $("#WeightAll").append(wAll)
            
            
            
            $(".itemPriceInput").each( function() {
                bP = bigRound($(this).attr('name')/(1-(k/100))).toFixed(2)
                bP = bP.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ')+'.'+bP.split('.')[1]
                $(this).attr('value',bP)
            })
                
            $(".itemSumInput").each( function() {
                fth = $(this).parent().parent()
                bP = fth.find($(".itemPriceInput")).attr('value').replace(/\s/g,"");
                wN = fth.find($(".itemWeightInput")).attr('value')
                sumN = (wN*bP).toFixed(2)
                $(this).attr('value',(sumN.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ')+'.'+sumN.split('.')[1]))
            })
                
            
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
            
            this.value = num
            
            $.cookie('backetWeight', null)
            var wBasket = new Array()
            $('.itemTR').each( function(){
            	var nrClassName = $(this).attr('id')
            	var wInput = $(this).find('input.itemWeightInput').attr('value')
            	var cInput = $(this).find('input.itemCountInput').attr('value') 
            	wBasketItem = "setWeight('"+nrClassName+"','"+wInput+"','"+cInput+"')"
            	wBasket.push(wBasketItem)
            	$.cookie('basketWeight', wBasket)
            })
            
        })
        
        $(".itemWeightInput").change(function() {
           // wAll = 0
           // sAll = 0
            cW = this.value
            cW = cW.match(/\d+\.\d{0,3}|\d+/)
       
            var father;
            father = $(this).parent().parent()
            
            weightName = father.find($(".itemWeightInput")).attr('name')
            
            if(weightName!=0){
                num = cW/(father.find($(".itemWeightInput")).attr('name') * father.find($(".itemLengthInput")).attr('name'))
                father.find($(".itemCountInput")).attr('value',num)
                father.find($(".itemCountInput")).change();
            
            } else {
                father.find($(".itemCountInput")).attr('value','--')
                father.find($(".itemLengthInput")).attr('value','--')
                father.find($(".itemCountInput")).change();
            
            }
            
            
        })
        
        $(".itemLengthInput").change(function() {
           // wAll = 0
           // sAll = 0
            cKr = this.value
            cKr = cKr.match(/\d+\.\d{0,2}|\d+/)
             
            
            var father;
            father = $(this).parent().parent()
            
            weightName = father.find($(".itemWeightInput")).attr('name')
            
            if(weightName!=0){
            num = cKr/father.find($(".itemLengthInput")).attr('name')
                father.find($(".itemCountInput")).attr('value',num)
                father.find($(".itemCountInput")).change();
            } else {
                father.find($(".itemCountInput")).attr('value','--')
                father.find($(".itemLengthInput")).attr('value','--')
                father.find($(".itemCountInput")).change();
            }
            
        })
    });
    
    $('input.itemWeightInput').keyup( function() {
	  var str = '', value = $(this).val().match(/[\d\.]/g);
	  if(!value) {$(this).val().replace(/\value/g,"")};
	  for(var i = 0; i < value.length; i++){
	    str += value[i];
	  }
	  $(this).val(str);
	});
	
	$('input.itemLengthInput').keyup( function() {
	  var str = '', value = $(this).val().match(/[\d\.]/g);
	  if(!value) {$(this).val().replace(/value/g,"")};
	  for(var i = 0; i < value.length; i++){
	    str += value[i];
	  }
	  $(this).val(str);
	});
	
	$('input.itemCountInput').keyup( function() {
	  var str = '', value = $(this).val().match(/\d/g);
	  if(!value) return;
	  for(var i = 0; i < value.length; i++){
	    str += value[i];
	  }
	  $(this).val(str);
	});
    
return false;    
}

function delItem(nrClass, itemName, char, bPrice, kfArray, weight, kr, kf){

    cItem = document.getElementById(itemName);
    //alert(cItem);
    //
    
    $.expr[":"].econtains = function(obj, index, meta, stack){
return (obj.textContent || obj.innerText || $(obj).text() || "").toLowerCase() == meta[3].toLowerCase();
}
    ccItem = $(cItem).find('span.itemName:econtains(' + char + ')').parent()
    //ccItem = $(cItem).find('span.itemName:regex(/^' + char + '&/)').parent()
    var nrClass = itemName+' '+char;
    addItemButton = document.createElement('a')
    $(addItemButton).attr('class','addItem')
    $(addItemButton).attr('href','Добавить в заказ');
    $(addItemButton).attr('onClick',"addItem('"+itemName+"', '"+char+"', '"+bPrice+"', '"+kfArray+"', '"+weight+"', '"+kr+"', '"+kf+"'); return false");
    $(addItemButton).append('купить');
    
    $(ccItem).find('a.delItem').remove()
    $(ccItem).find('div.pr').prepend(addItemButton)
    ccItem.attr('style','background-color:white')
    //alert(nrClass)
    trEl = document.getElementById(nrClass)
    //alert(trEl);
    //var WnT = $(trEl).find(".itemWeightInput").attr('value')
    $(trEl).remove();
    
    if($.cookie("basket")){
        //$.cookie("basket", null);
        
        var vars = "addItem('"+itemName+"', '"+char+"', '"+bPrice+"', '"+kfArray+"', '"+weight+"', '"+kr+"', '"+kf+"', 1)"
        var cook1 = $.cookie("basket")
        $.cookie("basket", null);
        cook1 = cook1.replace(vars,"")
        cook1 = cook1.replace(/^,/g, "")
        cook1 = cook1.replace(/,,/g, ",")
        cook1 = cook1.replace(/,$/g, "")
        var cook = new Array()
        cook = cook1
        //alert(cook)
    
        $.cookie("basket", cook);
    }
    
    $.cookie('backetWeight', null)
    var wBasket = new Array()
    $('.itemTR').each( function(){
    	var nrClassName = $(this).attr('id')
    	var wInput = $(this).find('input.itemWeightInput').attr('value') 
    	wBasketItem = "setWeight('"+nrClassName+"','"+wInput+"')"
    	wBasket.push(wBasketItem)
    	$.cookie('basketWeight', wBasket)
    })

    
    wAll = 0
    $(".itemWeightInput").each( function(){
        wAll = wAll + (this.value-0)
    
    });
    
    if( wAll<2 ){
        k = 10
    } else if( wAll>=2 && wAll <8) {
        k = 8
    } else if( wAll>=8 && wAll <15) {
        k = 5
    } else if( wAll>=15) {
        k = 2
    }
    
    wAll = wAll.toFixed(3)
    wAll = wAll.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ')+'.'+wAll.split('.')[1]
   
    $("#WeightAll").empty()
    $("#WeightAll").append(wAll)
    
    
    $(".itemPriceInput").each( function() {
        bP = bigRound($(this).attr('name')/(1-(k/100))).toFixed(2)
        bP = bP.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ')+'.'+bP.split('.')[1]
        $(this).attr('value',bP)
    })
        
    $(".itemSumInput").each( function() {
        fth = $(this).parent().parent()
        bP = fth.find($(".itemPriceInput")).attr('value').replace(/\s/g,"")
        wN = fth.find($(".itemWeightInput")).attr('value').replace(/\s/g,"")
        sumN = (wN*bP).toFixed(2)
        $(this).attr('value',(sumN.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ')+'.'+sumN.split('.')[1]))
    })
        
    
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
    
    //$.cookie("basket", null);
    //var cook = $('tbody#lItemTab').html();
	//$.cookie("basket", cook);
   
    return false
}


function createPrint(htmlPrint){
    var i = 1
    var tbodyInst = $(htmlPrint).find('#productTabBody')
    $('tr.itemTR').each( function(){
        
        var newRow = document.createElement('tr')
        var cells = '';
        cells += "<td>"+i+"</td>";
        cells += "<td>"+$(this).find('td.itemName').html()+" "+"("+$(this).find('td.itemChar').html()+")"+" "+"("+$(this).find('input.itemCountInput').attr('value')+" шт.)"+"</td>"
        cells += "<td>"+$(this).find('input.itemWeightInput').attr('value')+"</td>"
        cells += "<td>т</td>"
        cells += "<td>"+$(this).find('input.itemPriceInput').attr('value')+"</td>"
        cells += "<td>"+$(this).find('input.itemSumInput').attr('value')+"</td>"
        $(newRow).append(cells)
        
        $(tbodyInst).append(newRow)
        i++;
    })
    var weightSum = $('td#WeightAll').html()
    var sumSum = $('td#SumAll').html()
    var ndsSum = $('td#NDSAll').html()
    
    var parsedStrSum = parseNumber(sumSum.split('.')[0])+' руб., '+parseNumber(sumSum.split('.')[1])+' коп.'
    
    
    //showModalDialog(htmlPrint)
    //alert(htmlPrint)
    var win = open('print.html', 'Печать', 'width=auto,height=auto')
	win.focus()
	win.onload = function() {
	  var div = win.document.getElementById('productTabBody')
	  div.innerHTML = $(tbodyInst).html()
	  
	  var amountTD = win.document.getElementById('amountTD')
	  amountTD.innerHTML = weightSum
	  
	  var sumTD = win.document.getElementById('sumTD')
	  sumTD.innerHTML = sumSum
	  
	  var nds = win.document.getElementById('ndsSpan')
	  nds.innerHTML = ndsSum
	  
	  var itemAll = win.document.getElementById('itemAll')
	  itemAll.innerHTML = i-1
	  
	  var sumSpan = win.document.getElementById('sumSpan')
	  sumSpan.innerHTML = sumSum
	  
	  var parsedSum = win.document.getElementById('parsedSum')
	  parsedSum.innerHTML = parsedStrSum
	  
	  //win.document.body.insertBefore( div, win.document.body.firstChild )
	}
}

function printForm(){
    $.ajax({
        type: "POST",
        url: "print.html",
        data: "",
        success: function(html){
            createPrint(html)
        }
    });

}

var parseNumber = function(){
    var dictionary = [
    [ "", "один", "два", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять",
    "десять", "одиннадцать", "двенадцать", "тринадцать", "четырнадцать", "пятнадцать",
    "шестнадцать", "семнадцать", "восемнадцать", "девятнадцать" ],
    [ "", "десять", "двадцать", "тридцать", "сорок", "пятьдесят", "шестьдесят", "семьдесят", "восемьдесят", "девяносто" ],
    [ "", "сто", "двести", "триста", "четыреста", "пятьсот", "шестьсот", "семьсот", "восемьсот", "девятьсот" ],
    [ "тысяч|а|и|", "миллион||а|ов", "миллиард||а|ов", "триллион||а|ов" ]
  ];
  function getNumber(number, limit){
    var temp = number.match(/^\d{1,3}([,|\s]\d{3})+/);
    if(temp) return temp[0].replace(/[,|\s]/g, "");
    temp = Math.abs( parseInt(number) );
    if( temp !== temp || temp > limit ) return null;
    return String(temp);
  };
  function setEnding(variants, number){
    variants = variants.split("|");
    number = number.charAt( number.length - 2 ) === "1" ? null : number.charAt( number.length - 1 );
    switch(number){
      case "1":
      return variants[0] + variants[1];
      case "2": case "3": case "4":
      return variants[0] + variants[2];
      default:
      return variants[0] + variants[3];
    };
  };
  function getPostfix(postfix, number){
    if( typeof postfix === "string" || postfix instanceof String ){
      if( postfix.split("|").length < 3 ) return " " + postfix;
      return " " + setEnding(postfix, number);
    };
    return "";
  };
   
  return function(number, postfix){
    if(typeof number === "undefined")
      return "999" + new Array(dictionary[3].length + 1).join(" 999");
    number = String( number );
    var minus = false;
    number.replace(/^\s+/, "").replace(/^-\s*/, function(){
      minus = true;
      return "";
    });
    number = getNumber(number, Number( new Array(dictionary[3].length + 2).join("999") ));
    if(!number) return "";
    postfix = getPostfix(postfix, number);
    if(number === "0") return "ноль" + postfix;
    var position = number.length, i = 0, j = 0, result = [];
    while(position--){
      result.unshift( dictionary[ i++ ][ number.charAt(position) ] );
      if(i === 2 && number.charAt(position) === "1" )
        result.splice(0, 2, dictionary[0][ number.substring( position, position + 2 ) ]);
      if(i === 3 && position !== 0 ){
        i = 0;
        if( position > 3 && number.substring( position - 3, position ) === "000" ){
          j++; continue;
        };
      result.unshift( setEnding(dictionary[3][j++], number.substring( 0, position )) );
      };
    };
    position = result.length - 5;
    switch( result[position] ){
      case "один": result[position] = "одна"; break;
      case "два": result[position] = "две"; break;
    };
    if(minus) result.unshift("минус");
    return result.join(" ").replace(/\s+$/, "").replace(/\s+/g, " ") + postfix;
  };
}();

function doNothing(){
    return false
}

function setWeight(nrClass, weight, count){
	var cItem = document.getElementById(nrClass)
	var wInput = $(cItem).find('input.itemWeightInput')
	var cInput = $(cItem).find('input.itemCountInput')
	if(count!='--'){
		$(cInput).attr('value', count)
		$(cInput).change()
	} else {
		$(wInput).attr('value', weight)
		$(wInput).change()
	}
	
	
}
