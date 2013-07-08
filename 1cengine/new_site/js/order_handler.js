/// отправка заказа на сервер 1с ///

function sendOrder(orderString) {

    if($('#selfCarry').is(':checked') == false) {
        if($('#destination').val() != "--") {
            destination = $('input#destination').val()
            delivery_cost = $("#delivery_cost").html()
        } else {
            destination = ''
            delivery_cost = ''
        }
        if($('#sFormChecked').find('input:checked').val() != "--") {
            carry = $('#sFormChecked').find('input:checked').val()
        } else {
            carry = ''
        }
    } else {
        destination = ''
        carry = ''
        delivery_cost = ''
    }


    email = $('input#emailInput').val()
    if(email != '') {
        if(isValidEmail(email) == false) {
            // $.unblockUI()
            alert('Проверьте правильность адреса электронной почты')
            return null
        }
    }
    main_phone = $('#mainPhoneInput').val()

    last_name = $('#lastNameInput').val()
    name_surname = $('#nameSurnameInput').val()
    other_phone = $('#otherPhoneInput').val()

    ret = ''

    $.ajax({
        type: "POST",
        url: "createOrder.php",
        async: true,
        data: "orderString=" + orderString + "&carry=" + carry + "&destination=" + destination + "&email=" + email + "&delivery_cost=" + delivery_cost + "&main_phone=" + main_phone + "&other_phone=" + other_phone + "&name_surname=" + name_surname + "&last_name=" + last_name,
        success: function(html) {
            //var success = 'true';
            ret = 'номер ' + html
            $("#popUpOrderClose").show()
            $(".oInProcess").hide()
            $(".oProcessed").show()

            $("#basketCaption").empty()

            order = ret

            var oA = order.split(",")
            $("#basketCaption").append("Заказ " + oA[0])

            $("#switchOrderDiv").click()

            return ret

        }
    });
    //alert(ret)
    return ret
}

/// создание заказа клиента ///
$("#sendOrderButtom").click(function() {
    createOrder()
})

function createOrder() {
    if($("#emailInput").val() == "") {
        // $.unblockUI()
        $("#switchNotificationDiv").click()
        $("#emailInput").focus()
    } else if($("#mainPhoneInput").val() == "") {
        // $.unblockUI()
        $("#switchNotificationDiv").click()
        $("#phoneMainInput").focus()
    } else {
        $.blockUI.defaults.css.borderRadius = '10px'; //убираем серую границу
        $.blockUI.defaults.fadeIn = 100; //ускоряем появление
        $.blockUI.defaults.fadeOut = 100; //и исчезновение
        //$.blockUI.defaults.css.left = '39%'; //окно будет в центре
        $.blockUI.defaults.css.backgroundColor = 'white'
        $.blockUI.defaults.css.cursor = 'defaults'
        $.blockUI.defaults.css.boxShadow = '0px 0px 5px 5px rgb(207, 207, 207)'
        $.blockUI.defaults.css.fontSize = '14px'
        $.blockUI.defaults.css.width = '450px'
        $.blockUI.defaults.css.height = '220px'
        $.blockUI.defaults.css.paddingTop = '10px'
        $.blockUI({
            message: "<span class='oInProcess' style='margin-top:50px;font-size:16px'>Ваш запрос обрабатывается</span><span class='oProcessed' style='display:none;margin-top:50px;font-size:16px'>Ваш запрос обработан</span><div style='disply:block;margin-top:70px'><a href='' onClick='$.unblockUI(); return false' id='popUpOrderClose' style='display:none;cursor:pointer;'>Закрыть</a></div>"
        })
        var sendRow = '';
        $('tr.itemTr').each(function() {

            if($(this).find('input.itemCharInput').length != 0) {
                sendRow += '' + $(this).find('input.itemCharInput').val() + ':' + $(this).attr('name') + ':-:' + $(this).find('input.itemCountInput').val() + ':' + $(this).find('.itemPriceTd').html() + ';';
            } else {
                sendRow += '' + $(this).attr('name') + ':-:' + $(this).find('input.itemCountInput').val() + ':' + $(this).find('.itemPriceTd').html() + ';';
            }

        })
        var order = sendOrder(sendRow);

    }

}

/// получить заказ клиента ///

