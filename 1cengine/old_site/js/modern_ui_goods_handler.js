/// получить характеристику товара по хеш коду ///

function getItemChar(hash) {
    ret = ''
    $.ajax({
        type: "POST",
        url: "/1cengine/py_scripts/get_item_char.py",
        async: false,
        data: "item_hash=" + hash,
        success: function(html) {
            ret = html
            return ret
        }
    });
    return ret
}

/// установка веса при редактировании ///

function setModalWeight() {
    if($(".itemPWeightInput").val() != undefined) {
        father = $(".itemPWeightInput").parent().parent()
        cW = $(".itemPWeightInput").val()


        var pricesArray = $(".TNPrice").attr("name").split('|');

        var wAll = $(".itemPWeightInput").val() - 0
        //var edIzm = $(".popUpTab").attr("name")
        if(wAll < 2) {
            k = 0
        } else if(wAll >= 2 && wAll < 8) {
            k = 1
        } else if(wAll >= 8 && wAll < 15) {
            k = 2
        } else if(wAll >= 15) {
            k = 3
        }


        TN = pricesArray[k]
        $(".TNPrice").html(TN)
        var itemKf = $(".itemPCountInput").attr("name")
        var itemLength = $(".itemPLengthInput").attr("name")
        var itemWeight = $(".itemPWeightInput").attr("name")
        if(itemLength != 0) {
            //alert(itemWeight*itemLength)
            var PC = Math.round((TN / 1000) * Math.round(itemWeight * itemLength * 1000) * itemKf * 100) / 100;
            var PM = Math.round((PC / (itemLength)) * itemKf * 100) / 100;

        } else {
            var PC = '--'
            var PM = '--'
        }
        $(".PCPrice").html(PC)
        $(".PMPrice").html(PM)
        sum = (cW * TN).toFixed(2)
        hSum = sum.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ') + '.' + sum.split('.')[1]
        $("#popUpSpanItog").html(hSum)
    }
}

/// установка длины при редактировании ///

function setModalLength() {


    cKr = $(".itemPLengthInput").val()
    father = $(".itemPLengthInput").parent().parent()


    //alert($(".TNPrice").attr("name"))
    var pricesArray = $(".TNPrice").attr("name").split('|');

    var wAll = $(".itemPLengthInput").val() - 0
    //var edZim = $(".popUpTab").attr("name")
    if(wAll < 100) {
        k = 0
    } else if(wAll >= 100 && wAll < 200) {
        k = 1
    } else if(wAll >= 200) {
        k = 2
    }

    TN = pricesArray[k]
    $(".TNPrice").html(TN)
    var itemKf = $(".itemPCountInput").attr("name")
    var itemLength = $(".itemPCharInput").val()

    if(itemLength != 0) {
        //alert(itemWeight*itemLength)
        var PC = Math.round(TN * itemLength * 100) / 100;

    } else {
        var PC = '--'
    }

    var itemSM = $(".SMPrice").attr("name") - 0

    if($(".SMPrice").attr("name") != undefined) {
        var SM = Math.round(TN / itemSM * 100) / 100;
        $(".SMPrice").html(SM)
        // alert($(".SMPrice").attr("name"))
        sum = (cKr * TN).toFixed(2)
        hSum = sum.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ') + '.' + sum.split('.')[1]
        $("#popUpSpanItog").html(hSum)
    }

    $(".pPCPrice").html(PC)
}

/// вызов окна товара ///

function openItem(hash, edIzm, prices, stock, c) {
    i = 0
    $('tr[class="itemTr"]').each(function() {

        if($(this).attr("name") == hash) {

            if($(this).find(".itemCharTd").html() == $(this).find(".itemCharTd").attr("name")) {

                modern_editItem(hash)
            } else {
                showModalItem(hash, edIzm, prices, stock, c)
            }

            i = 1
            return 0
        }
    })
    if(i != 1) {
        showModalItem(hash, edIzm, prices, stock, c)
    }

}

/// всплывающее окно товара с редактированием ///

