$(document).ready( function() {
  
    $("li.UlName").click( function () {
        $(this).addClass('selected');
        $("li.UlName").not(this).removeClass('selected');
        var elDown = $(this).next().children(":first").children(":first")
        $("li.UlName").not(this).next().not($(this).parents()).slideUp("fast");
        $(elDown).not("li.itemGroup").parent().parent().slideDown("fast");
        if($(elDown).is("li.itemGroup")){
            $("input#filterInput").attr('value', '');
            $("table#pTableContentTab").find('tbody').empty();
            $(this).next().find('tbody').each( function(){
                
                $("table#pTableContentTab").append($(this).html());
                $("#priceSelect").change()
                if($(this).hasClass('hollow')){
                    $('span.c4').hide()
                    $('span.c3').show()
                } else {
                    $('span.c3').hide()
                    $('span.c4').show()
                }
                
                $('#basketDiv').hide()
                $('#pTableContentTab').show()
                $('#showPriceSpan').hide()
                $('#showBasketSpan').show()
            })
           
        }

    });

    $('#schb').change(function(){
      if($(this).attr('checked')){
        $('#sFormChecked').show()
      } else {
        $('#sFormChecked').hide()
      }
    });


    $('#dopObCh').change(function(){
      if($(this).attr('checked')){
        $('.dopOb').show()
        $('.dopObCost').show()
      } else {
        $('.dopOb').hide()
        $('.dopObCost').hide()
      }
    })

    $("#priceSelect").change(function(){
            //alert($("#priceSelect").attr('value'))
            if($("#priceSelect").attr('value')=='TN'){
                $('table#pTableContentTab').find(".itemPC").removeClass("itemPC").addClass("itemPC_hid");
                $('table#pTableContentTab').find(".itemPM").removeClass("itemPM").addClass("itemPM_hid");
                $('table#pTableContentTab').find(".itemTN_hid").removeClass("itemTN_hid").addClass("itemTN");
            } else if($("#priceSelect").attr('value')=='PC'){
                $('table#pTableContentTab').find(".itemTN").removeClass("itemTN").addClass("itemTN_hid");
                $('table#pTableContentTab').find(".itemPM").removeClass("itemPM").addClass("itemPM_hid");
                $('table#pTableContentTab').find(".itemPC_hid").removeClass("itemPC_hid").addClass("itemPC");
            } else if($("#priceSelect").attr('value')=='PM'){
                $('table#pTableContentTab').find(".itemPC").removeClass("itemPC").addClass("itemPC_hid");
                $('table#pTableContentTab').find(".itemTN").removeClass("itemTN").addClass("itemTN_hid");
                $('table#pTableContentTab').find(".itemPM_hid").removeClass("itemPM_hid").addClass("itemPM");
        }

    })

    function detectBrowser(){
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
    detectBrowser()

    // $('#basketTab').tableScroll({height:200});
    
})




            jQuery.expr[':'].Contains = function(a,i,m){
            return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase())>=0;
        };
        

 
        function filterList(header, list) {
            tmOutId = 0;
            var form = $("<form>").attr({"class":"filterform","action":"#"}),
            input = $("<input>").attr({"class":"filterinput","type":"text"});
            
            $(form).append(input).appendTo(header);
            form.append('<span>Поиск по катологу:</span>');
            //$(form).append("<input class='resetButton' type='reset' value='Очистить' />");
            $(input).attr({"placeholder":"Введите здесь наименование", "id":"filterInput"});
            list = $('ul#ПрайсЛист');
            $(input).change( function () {
                var filter = $(this).val();
                if(filter) {
                    $('#basketDiv').hide()
                    $('#pTableContentTab').show()
                    $('#showPriceSpan').hide()
                    $('#showBasketSpan').show()
                    $("table#pTableContentTab").find('tbody').empty();
                    $matches = $(list).find('td.iName:Contains(' + filter + ')').parent();
                    if($(list).find('td.iName:Contains(' + filter + ')').length==0){
                        ifilter = document.getElementById('list '+filter)
                        $("table#pTableContentTab").find('tbody').append($(ifilter).clone())
                        //alert(ifilter)
                        if($(ifilter).hasClass('hollow')){
                            $('span.c4').hide()
                            $('span.c3').show()
                        } else {
                            $('span.c3').hide()
                            $('span.c4').show()
                        }
                    }
                    if ($matches.hasClass("item")){
                        $matches.each(function(){
                            $("table#pTableContentTab").find('tbody').append($(this).clone())
                            if($(this).hasClass('hollow')){
                                $('span.c4').hide()
                                $('span.c3').show()
                            } else {
                                $('span.c3').hide()
                                $('span.c4').show()
                            }
                        })  
                    } 
                    $.cookie('choise', filter)
                } else {
                    $("table#pTableContentTab").find('tbody').empty();
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
        
  function getElementPosition(elemId)
{
    var elem = document.getElementById(elemId);
 
    var w = elem.offsetWidth;
    var h = elem.offsetHeight;
 
    var l = 0;
    var t = 0;
 
    while (elem)
    {
        l += elem.offsetLeft;
        t += elem.offsetTop;
        elem = elem.offsetParent;
    }

    return {"left":l, "top":t, "width": w, "height":h};
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
        $("#switchOrderDiv").removeClass("inactiveDiv").addClass("activeDiv")
        $("#switchDeliveryDiv").removeClass("activeDiv").addClass("inactiveDiv")
    })
    $("#switchDeliveryDiv").click( function(){
        $("#deliveryDiv").show()
        $("#orderDiv").hide()
        $("#switchDeliveryDiv").removeClass("inactiveDiv").addClass("activeDiv")
        $("#switchOrderDiv").removeClass("activeDiv").addClass("inactiveDiv")
    })
                
});

function sendOrder(orderString){
    if($('#schb').attr('checked')){
        carry = $('#sFormChecked').find('input:checked').attr('value')
        destination = $('input#destination').attr('value')

    } else {
        carry = ''
        destination = ''
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
        data: "orderString="+orderString+"&carry="+carry+"&destination="+destination+"&email="+email+"",
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
    var sendRow = '';
    $('tr.itemTR').each( function(){
        sendRow += ''+$(this).attr('name')+':'+$(this).find('input.itemCountInput').attr('value')+':'+$(this).find('input.itemWeightInput').attr('value')+':'+$(this).find('input.itemPriceInput').attr('value')+';';
        
    });
    sendOrder(sendRow);
}


function printForm(print){
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
        cells += "<td>"+$(this).find('td.itemType').html()+"</td>"
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
        
        //sendRow += ''+$(this).attr('name')+':'+$(this).find('input.itemCountInput').attr('value')+':'+$(this).find('input.itemWeightInput').attr('value')+':'+$(this).find('input.itemPriceInput').attr('value')+';';
        
        i++;

        
    })
    weightSum = $('#WeightAll').html()
    sumSum = $('#SumAll').html()
    ndsSum = $('#NDSAll').html()
    parsedStrSum = parseNumber(sumSum.split('.')[0])+' руб., '+parseNumber(sumSum.split('.')[1])+' коп.'
    
    number = sendOrder(sendRow)
    if(number==null){
        return null
    }
    items = i-1
    $.ajax({
        type: "POST",
        url: "print.php",
        async: false,
        data: "table="+tabOrder.innerHTML+"&weightSum="+weightSum+"&sumSum="+sumSum+"&ndsSum="+ndsSum+"&parsedStrSum="+parsedStrSum+"&number="+number+"&items="+items+"",
        success: function(html){
            orderHtml = html
            //alert(orderHtml)
            var print = window.open('print.php', '_blank')
            document.domain=document.domain
            //window.open('print.php', '_blank')
            print.document.write(orderHtml)

            
            return orderHtml
            
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



function searchItem(item){
    var squery = item.replace(/%2F/g, "/")
    var squery = squery.replace(/\s\s/g, " ")
    var squery = squery.replace(/%2C/g, ",")
    var squery = squery.replace(/\.com/, '')
    $('#filterInput').attr('value', squery)
    $('#filterInput').change()
    $("table#pTableContentTab").find('tbody').empty();
    filter = squery;
    //alert(squery)
    list = $('ul#ПрайсЛист');
    $matches = $(list).find('td.iName:Contains(' + filter + ')').parent();
    if($(list).find('td.iName:Contains(' + filter + ')').length==0){
        ifilter = document.getElementById('list '+filter)
        $("table#pTableContentTab").find('tbody').append($(ifilter).clone())
        //alert(ifilter)
    }
    if ($matches.hasClass("item")){
        $matches.each(function(){
            $("table#pTableContentTab").find('tbody').append($(this).clone())
        })  
    } 
}

function showGroup(groupName){
    // alert(groupName)
    var group = $('ul#ПрайсЛист').find('li.UlName:Contains(' + groupName + ')');
    $(group).click();
    // $(group).addClass('selected');
    //     $("li.UlName").not(group).removeClass('selected');
    //     var elDown = $(group).next().children(":first").children(":first")
    //     $("li.UlName").not(group).next().not($(group).parents()).slideUp("fast");
    //     $(elDown).not("li.itemGroup").parent().parent().slideDown("fast");
    //     if($(elDown).is("li.itemGroup")){
    //         $("input#filterInput").attr('value', '');
    //         $("table#pTableContentTab").find('tbody').empty();
    //         $(this).next().find('tbody').each( function(){
                
    //             $("table#pTableContentTab").append($(this).html());
    //             $("#priceSelect").change()
    //         })
           
    //     }
}

function searchItem2(item){
    var squery = item.replace(/%2F/g, "/")
    var squery = squery.replace(/\s\s/g, " ")
    var squery = squery.replace(/%2C/g, ",")
    var squery = squery.replace(/\.com/, '')
    $("#itemName").attr('value', squery)
    $("#itemName").change()
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

function getOrderFomat(format){
    var sendRow = '';
    $('tr.itemTR').each( function(){

        if($(this).find('input.itemCharInput')){
            sendRow += ''+$(this).find('input.itemCharInput').attr('value')+''+$(this).attr('name')+':'+$(this).find('input.itemCountInput').attr('value')+':'+$(this).find('input.itemWeightInput').attr('value')+':'+$(this).find('input.itemPriceInput').attr('value')+';';
        } else {
            sendRow += ''+$(this).attr('name')+':'+$(this).find('input.itemCountInput').attr('value')+':'+$(this).find('input.itemWeightInput').attr('value')+':'+$(this).find('input.itemPriceInput').attr('value')+';';
        }
  
    })
    var order = sendOrder(sendRow);
    var q = order.split(',')


    openLink(q[1],format)
}