function getOrder(uid) {
    $.ajax({
        type: "POST",
        url: "/1cengine/py_scripts/getOrder.php", // !!! CHECK IT !X!
        data: "uid=" + uid + "",
        success: function(html) {

            // alert(html)
            parseOrder(html)

        }
    });
}

/// парсер заказа для отображения заказа клиента ///

function parseOrder(order) {

    orderArray = order.split("||");
    orderNum = orderArray[0]
    orderEdit = orderArray[1]
    orderItems = orderArray[2]

    itemsArray = orderItems.split(";");

    $("#basketCaption").html("Заказ " + orderNum)

    rows = ""
    var j = 1
    for(var i in itemsArray) {
        var item = itemsArray[i];
        if(item != "") {
            var itemArray = item.split(":")
            var itemSum = (itemArray[3] * itemArray[4]).toFixed(2)
            var nds = (((itemSum - 0) / 118) * 18).toFixed(2)


            hSum = itemSum.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ') + '.' + itemSum.split('.')[1]
            nds = nds.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ') + '.' + nds.split('.')[1]

            rows += '<tr class="itemTr" name="' + itemArray[0] + ':' + itemArray[1] + '">'
            rows += '<td>' + j + '</td>'
            rows += '<td class="itemNameTd">' + itemArray[5] + '</td>'
            rows += '<td class="itemCharTd">' + itemArray[6] + '</td>'
            rows += '<td class="itemCountTd">' + itemArray[3] + '</td>'
            rows += '<td class="itemEdIzmTd">' + itemArray[7] + '</td>'
            rows += '<td class="itemPriceTd">' + itemArray[4] + '</td>'
            rows += '<td class="itemNdsKfTd">' + '18%' + '</td>'
            rows += '<td class="itemNdsTd">' + nds + '</td>'
            rows += '<td class="itemSumTd">' + hSum + '</td>'
            rows += '</tr>'
            j++;
        }

    }

    $("#lItemTab").html(rows);

    wAll = 0
    sAll = 0
    nAll = 0
    $(".itemTr").each(function() {
        if($(this).find('.itemEdIzmTd').html() == "т") {
            wAll = wAll + ($(this).find('.itemCountTd').html() - 0)
        }
        sAll = sAll + ($(this).find('.itemSumTd').html().replace(/\s/g, '') - 0)
        nAll = nAll + ($(this).find('.itemNdsTd').html().replace(/\s/g, '') - 0)
        // alert($(this).find('.itemSumTd').html())
    })

    sAll = sAll.toFixed(2)
    nAll = nAll.toFixed(2)

    sAll = sAll.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ') + '.' + sAll.split('.')[1]
    nAll = nAll.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ') + '.' + nAll.split('.')[1]

    $("#CountAll").html(wAll)
    $("#SumAll").html(sAll)
    $("#NDSAll").html(nAll)

    $(".basketCount").html(j - 1)

    $("#tabBasket").click()
}

/// Открытие файла заказа ///

function openLink(linkUID, type) {
    $.ajax({
        type: "POST",
        url: "/1cengine/py_scripts/getfilelink.php",
        async: false,
        data: "linkUID=" + linkUID + "&type=" + type + "",
        success: function(html) {
            //var success = 'true';
            window.location.href = html
            // alert(html)
        }
    });
}

/// не могу найти референса к этому. по крайней мере ещё ///

function getOrderFomat(format) {
    var sendRow = '';
    $('tr.itemTr').each(function() {

        if($(this).find('input.itemCharInput').length != 0) {
            sendRow += '' + $(this).find('input.itemCharInput').val() + ':' + $(this).attr('name') + ':-:' + $(this).find('input.itemCountInput').val() + ':' + $(this).find('.itemPriceTd').html() + ';';
        } else {
            sendRow += '' + $(this).attr('name') + ':-:' + $(this).find('input.itemCountInput').val() + ':' + $(this).find('.itemPriceTd').html() + ';';
        }

    })
    var order = sendOrder(sendRow);
    var q = order.split(',')

    openLink(q[1], format)
}

/// Кнопка показать НДС ///
$("#showNds").change(function() {
    // alert($("#showNds").attr("checked"))
    if($("#showNds").attr("checked") == "checked") {
        $(".NDSHeader, .itemNdsSumTd, .itemNdsKfTd, .ndsAllsum").show()
    } else {
        $(".NDSHeader, .itemNdsSumTd, .itemNdsKfTd, .ndsAllsum").hide()
    }
})