function showModalItem(hash, edIzm, prices, stock, c) {
    
    if(c == undefined) {
        c = "n"
    }
    // alert('nya')
    var mesDiv = '';
    $('tr[id="' + hash + '"]').each(function() {

        var iC = getItemChar(hash)
        var iCArray = iC.split("|")
        var itemLength = iCArray[0]
        var itemWeight = iCArray[1] / 1000
        var itemKf = iCArray[2]

        var pricesArray = prices.split('|');

        TN = pricesArray[0]

        if(itemLength != 0) {
            //alert(itemWeight*itemLength)
            var PC = Math.round((TN / 1000) * Math.round(itemWeight * itemLength * 1000) * itemKf * 100) / 100;
            var PM = Math.round((PC / (itemLength)) * itemKf * 100) / 100;
        } else {

            var PC = '--'
            var PM = '--'

        }

        if(hash.split(':')[0] == '0') {

            dL = $(this).find(".itemName").attr("name")
            dL = dL.match(/\(.+\)/) + ""
            dL = dL.replace(/\(/, "")
            dL = dL.replace(/\)/, "")
            smK = dL.replace(/,/, ".")
            dL = dL + " м"
            //alert(smK)
            SM = Math.round((TN - 0) / (smK - 0) * 100) / 100
            //alert(SM)
            mesDiv += '<div><p style="font-weight:bold">' + $(this).find(".itemName").attr("name") + ' ' + $(this).find(".itemChar").attr("name") + '<a href="Выбрать другой товар" onClick="$.unblockUI(); return false" class="popUpCancelA">x</a></p>';
            if(stock == '0') {
                mesDiv += '<div style="font-size:10px;color:red;margin-top:-5px;">*Товара нет в наличие, о сроках заказа уточняйте у оператора</div>'
            }


            //mesDiv += '<img src="profnastilSample.gif" />'
            mesDiv += '<div style="width:370px;height:150px">'
            mesDiv += '<div style="margin-top:50px;float:left;margin-left:10px">' + dL + '</div>'
            mesDiv += '<div class="profnastilImageBase"></div>'
            mesDiv += '<div class="profnastilImageAdd2" style="display:block;"></div>'
            mesDiv += '<div class="profnastilImageAdd3"></div>'
            mesDiv += '<div class="profnastilImageAdd4"></div>'
            mesDiv += '<div class="profnastilImageAdd5"></div>'
            mesDiv += '<div class="profnastilImageAdd6"></div>'
            mesDiv += '</div>'

            mesDiv += '<div style="height:15px;width:370px"><span style="float:left;margin-top:-4px;margin-left:50px">0.2</span> <div id="slider-vertical"></div> <span style="float:right;margin-top:-16px">6</span></div>';

            mesDiv += '<p>Длина листа <input class="pUi itemPCharInput" id="amount" value="2"> метра</p>'


            mesDiv += '<table class="popUpTab" name="' + edIzm + '"><tr><td>Цена за пог. метр:</td><td class="TNPrice" name="' + prices + '">' + TN + '</td><td><input class="pUi itemPLengthInput" value="0" name="2" oname="2" /> пог. метр</td></tr>';
            mesDiv += '<tr><td>за кв. метр:</td><td class="SMPrice" name="' + smK + '">' + SM + '</td><td><input class="pUi itemSQuareInput" name="' + smK + '" /> кв. метр</td></tr>';
            mesDiv += '<tr><td>за лист:</td><td class="pPCPrice">' + ( TN * 2 ) + '</td><td><input class="pUi itemPCountInput" name="' + itemKf + '" value="0" /> листов</td></tr>';
            mesDiv += '</table>';

            mesDiv += '<div>Итого: <span id="popUpSpanItog"></span> руб.</div>'

            mesDiv += '<div style="margin-top:10px">';

            if(c == "c") {
                mesDiv += '<span class="popUpContinue"><a href="Изменить" onClick="changeItem(\'' + hash + '\'); return false">Изменить</a></span></div>';
            } else if(c == "n") {
                mesDiv += '<span class="popUpContinue"><a href="Добавить в корзину" onClick="modern_addItem(\'' + hash + '\',\'' + edIzm + '\',\'' + prices + '\'); return false">В корзину</a></span></div>';
            }

            mesDiv += '</div>';

            $.blockUI.defaults.css.borderRadius = '10px'; //убираем серую границу
            $.blockUI.defaults.fadeIn = 100; //ускоряем появление
            $.blockUI.defaults.fadeOut = 100; //и исчезновение
            //$.blockUI.defaults.css.left = '39%'; //окно будет в центре
            $.blockUI.defaults.css.backgroundColor = 'white'
            $.blockUI.defaults.css.cursor = 'defaults'
            $.blockUI.defaults.css.boxShadow = '0px 0px 5px 5px rgb(207, 207, 207)'
            $.blockUI.defaults.css.fontSize = '14px'
            $.blockUI.defaults.css.width = '400px'
            $.blockUI.defaults.css.height = '420px'
            $.blockUI.defaults.css.paddingTop = '10px'


        } else {
            mesDiv += '<div><p style="font-weight:bold">' + $(this).find(".itemName").attr("name") + ' ' + $(this).find(".itemChar").attr("name") + '<a href="Выбрать другой товар" onClick="$.unblockUI(); return false" class="popUpCancelA">x</a></p>';
            if(stock == '0') {
                mesDiv += '<div style="font-size:10px;color:red;margin-top:-5px">*Товара нет в наличие, о сроках заказа уточняйте у оператора</div>'
            }
            var itChar = $(this).find(".itemChar").attr("name")
            itChar = itChar.replace(/,/, ".")
            itChar = itChar - 0
            var itName = $(this).find(".itemName").attr("name")
            // alert(itName.indexOf("Арматура"))
            if(itName.indexOf("Арматура") != -1 && isNaN(itChar)!=true) {
                // alert(1)
                mesDiv += "<div class='armaImages'>"
                mesDiv += "<div class='armaImage im1'></div>"
                mesDiv += "<div class='armaImage im2'></div>"
                mesDiv += "<div class='armaImage im3'></div>"
                mesDiv += "<div class='armaImage im4'></div>"
                mesDiv += "<div class='armaImage im5'></div>"
                mesDiv += "<div class='armaImage im6'></div>"
                mesDiv += "<div class='armaImage im7'></div>"
                mesDiv += "<div class='armaImage im8'></div>"
                mesDiv += "<div class='armaImage im9'></div>"
                mesDiv += "<div class='armaImage im10'></div>"
                mesDiv += "<div class='armaImage im11'></div>"
                mesDiv += "<div class='armaImage im12'></div>"
                mesDiv += "<div class='armaImage im13'></div>"
                mesDiv += "<div class='armaImage im14'></div>"
                mesDiv += "<div class='armaImage im15'></div>"
                mesDiv += "<div class='armaImage im16'></div>"
                mesDiv += "</div>"

                mesDiv += '<div style="height:15px;width:390px"><span style="float:left;margin-top:-4px;margin-left:50px">0.2</span> <div id="slider-vertical-arma"></div> <span style="float:right;margin-top:-16px">' + $(this).find(".itemChar").attr("name") + '</span></div>';

                mesDiv += '<p>Длина арматуры <input class="pUi itemArmaCharInput" id="amountArma" value="itChar"> метра</p>'
            }
            // mesDiv += '<table><tr><td>'
            mesDiv += '<table class="popUpTab" name="' + edIzm + '"><tr><td>Цена за тонну:</td><td class="TNPrice" name="' + prices + '">' + TN + '</td><td><input class="pUi itemPWeightInput" value="0" name="' + itemWeight + '" oname="' + itemWeight + '" /> тонн </td></tr>';
            mesDiv += '<tr><td>за штуку:</td><td class="PCPrice">' + PC + '</td><td><input class="pUi itemPCountInput" name="' + itemKf + '" value="0" /> штук по <span class="itemCharSpan">' + $(this).find(".itemChar").attr("name") + '</span> метра </td></tr>';
            mesDiv += '<tr><td>за метр:</td><td class="PMPrice">' + PM + '</td><td><input class="pUi itemPLengthInput" value="0" name="' + itemLength + '" /> метра </td></tr></table>';

            mesDiv += '<div>Итого: <span id="popUpSpanItog"></span> руб.</div>'


            mesDiv += '<div>Стоимость резки: <span id="slicePrice" name="0"></span> руб.</div>'
            mesDiv += '<div style="display:none">Остаток: <span id="sliceLeft"></span> м.</div>'


            mesDiv += '<div style="margin-top:30px">';

            if(c == "c") {
                mesDiv += '<span class="popUpContinue"><a href="Изменить" onClick="changeItem(\'' + hash + '\'); return false">Изменить</a></span></div>';
            } else if(c == "n") {
                mesDiv += '<span class="popUpContinue"><a href="Добавить в корзину" onClick="modern_addItem(\'' + hash + '\',\'' + edIzm + '\',\'' + prices + '\'); return false">В корзину</a></span></div>';
            }

            mesDiv += '</div>';

            $.blockUI.defaults.css.borderRadius = '10px'; //убираем серую границу
            $.blockUI.defaults.fadeIn = 100; //ускоряем появление
            $.blockUI.defaults.fadeOut = 100; //и исчезновение
            //$.blockUI.defaults.css.left = '39%'; //окно будет в центре
            $.blockUI.defaults.css.backgroundColor = 'white'
            $.blockUI.defaults.css.cursor = 'defaults'
            $.blockUI.defaults.css.boxShadow = '0px 0px 5px 5px rgb(207, 207, 207)'
            $.blockUI.defaults.css.fontSize = '14px'
            $.blockUI.defaults.css.width = '450px'
            $.blockUI.defaults.css.height = 'auto'
            $.blockUI.defaults.css.paddingTop = '10px'
            $.blockUI.defaults.css.paddingBottom = '10px'
        }

    })

    // alert("double-nya")

    $.blockUI({
        message: mesDiv
    });
    $(".blockMsg").draggable();



    if($(".itemPLengthInput").attr("name") != undefined) {
        var itChar = $(".itemPLengthInput").attr("name")
        itChar = itChar.replace(/,/, ".")
        itChar = itChar - 0
    }


    $(function() {
        $("#slider-vertical").slider({
            range: "min",
            min: 0.2,
            max: 6,
            value: 2,
            step: 0.1,
            slide: function(event, ui) {
                $("#amount").val(ui.value);
                $("#amount").change()
            }
        });
        $("#amount").val($("#slider-vertical").slider("value"));

    });

    $(function() {
        $("#slider-vertical-arma").slider({
            range: "min",
            min: 0.2,
            max: itChar,
            value: itChar,
            step: 0.1,
            slide: function(event, ui) {
                $("#amountArma").val(ui.value);
                $("#amountArma").change()
            }
        });
        $("#amountArma").val($("#slider-vertical-arma").slider("value"));

    });

    $(".itemArmaCharInput").change(function() {
        ch = this.value
        ch = ch.replace(/,/, ".")
        ch = ch.match(/\d+\.\d{0,2}|\d+/)
        if((ch - 0) < 0.2) {
            //alert(1)
            ch = 0.2

        } else if((ch - 0) > itChar) {
            //alert(2)
            ch = itChar

        } else {
            ch = ch

        }

        var step = itChar / 8

        if((ch - 0) < step * 2) {
            $(".im3, .im4, .im5, .im6, .im7, .im8, .im9, .im10, .im11, .im12, .im13, .im14, .im15, .im16").removeClass("armaImage").addClass("armaImageU")
        } else if((ch - 0) >= step * 2 && (ch - 0) < step * 3) {
            $(".im5, .im6, .im7, .im8, .im9, .im10, .im11, .im12, .im13, .im14, .im15, .im16").removeClass("armaImage").addClass("armaImageU")
            $(".im3, .im4").removeClass("armaImageU").addClass("armaImage")
        } else if((ch - 0) >= step * 3 && (ch - 0) < step * 4) {
            $(".im7, .im8, .im9, .im10, .im11, .im12, .im13, .im14, .im15, .im16").removeClass("armaImage").addClass("armaImageU")
            $(".im3, .im4, .im5, .im6").removeClass("armaImageU").addClass("armaImage")
        } else if((ch - 0) >= step * 4 && (ch - 0) < step * 5) {
            $(".im9, .im10, .im11, .im12, .im13, .im14, .im15, .im16").removeClass("armaImage").addClass("armaImageU")
            $(".im3, .im4, .im5, .im6, .im7, .im8").removeClass("armaImageU").addClass("armaImage")
        } else if((ch - 0) >= step * 5 && (ch - 0) < step * 6) {
            $(".im11, .im12, .im13, .im14, .im15, .im16").removeClass("armaImage").addClass("armaImageU")
            $(".im3, .im4, .im5, .im6, .im7, .im8, .im9, .im10").removeClass("armaImageU").addClass("armaImage")
        } else if((ch - 0) >= step * 6 && (ch - 0) < step * 7) {
            $(".im13, .im14, .im15, .im16").removeClass("armaImage").addClass("armaImageU")
            $(".im3, .im4, .im5, .im6, .im7, .im8, .im9, .im10, .im11, .im12").removeClass("armaImageU").addClass("armaImage")
        } else if((ch - 0) >= step * 7 && (ch - 0) < step * 8) {
            $(".im15, .im16").removeClass("armaImage").addClass("armaImageU")
            $(".im3, .im4, .im5, .im6, .im7, .im8, .im9, .im10, .im11, .im12, .im13, .im14").removeClass("armaImageU").addClass("armaImage")
        } else if((ch - 0) == step * 8) {
            $(".im3, .im4, .im5, .im6, .im7, .im8, .im9, .im10, .im11, .im12, .im13, .im14, .im15, .im16").removeClass("armaImageU").addClass("armaImage")
        }



        if(ch == itChar) {
            $("#slicePrice").empty()

            $("#sliceLeft").empty()
            $("#sliceLeft").attr("name", "0")
            $("#slicePrice").attr("name", "0")
        } else {
            var lCh = (itChar - 0) - (ch - 0)
            $("#sliceLeft").attr("name", lCh)

            $("#slicePrice").attr("name", "20")
            var rezka = ($(".itemPCountInput").val() - 0) * 20
            $("#slicePrice").html(rezka)
        }



        $(".itemArmaCharInput").val(ch)

        $("#slider-vertical-arma").slider("value", ch)
        $(".itemCharSpan").html("" + ch + "")
        $(".itemPLengthInput").attr("name", ch)
        $(".itemPCountInput").change()
    })


    $(".itemPCharInput").change(function() {
        ch = this.value
        ch = ch.replace(/,/, ".")
        ch = ch.match(/\d+\.\d{0,2}|\d+/)
        if((ch - 0) < 0.2) {
            //alert(1)
            ch = 0.2
        } else if((ch - 0) > 6) {
            //alert(2)
            ch = 6
        } else {
            ch = ch
        }

        if((ch - 0) < 2) {
            $(".profnastilImageAdd2, .profnastilImageAdd3, .profnastilImageAdd4, .profnastilImageAdd5, .profnastilImageAdd6").hide()
        } else if((ch - 0) >= 2 && (ch - 0) < 3) {
            $(".profnastilImageAdd3, .profnastilImageAdd4, .profnastilImageAdd5, .profnastilImageAdd6").hide()
            $(".profnastilImageAdd2").show()
        } else if((ch - 0) >= 3 && (ch - 0) < 4) {
            $(".profnastilImageAdd4, .profnastilImageAdd5, .profnastilImageAdd6").hide()
            $(".profnastilImageAdd2, .profnastilImageAdd3").show()
        } else if((ch - 0) >= 4 && (ch - 0) < 5) {
            $(".profnastilImageAdd5, .profnastilImageAdd6").hide()
            $(".profnastilImageAdd2, .profnastilImageAdd3, .profnastilImageAdd4").show()
        } else if((ch - 0) >= 5 && (ch - 0) < 6) {
            $(".profnastilImageAdd6").hide()
            $(".profnastilImageAdd2, .profnastilImageAdd3, .profnastilImageAdd4, .profnastilImageAdd5").show()
        } else if((ch - 0) == 6) {
            $(".profnastilImageAdd2, .profnastilImageAdd3, .profnastilImageAdd4, .profnastilImageAdd5, .profnastilImageAdd6").show()
        }

        $(".itemPCharInput").val(ch)
        father = $(this).parent().parent().parent()
        $(father).find(".itemPLengthInput").attr("name", ch)

        var nL = this.value.length * 10
        nL = nL + "px"
        //alert(nL)
        $(this).css("width", nL);

        //father.find($(".itemPCountInput")).change();
        $("#slider-vertical").slider("value", ch)
        $(father).find(".itemPLengthInput").change();
        $(father).find(".itemSQuareInput").change()
    })

    $(".itemPCountInput").change(function() {
        num = this.value
        //num = num.match(/\d+/)
        father = $(this).parent().parent().parent()
        if(num != '--') {
            var div = num % 1
            if(div != 0) {
                num = ((num - num % 1) + 1)
            } else {
                num = num
            }
            //var father; 
            var wN;
            var krN;

            $('.itemPCountInput').val(num)
            //alert(this.value.length + " | " + this.size + " | " + $(this).css("width").replace(/px/, "")-0)
            var nL = 10 + this.value.length * 10
            nL = nL + "px"
            //alert(nL)
            $(this).css("width", nL);

            if($("#slicePrice").attr("name") != undefined) {
                if($("#slicePrice").attr("name") == "20") {
                    // alert($("#itemPCountInput").val())
                    var rezka = ($(".itemPCountInput").val() - 0) * 20

                    var rezkaLeft = ($(".itemPCountInput").val() - 0) * ($("#sliceLeft").attr("name") - 0)
                    $("#slicePrice").html(rezka)
                    $("#sliceLeft").html(rezkaLeft)

                }

            }

            if($(father).find($(".itemPLengthInput")).attr('name') != 0) {
                wN = num * $(father).find(".itemPWeightInput").attr('name') * $(father).find(".itemPLengthInput").attr('name')
                krN = num * $(father).find(".itemPLengthInput").attr('name')
                var oldWn = $(father).find(".itemPWeightInput").val()
                $(father).find(".itemPWeightInput").val((wN).toFixed(3))
                var nL = (wN.toFixed(3) + '').length * 10
                nL = nL + "px"
                //alert('weight ' + nL)
                $(father).find(".itemPWeightInput").css("width", nL);

                $(father).find(".itemPLengthInput").val((krN).toFixed(2))
                var nL = (krN.toFixed(2) + '').length * 10
                nL = nL + "px"
                //alert('length ' + krN + " " + nL)
                $(father).find(".itemPLengthInput").css("width", nL);

                $(father).find(".itemSQuareInput").val(((krN).toFixed(2) * ($(".itemSQuareInput").attr('name') - 0)).toFixed(3))
                var nL = (krN.toFixed(3) + '').length * 10
                nL = nL + "px"
                //alert(nL)
                $(father).find(".itemSQuareInput").css("width", nL);

                setModalWeight()
                setModalLength()

            } else {
                $(father).find(".itemPCountInput").val('--')
                $(father).find(".itemPLengthInput").val('--')
                $(father).find(".itemPWeightInput").val((wN).toFixed(3))

            }
        }
    })

    $(".itemSQuareInput").change(function() {


        sQ = this.value
        sQ = sQ.replace(/,/, ".")
        sQ = sQ.match(/\d+\.\d{0,3}|\d+/)

        $(this).val(sQ)

        var nL = this.value - 0
        nL = nL.toFixed(2) + ""
        nL = nL.length * 10
        nL = nL + "px"
        //alert(nL)
        $(this).css("width", nL);



        var father;
        father = $(this).parent().parent().parent()

        var cLength = ($(this).val() - 0) / ($(this).attr("name") - 0)

        father.find($(".itemPLengthInput")).val(cLength)
        father.find($(".itemPLengthInput")).change();
    })

    $(".itemPWeightInput").change(function() {
        // wAll = 0
        // sAll = 0

        cW = this.value
        cW = cW.replace(/,/, ".")
        cW = cW.match(/\d+\.\d{0,3}|\d+/)

        $(this).val(cW)

        var nL = this.value.length * 10
        nL = nL + "px"
        //alert(nL)
        $(this).css("width", nL);

        var father;
        father = $(this).parent().parent().parent()

        weightName = father.find($(".itemPWeightInput")).attr('name')

        if(weightName != 0) {
            num = cW / (father.find($(".itemPWeightInput")).attr('name') * father.find($(".itemPLengthInput")).attr('name'))
            father.find($(".itemPCountInput")).val(num)
            father.find($(".itemPCountInput")).change();
            setModalWeight()

        } else {
            father.find($(".itemPCountInput")).val('--')
            father.find($(".itemPLengthInput")).val('--')
            father.find($(".itemPCountInput")).change();

        }


    })

    $(".itemPLengthInput").change(function() {
        // wAll = 0
        // sAll = 0
        cKr = this.value
        cKr = cKr.replace(/,/, ".")
        cKr = cKr.match(/\d+\.\d{0,2}|\d+/)

        $(this).val(cKr)

        var nL = this.value - 0
        nL = nL.toFixed(2) + ""
        nL = nL.length * 10
        nL = nL + "px"
        //alert(nL)
        $(this).css("width", nL);


        var father;
        father = $(this).parent().parent().parent()

        weightName = father.find($(".itemPLengthInput")).attr('name')

        if(weightName != 0) {
            num = cKr / father.find($(".itemPLengthInput")).attr('name')
            father.find($(".itemPCountInput")).val(num)
            father.find($(".itemPCountInput")).change();

            setModalLength()

        } else {
            father.find($(".itemPCountInput")).val('--')
            father.find($(".itemPLengthInput")).val('--')
            father.find($(".itemPCountInput")).change();
        }

    })

    $(".itemPCountInput").keyup(function() {
        var nL = this.value.length * 10
        nL = nL + "px"
        //alert(nL)
        $(this).css("width", nL);
    })

    $(".itemPWeightInput").keyup(function() {
        var nL = this.value.length * 10
        nL = nL + "px"
        //alert(nL)
        $(this).css("width", nL);
    })

    $(".itemPLengthInput").keyup(function() {
        var nL = this.value.length * 10
        nL = nL + "px"
        //alert(nL)
        $(this).css("width", nL);
    })
    $(".itemSQuareInput").keyup(function() {
        var nL = this.value.length * 10
        nL = nL + "px"
        //alert(nL)
        $(this).css("width", nL);
    })

}


