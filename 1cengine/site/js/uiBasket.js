function getItemPrice(cItemName, edIzm){
    wAll = 0
    $(".itemWeightInput").each( function(){
        if($(this).parent().parent().find('td.itemType').attr('name')==edIzm){
            wAll = (wAll + (this.value-0))
        }
    });
    //alert(edIzm)
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
    

    q = document.getElementById('list '+cItemName+'')
    edPrice = $(q).find('td.'+k+'').find('span.sP').html()
    //alert(edPrice)
    return edPrice
}

function addItem(itemName, char, bPrice, kfArray, weight, kr, kf, uid, uidN, edIzm, flagN, flag){
    flag = flag || 0;
    
    var nrClass = itemName+' '+char;

    var newRow = '<tr id="'+nrClass+'" class="itemTR" name="'+uid+':'+uidN+'">';
    
    $.expr[":"].econtains = function(obj, index, meta, stack){
        return (obj.textContent || obj.innerText || $(obj).text() || "").toLowerCase() == meta[3].toLowerCase();
    }

    
    $('tr[name="'+nrClass+'"]').each(function(){
        ccItem = $(this).find('td:first-child')

        var delItemButton = document.createElement('a')
        $(delItemButton).attr('class','delItem')
        $(delItemButton).attr('href','Убрать из заказа');
        $(delItemButton).attr('onClick',"delItem('"+nrClass+"', '"+itemName+"', '"+char+"', '"+bPrice+"', '"+kfArray+"', '"+weight+"', '"+kr+"', '"+kf+"', '"+uid+"', '"+uidN+"', '"+edIzm+"', '"+flagN+"'); return false");
        
        var hashUid = $(ccItem).find('a.addItem').attr('name')
        $(delItemButton).attr('name', hashUid)

        var imgCross = document.createElement('img')
        $(imgCross).attr('src','/bitrix/templates/trimet/css/hollow.png');
        $(delItemButton).append(imgCross);

        $(ccItem).find('a.addItem').remove()
        $(ccItem).find('a.addItem').remove()
        $(ccItem).prepend(delItemButton)
        ccItem.parent().attr('style','background-color:yellow')
    })

        var cells = "<td class='itemNum'>"+" <a href='Убрать из заказа' class='delItem' onClick=\"delItem('"+nrClass+"', '"+itemName+"', '"+char+"', '"+bPrice+"', '"+kfArray+"', '"+weight+"', '"+kr+"', '"+kf+"', '"+uid+"', '"+uidN+"', '"+edIzm+"', '"+flagN+"'); return false\" >Убрать</a> </td>";
        cells += "<td class='itemName'>"+itemName+'</td>';
        if(flagN==1){
            cells += "<td class='itemChar'><input class='itemCharInput' type='text' size='10' value = 0 /></td>";
        } else {
            cells += "<td class='itemChar'>"+char+'</td>';
        }
        if(flagN==1){
            cells += "<td class='itemWeight'><input class='itemWeightInput' name='"+1+"' type='text' size='10' value = '0' /><!--<input class='itemWeightInput' name='"+1+"' type='text' size='10' value = '0' style='display:none' />--></td>";
        } else {
            cells += "<td class='itemWeight'><input class='itemWeightInput' name='"+weight/1000+"' type='text' size='10' value = '0' /></td>";
        }
        
        cells +="<td class='itemType' name='"+edIzm+"'>"+edIzm+"</td>";
        cells += "<td class='itemCount'><input class='itemCountInput' type='text' size='10' value = 0 /></td>";
        cells += "<td class='itemLength'><input class='itemLengthInput' name='"+kr+"' type='text' size='10' value = 0 /></td>";
        cells += "<td class='itemNDS'>18%</td>";
        cells += "<td class='itemPrice'><input class='itemPriceInput' name='"+bPrice+"' type='text' size='10' value = 0 readonly /></td>";
        cells += "<td class='itemSum'><input class='itemSumInput' type='text' size='10' value = 0 readonly /></td>";
        
        newRow += cells+'</tr>';

        //$(newRow).append(cells);
        $('tbody#lItemTab').prepend(newRow);
      

        var bCount = $('span.basketCount').html();
        bCount = (bCount - 0)+1;
        $('span.basketCount').html(bCount);  


        //$(".itemWeightInput").change();
        if(flag==0){
            var vars = "addItem('"+itemName+"', '"+char+"', '"+bPrice+"', '"+kfArray+"', '"+weight+"', '"+kr+"', '"+kf+"', '"+uid+"', '"+uidN+"', '"+edIzm+"', '"+flagN+"', 1)"
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
            $.cookie("basket", cook);
        }
        $('tbody#lItemTab').find('tr:even').removeClass('odd');
        $('tbody#lItemTab').find('tr:odd').addClass('odd');
            
    
    $(function(){
        
        if (browser.msie==true){
            $(".itemCountInput").focusout(function(){
                $(this).change()
            })
            $(".itemWeightInput").focusout(function(){
                $(this).change()
            })
            $(".itemLengthInput").focusout(function(){
                $(this).change()
            })
        }

        $(".itemCharInput").change(function(){
            ch = this.value
            father = $(this).parent().parent()
            $(father).find($(".itemLengthInput")).attr("name", ch)
            father.find($(".itemCountInput")).change();
        })
        
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
                //var father; 
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
                if($(this).parent().parent().find('td.itemType').attr('name')=='т'){
                    wAll = (wAll + (this.value-0))
                }
                
            
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
                //bP = bigRound($(this).attr('name')/(1-(k/100))).toFixed(2)
                //bP = bP.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ')+'.'+bP.split('.')[1]
                var cItemName = $(this).parent().parent().attr('id')
                var cEdIzm = $(this).parent().parent().find('td.itemType').html()

                var iPI = getItemPrice(cItemName, cEdIzm)
                $(this).attr('value',iPI)
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
            
            $.cookie('basketWeight', null)
            var wBasket = new Array()
            $('.itemTR').each( function(){
                var nrClassName = $(this).attr('id')
                var wInput = $(this).find('input.itemWeightInput').attr('value')
                var cInput = $(this).find('input.itemCountInput').attr('value') 
                if($(this).find('input.itemCharInput').length){
                    var chInput = $(this).find('input.itemCharInput').attr('value')
                    wBasketItem = "setWeight('"+nrClassName+"','"+wInput+"','"+cInput+"','"+chInput+"')"
                } else {
                    wBasketItem = "setWeight('"+nrClassName+"','"+wInput+"','"+cInput+"','-')"
                }
                //wBasketItem = "setWeight('"+nrClassName+"','"+wInput+"','"+cInput+"')"
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
        if(!value) { $(this).val().replace(/value/g,"") };
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

function delItem(nrClass, itemName, char, bPrice, kfArray, weight, kr, kf, uid, uidN, edIzm, flagN){

    // cItem = document.getElementById(itemName);
    //alert(cItem);
    //
    
    $.expr[":"].econtains = function(obj, index, meta, stack){
        return (obj.textContent || obj.innerText || $(obj).text() || "").toLowerCase() == meta[3].toLowerCase();
    }
    // ccItem = $(cItem).find('span.itemName:econtains(' + char + ')').parent()
    
    var nrClass = itemName+' '+char;

    $('tr[name="'+nrClass+'"]').each(function(){
        ccItem = $(this).find('td:first-child')

        addItemButton = document.createElement('a')
        $(addItemButton).attr('class','addItem')
        $(addItemButton).attr('href','Добавить в заказ');
        $(addItemButton).attr('onClick',"addItem('"+itemName+"', '"+char+"', '"+bPrice+"', '"+kfArray+"', '"+weight+"', '"+kr+"', '"+kf+"', '"+uid+"', '"+uidN+"', '"+edIzm+"', '"+flagN+"'); return false");
        var hashUid = $(ccItem).find('a.delItem').attr('name')
        $(addItemButton).attr('name', hashUid)
        $(addItemButton).append("<img src='/bitrix/templates/trimet/css/basket.png' />");

        $(ccItem).find('a.delItem').remove()
        $(ccItem).prepend(addItemButton)
        ccItem.parent().attr('style','background-color:white')
    })
    //cItem = document.getElementById('list '+nrClass);
    
    
    //alert(nrClass)
    trEl = document.getElementById(nrClass)
    //alert(trEl);
    //var WnT = $(trEl).find(".itemWeightInput").attr('value')
    $(trEl).remove();

    var bCount = $('span.basketCount').html();
    bCount = (bCount - 0)-1;
    $('span.basketCount').html(bCount);
    
    if($.cookie("basket")){
        //$.cookie("basket", null);
        
        var vars = "addItem('"+itemName+"', '"+char+"', '"+bPrice+"', '"+kfArray+"', '"+weight+"', '"+kr+"', '"+kf+"', '"+uid+"', '"+uidN+"', '"+edIzm+"', '"+flagN+"', 1)"
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

    $('tbody#lItemTab').find('tr:even').removeClass('odd');
    $('tbody#lItemTab').find('tr:odd').addClass('odd');
    
    $.cookie('basketWeight', null)
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
        if($(this).parent().parent().find('td.itemType').attr('name')=='т'){
            wAll = (wAll + (this.value-0))
        }
    
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
        //bP = bigRound($(this).attr('name')/(1-(k/100))).toFixed(2)
        //bP = bP.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ')+'.'+bP.split('.')[1]

        var cItemName = $(this).parent().parent().attr('id')
        var cEdIzm = $(this).parent().parent().find('td.itemType').html()

        var iPI = getItemPrice(cItemName, cEdIzm)
        $(this).attr('value',iPI)


        //$(this).attr('value',bP)
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
    
   
    return false
}


function isValidEmail(email){
    return (/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/).test(email);
}

function setWeight(nrClass, weight, count, ch){
    //alert(nrClass+' | '+weight+' | '+count+' | '+ch)
    if(ch!='-'){
        var ch = ch
    }
    var w = weight-0
    var c = count-0
    var cItem = document.getElementById(nrClass)
    //alert(cItem.innerHTML)
    var wInput = $(cItem).find('.itemWeightInput')
    var cInput = $(cItem).find('.itemCountInput')
    if(ch!='-'){
        var chInput = $(cItem).find('.itemCharInput')
    }

    $(".itemCharInput").change(function(){
        chi = this.value
        father = $(this).parent().parent()
        $(father).find($(".itemLengthInput")).attr("name", chi)
        father.find($(".itemCountInput")).change();
    })

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
            //var father; 
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
        if($(this).parent().parent().find('td.itemType').attr('name')=='т'){
            wAll = (wAll + (this.value-0))
        }

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
        // bP = bigRound($(this).attr('name')/(1-(k/100))).toFixed(2)
        // bP = bP.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ')+'.'+bP.split('.')[1]
        // $(this).attr('value',bP)
        var cItemName = $(this).parent().parent().attr('id')
        var cEdIzm = $(this).parent().parent().find('td.itemType').html()

        var iPI = getItemPrice(cItemName, cEdIzm)
        $(this).attr('value',iPI)
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
      
      $.cookie('basketWeight', null)
      var wBasket = new Array()
      $('.itemTR').each( function(){
        var nrClassName = $(this).attr('id')
        var wInput = $(this).find('input.itemWeightInput').attr('value')
        var cInput = $(this).find('input.itemCountInput').attr('value')
        if($(this).find('input.itemCharInput').length){
            var chInput = $(this).find('input.itemCharInput').attr('value')
            wBasketItem = "setWeight('"+nrClassName+"','"+wInput+"','"+cInput+"','"+chInput+"')"
        } else {
            wBasketItem = "setWeight('"+nrClassName+"','"+wInput+"','"+cInput+"','-')"
        }
        
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

    if(ch!='-'){
        $(chInput).attr('value', ch)
        $(chInput).change()
    }
    if(count!='--'){
        $(cInput).attr('value', c)
        $(cInput).change()
    } else {
        $(wInput).attr('value', w)
        //alert(wInput.innerHTML)
        //alert('wInput set? oO')
        //alert($(wInput).attr('value'))
    //$(cItem).find('input.itemWeightInput').change()
        $(wInput).change()
    }
    
}