/// установка цен товара при редактировании ///

function setOverallPrices() {
    wAll = 0
    wmAll = 0
    $(".itemCountInput").each(function() {
        if($(this).attr("name") == "пог. м") {
            wmAll = (wmAll + (this.value - 0))

        } else if($(this).attr("name") == "т") {
            wAll = (wAll + (this.value - 0))
        }

    });

    // alert(wAll + " | " + wmAll)
    km = 0
    k = 0


    if(wAll < 2) {
        k = 0
    } else if(wAll >= 2 && wAll < 8) {
        k = 1
    } else if(wAll >= 8 && wAll < 15) {
        k = 2
    } else if(wAll >= 15) {
        k = 3
    }


    if(wmAll < 100) {
        km = 0
    } else if(wmAll >= 100 && wmAll < 200) {
        km = 1
    } else if(wmAll >= 200) {
        km = 2
    }


    sAll = 0
    cAll = 0
    rAll = 0
    gAll = 0

    $(".itemPriceTd").each(function() {

        var father = $(this).parent();
        var count = $(father).find(".itemCountInput").val()
        var pricesArray = $(father).find(".itemPriceTd").attr("name").split('|');

        if($(father).find(".itemEdIzmTd").attr("name") == "пог. м") {


            // alert(km)
            $(father).find(".itemPriceTd").html(pricesArray[km]);
            var sum = ((pricesArray[km] - 0) * count).toFixed(2)
            var nds = (((sum - 0) / 118) * 18).toFixed(2)


            hSum = sum.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ') + '.' + sum.split('.')[1]
            nds = nds.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ') + '.' + nds.split('.')[1]
            $(father).find(".itemSumTd").html(hSum)
            $(father).find(".itemNdsSumTd").html(nds)

            sAll = (sAll - 0) + (sum - 0)
            gAll = (gAll - 0) + (sum - 0)

        } else {


            // alert(k)
            $(father).find(".itemPriceTd").html(pricesArray[k]);
            var count = $(father).find(".itemCountInput").val()
            var sum = ((pricesArray[k] - 0) * count).toFixed(2)
            var nds = (((sum - 0) / 118) * 18).toFixed(2)


            hSum = sum.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ') + '.' + sum.split('.')[1]
            nds = nds.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ') + '.' + nds.split('.')[1]
            $(father).find(".itemSumTd").html(hSum)
            $(father).find(".itemNdsSumTd").html(nds)

            sAll = (sAll - 0) + (sum - 0)
            gAll = (gAll - 0) + (sum - 0)

            cAll = (cAll - 0) + (count - 0)
        }



    })

    $(".itemRezkaTd").each(function() {
        if($(this).html() != "") {
            rAll = (rAll - 0) + (($(this).html() * 20) - 0)
        }
    })


    rAll = rAll.toFixed(2)
    cAll = cAll.toFixed(3)
    //sAll = sAll.toFixed(2)

    $("#SumAll").attr("name", sAll)


    // gAll = $("#SumAll").attr("name")
    gAll = gAll.toFixed(2)
    if($("#selfCarry").is(":checked")) {
        sAll = sAll.toFixed(2)
    } else {
        if($("#delivery_cost").html() != "") {
            sAll = ((sAll - 0) + ($("#delivery_cost").html().replace(/\s/g, "") - 0)).toFixed(2)
        } else {
            sAll = sAll.toFixed(2)
        }
    }

    nAll = ((sAll / 118) * 18).toFixed(2)

    nAll = nAll.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ') + '.' + nAll.split('.')[1]
    sAll = sAll.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ') + '.' + sAll.split('.')[1]
    cAll = cAll.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ') + '.' + cAll.split('.')[1]
    gAll = gAll.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ') + '.' + gAll.split('.')[1]
    rAll = rAll.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ') + '.' + rAll.split('.')[1]

    $("#CountAll").empty()
    $("#CountAll").append(cAll)

    $("#SumAll").empty()
    $("#SumAll").append(sAll)

    $("#SumGoods").empty()
    $("#SumGoods").append(gAll)

    $("#SumDelivery").empty()
    if($("#delivery_cost").html() != "") {
        $("#SumDelivery").append($("#delivery_cost").html())
    }

    $("#NDSAll").empty()
    $("#NDSAll").append(nAll)

    $("#SumRezka").empty()
    $("#SumRezka").append(rAll)

    $(".itemCountInput").change()

    $(".itemCountInput").change(function() {

        var father = $(this).parent().parent();

        wAll = 0
        wmAll = 0
        $(".itemCountInput").each(function() {
            if($(this).attr("name") == "пог. м") {
                wmAll = (wmAll + (this.value - 0))

            } else if($(this).attr("name") == "т") {
                wAll = (wAll + (this.value - 0))
            }

        });

        // alert(wAll + " | " + wmAll)
        km = 0
        k = 0


        if(wAll < 2) {
            k = 0
        } else if(wAll >= 2 && wAll < 8) {
            k = 1
        } else if(wAll >= 8 && wAll < 15) {
            k = 2
        } else if(wAll >= 15) {
            k = 3
        }


        if(wmAll < 100) {
            km = 0
        } else if(wmAll >= 100 && wmAll < 200) {
            km = 1
        } else if(wmAll >= 200) {
            km = 2
        }


        sAll = 0
        cAll = 0
        rAll = 0

        $(".itemPriceTd").each(function() {

            var father = $(this).parent();
            var count = $(father).find(".itemCountInput").val()
            var pricesArray = $(father).find(".itemPriceTd").attr("name").split('|');

            if($(father).find(".itemEdIzmTd").attr("name") == "пог. м") {


                // alert(km)
                $(father).find(".itemPriceTd").html(pricesArray[km]);
                var sum = ((pricesArray[km] - 0) * count).toFixed(2)
                var nds = (((sum - 0) / 118) * 18).toFixed(2)


                hSum = sum.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ') + '.' + sum.split('.')[1]
                nds = nds.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ') + '.' + nds.split('.')[1]
                $(father).find(".itemSumTd").html(hSum)
                $(father).find(".itemNdsSumTd").html(nds)

                sAll = (sAll - 0) + (sum - 0)

            } else {


                // alert(k)
                $(father).find(".itemPriceTd").html(pricesArray[k]);
                var count = $(father).find(".itemCountInput").val()
                var sum = ((pricesArray[k] - 0) * count).toFixed(2)
                var nds = (((sum - 0) / 118) * 18).toFixed(2)


                hSum = sum.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ') + '.' + sum.split('.')[1]
                nds = nds.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ') + '.' + nds.split('.')[1]
                $(father).find(".itemSumTd").html(hSum)
                $(father).find(".itemNdsSumTd").html(nds)

                sAll = (sAll - 0) + (sum - 0)

                cAll = (cAll - 0) + (count - 0)
            }

        })

        $(".itemRezkaTd").each(function() {
            if($(this).html() != "") {
                rAll = (rAll - 0) + (($(this).html() * 20) - 0)
            }
        })

        cAll = cAll.toFixed(3)
        //sAll = sAll.toFixed(2)
        rAll = rAll.toFixed(2)


        $("#SumAll").attr("name", sAll)

        if($("#selfCarry").is(":checked")) {
            sAll = sAll.toFixed(2)
        } else {
            if($("#delivery_cost").html() != "") {
                sAll = ((sAll - 0) + ($("#delivery_cost").html().replace(/\s/g, "") - 0)).toFixed(2)
            } else {
                sAll = sAll.toFixed(2)
            }
        }

        nAll = ((sAll / 118) * 18).toFixed(2)

        nAll = nAll.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ') + '.' + nAll.split('.')[1]
        sAll = sAll.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ') + '.' + sAll.split('.')[1]
        cAll = cAll.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ') + '.' + cAll.split('.')[1]
        rAll = rAll.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ') + '.' + rAll.split('.')[1]

        $("#CountAll").empty()
        $("#CountAll").append(cAll)

        $("#SumAll").empty()
        $("#SumAll").append(sAll)

        $("#NDSAll").empty()
        $("#NDSAll").append(nAll)

        $("#SumRezka").empty()
        $("#SumRezka").append(rAll)

        basket = ""


        $('tbody#lItemTab tr').each(function(i) {

            var ihash = $(this).attr("name")
            // if(ihash.split(":")[0]=="0"){
            //     var char = $(this).find(".itemCharTd").html()
            // } else {
            //     var char = ''
            // }
            var char = $(this).find(".itemCharTd").html()
            var rezka = $(this).find(".itemRezkaTd").html()


            var count = $(this).find(".itemCountInput").val()
            basket += "setModernItem('" + ihash + "','" + char + "','" + count + "','" + rezka + "');"

        });


        $.cookie("basket", basket)


    })
}

/// добавление товара в корзину ///

function modern_addItem(hash, edIzm, prices) {
    yaCounter15882208.reachGoal('onAddLinkPressed');
    weight = $(".itemPWeightInput").val()
    // if($("#slicePrice").attr("name")!=undefined){
    //     rezka = $("#SumRezka").html()
    //     rezka = (rezka - 0) + ($("#slicePrice").html() - 0)
    //     $("#SumRezka").html(rezka)
    // }
    char = ''

    ochar = $(".itemPLengthInput").attr("oname")

    rezkaCount = ""
    if(weight == undefined) {
        weight = $(".itemPLengthInput").val()
        char = $(".itemPCharInput").val()
    }
    if($(".itemArmaCharInput").val() != undefined) {
        char = $(".itemArmaCharInput").val()
        if($("#slicePrice").html() != "") {
            rezkaCount = $(".itemPCountInput").val() - 0
        } else {
            rezkaCount = ""
        }
    }
    $.unblockUI()

    var cell = "<tr class='itemTr' name='" + hash + "'><td></td>";

    $('tr[id="' + hash + '"]').each(function(index) {
        // alert(index)
        if(index == 0) {
            if(char == '') {
                char = $(this).find(".itemChar").attr("name")
            }
            cell += "<td class='itemNameTd'>" + $(this).find(".itemName").attr("name");
            cell += '<span class="delEdSpan">';
            cell += '<a href="Убрать из корзины" onClick="delModernItem(\'' + hash + '\'); return false">X</a>';

            cell += '<a href="#" onClick="modern_editItem(\'' + hash + '\'); return false"><img src="/1cengine/site/images/edit.png" /></a></span></td>';


            cell += "<td class='itemCharTd' name='" + ochar + "'>" + char + "</td>";

            cell += "<td class='itemCountTd'><input class='itemCountInput' name='" + edIzm + "' type='textarea' value='" + weight + "' disabled /></td>";
            cell += "<td class='itemEdIzmTd' name='" + edIzm + "'>" + edIzm + "</td>";
            cell += "<td class='itemPriceTd' name='" + prices + "'></td>";
            cell += "<td class='itemNdsKfTd'>18%</td>";
            cell += "<td class='itemNdsSumTd'></td>";
            cell += "<td class='itemSumTd'></td>";
            cell += "<td class='itemRezkaTd' style='display:none'>" + rezkaCount + "</td>";
        }

    })

    newRow = cell + '</tr>';


    var bCount = $('span.basketCount').html();
    bCount = (bCount - 0) + 1;
    $('span.basketCount').html(bCount);

    $('tr[class="itemTr"]').each(function() {

        if($(this).attr("name") == hash) {

            if($(this).find(".itemCharTd").html() == char) {

                delModernItem(hash, char)
            }


        }

    })
    $('tbody#lItemTab').prepend(newRow);


    basket = ""

    $('tbody#lItemTab tr').each(function(i) {
        var number = i + 1;
        $(this).find('td:first').text(number);


        var ihash = $(this).attr("name")
        // if(ihash.split(":")[0]=="0"){
        //     var char = $(this).find(".itemCharTd").html()
        // } else {
        //     var char = ''
        // }
        var char = $(this).find(".itemCharTd").html()
        var rezka = $(this).find(".itemRezkaTd").html()
        var count = $(this).find(".itemCountInput").val()
        basket += "setModernItem('" + ihash + "','" + char + "','" + count + "','" + rezka + "');"
    });

    $.cookie("basket", basket)

    setOverallPrices()

}

/// изменение товара в заказе ///

function modern_editItem(hash) {
    edIzm = $('tr[name="' + hash + '"]').find(".itemEdIzmTd").attr("name")
    prices = $('tr[name="' + hash + '"]').find(".itemPriceTd").attr("name")
    stock = "1"
    // alert("half-nya")
    // alert(1)
    showModalItem(hash, edIzm, prices, stock, "c")
    // alert(3)

    var countT = $('tr[name="' + hash + '"]').find(".itemCountInput").val() - 0
    var charT = $('tr[name="' + hash + '"]').find(".itemCharTd").html()
    if($(".itemPCharInput").val() != undefined) {
        $(".itemPCharInput").val(charT)
        $(".itemPCharInput").change()
    }
    if($(".itemArmaCharInput").val() != undefined) {
        $(".itemArmaCharInput").val(charT)
        $(".itemArmaCharInput").change()
    }
    if($(".itemPWeightInput").val() != undefined) {
        $(".itemPWeightInput").val(countT)
        $(".itemPWeightInput").change()
    } else if($(".itemPLengthInput").val() != undefined) {
        $(".itemPLengthInput").val(countT)
        $(".itemPLengthInput").change()
    }


}

function changeItem(hash) {
    weight = $(".itemPWeightInput").val()
    // if($("#slicePrice").attr("name")!=undefined){
    //     rezka = $("#SumRezka").html()
    //     rezka = (rezka - 0) + ($("#slicePrice").html() - 0)
    //     $("#SumRezka").html(rezka)
    // }
    char = ''
    if(weight == undefined) {
        weight = $(".itemPLengthInput").val()
        char = $(".itemPCharInput").val()
    }
    if($(".itemArmaCharInput").val() != undefined) {
        char = $(".itemArmaCharInput").val()
        if($("#slicePrice").html() != "") {
            rezkaCount = $(".itemPCountInput").val()
        } else {
            rezkaCount = ""
        }

    }
    $.unblockUI()
    $('tr[class="itemTr"]').each(function() {

        if($(this).attr("name") == hash) {
            $(this).find(".itemCountInput").val(weight)
            if(char != '') {
                $(this).find(".itemCharTd").html(char)
            }
            $(this).find(".itemRezkaTd").html(rezkaCount)
            $(this).find(".itemCountInput").change()
        }
    })
    setOverallPrices()
}

/// удаление товара из заказа ///

function delModernItem(hash, char) {

    if(char == undefined) {
        char = ''
    };
    itt = 0

    delElement = document.getElementById(hash)
    tab = document.createElement("tbody")

    // var basket = ""
    $('tr[class="itemTr"]').each(function() {

        if($(this).attr("name") == hash) {
            if(char != '') {
                if($(this).find(".itemCharTd").html() == char) {
                    $(this).remove()
                    itt = 1
                }
            } else {

                if(itt == 0) {
                    $(this).remove()
                    itt = 1
                }

            }

        } else {
            // var ihash = $(this).attr("name")
            // if(ihash.split(":")[0]=="0"){
            //     var char = $(this).find(".itemCharTd").html()
            // } else {
            //     var char = ''
            // }
            // var count = $(this).find(".itemCountInput").val()
            // basket += "setModernItem('"+ihash+"','"+char+"','"+count+"');"
        }

    })

    // $.cookie("basket", basket)
    basket = ""

    $('tbody#lItemTab tr').each(function(i) {
        var number = i + 1;
        $(this).find('td:first').text(number);

        var ihash = $(this).attr("name")
        // if(ihash.split(":")[0]=="0"){
        //     var char = $(this).find(".itemCharTd").html()
        // } else {
        //     var char = ''
        // }
        var char = $(this).find(".itemCharTd").html()
        var rezka = $(this).find(".itemRezkaTd").html()
        var count = $(this).find(".itemCountInput").val()
        basket += "setModernItem('" + ihash + "','" + char + "','" + count + "','" + rezka + "');"
    });

    var bCount = $('span.basketCount').html();
    bCount = (bCount - 0) - 1;

    $('span.basketCount').html(bCount);



    $.cookie("basket", null)
    $.cookie("basket", basket)

    setOverallPrices()

}

/// установка товара из заказа из куки ///

function setModernItem(hash, char, count, rezka) {
    // alert(1);
    $.ajax({
        type: "POST",

        url: "/1cengine/py_scripts/get_items_bs.py",

        async: false,
        data: "from_hash=true&hash=" + hash + "&char=" + char + "&count=" + count + "&rezka=" + rezka + "",
        success: function(html) {

            $("#lItemTab").append(html)
            basket = ""
            i = 0
            $('tbody#lItemTab tr').each(function(i) {
                var number = i + 1;
                $(this).find('td:first').text(number);

                var ihash = $(this).attr("name")
                // if(ihash.split(":")[0]=="0"){
                //     var char = $(this).find(".itemCharTd").html()
                // } else {
                //     var char = ''
                // }
                var char = $(this).find(".itemCharTd").html()
                var rezka = $(this).find(".itemRezkaTd").html()
                var count = $(this).find(".itemCountInput").val()
                basket += "setModernItem('" + ihash + "','" + char + "','" + count + "','" + rezka + "');"
            });

            $.cookie("basket", null)
            $.cookie("basket", basket)
            // var bCount = $('span.basketCount').html();
            bCount = $('tbody#lItemTab tr').length

            $('span.basketCount').html(bCount);

            setOverallPrices()
        }
    });
}
