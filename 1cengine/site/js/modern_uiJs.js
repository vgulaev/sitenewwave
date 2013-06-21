/// стрелочка промотать вверх страницы ///
$(function() {
    var e = $(".scrollTop");
    var speed = 500;

    e.click(function() {
        $("html:not(:animated)" + (!$.browser.opera ? ",body:not(:animated)" : "")).animate({
            scrollTop: 0
        }, 500);
        return false; //важно!  
    });
    //появление  


    function show_scrollTop() {
        ($(window).scrollTop() > 300) ? e.fadeIn(600) : e.hide();
    }
    $(window).scroll(function() {
        show_scrollTop()
    });
    show_scrollTop();
});

/// декодирование спец строк ///

function htmlspecialchars_decode(string, quote_style) {

    string = string.toString();

    // Always encode  
    string = string.replace('/&/g', '&');
    string = string.replace('/</g', '<');
    string = string.replace('/>/g', '>');

    // Encode depending on quote_style  
    if(quote_style == 'ENT_QUOTES') {
        string = string.replace('/"/g', '"');
        string = string.replace("/'/g", '\'');
    } else if(quote_style != 'ENT_NOQUOTES') {
        // All other cases (ENT_COMPAT, default, but not ENT_NOQUOTES)  
        string = string.replace('/"/g', '"');
    }

    return string;
}

/// проверка валидности емейла ///

function isValidEmail(str) {
    return(str.indexOf(".") > 2) && (str.indexOf("@") > 0);
}

/// переключение по табам корзины ///
$(function() {

    $("#closeBasket").click(function() {
        $('#basketDiv').hide()
        $('#pTableContentTab').show()
        $('#showPriceSpan').hide()
        $('#showBasketSpan').show()
    })

    $("#tabBasket").click(function() {

        $('#pTableContentTab').hide()
        $('#basketDiv').show()
        $('#showBasketSpan').hide()
        $('#showPriceSpan').show()
    })
    $("#tabPrice").click(function() {

        $('#basketDiv').hide()
        $('#pTableContentTab').show()
        $('#showPriceSpan').hide()
        $('#showBasketSpan').show()
    })

    $("#switchOrderDiv").click(function() {
        $("#orderDiv").show()
        $("#deliveryDiv").hide()
        $("#notificationDiv").hide()
        $("#switchOrderDiv").removeClass("inactiveDiv").addClass("activeDiv")
        $("#switchDeliveryDiv").removeClass("activeDiv").addClass("inactiveDiv")
        $("#switchNotificationDiv").removeClass("activeDiv").addClass("inactiveDiv")

        $("#showNDSlabel").show()
        return false
    })
    $("#switchDeliveryDiv").click(function() {
        $("#deliveryDiv").show()
        $("#orderDiv").hide()
        $("#notificationDiv").hide()
        $("#switchDeliveryDiv").removeClass("inactiveDiv").addClass("activeDiv")
        $("#switchOrderDiv").removeClass("activeDiv").addClass("inactiveDiv")
        $("#switchNotificationDiv").removeClass("activeDiv").addClass("inactiveDiv")

        $("#showNDSlabel").hide()
    })
    $("#switchNotificationDiv").click(function() {
        $("#notificationDiv").show()
        $("#deliveryDiv").hide()
        $("#orderDiv").hide()
        $("#switchNotificationDiv").removeClass("inactiveDiv").addClass("activeDiv")  
        $("#switchDeliveryDiv").removeClass("activeDiv").addClass("inactiveDiv")
        $("#switchOrderDiv").removeClass("activeDiv").addClass("inactiveDiv")

        $("#showNDSlabel").hide()
    })
    /// REWRITE IT PLEASE!!! ///
    /// into one function ///
});

/// показать группы товаров ///

function showGroups() {

    $.blockUI.defaults.css.borderRadius = '10px'; //убираем серую границу
    $.blockUI.defaults.fadeIn = 100; //ускоряем появление
    $.blockUI.defaults.fadeOut = 100; //и исчезновение
    //$.blockUI.defaults.css.left = '39%'; //окно будет в центре
    $.blockUI.defaults.css.backgroundColor = 'white'
    $.blockUI.defaults.css.cursor = 'defaults'
    $.blockUI.defaults.css.boxShadow = '0px 0px 5px 5px rgb(207, 207, 207)'
    $.blockUI.defaults.css.fontSize = '14px'
    $.blockUI.defaults.css.width = '700px'
    $.blockUI.defaults.css.height = '370px'
    $.blockUI.defaults.css.paddingTop = '70px'
    $.blockUI.defaults.css.paddingLeft = '20px'


    $.blockUI({
        message: $("#tags")
    });
    $(".blockMsg").draggable();

}

/// показать товары группы ///

function showGroup2(groupName) {
    groupName = groupName.replace("+"," ")
    $("#itemName").val(groupName)
    $("#itemName").change()
    $.unblockUI()

    return false;
}

/// переход в каталог
function goToHell(href){
    // alert(href)
    window.location.href(href)
}

/// поиск товара по наименованию ///

function searchItem2(item) {
    var squery = item.replace(/%2F/g, "/")
    var squery = squery.replace(/\s\s/g, " ")
    var squery = squery.replace(/%2C/g, ",")
    var squery = squery.replace(/\.com/, '')
    $("#itemName").val(squery)
    $(".buySpan").find("a").attr("style", "float:right;color:white;border:1px outset rgb(48, 57, 154);border-radius:40px 10px;background-color: #5da130;width:50px;padding-left:10px;")
    //$("#itemName").change()
}

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
        url: "getOrder.php",
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
        url: "getfilelink.php",
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


$(document).ready(function() {

    /// Обработка куки ///
    if($.cookie("basket") != undefined) {
        eval($.cookie("basket"))
    }

    $.cookie("basket", null)

    $("#popUpOrderClose").click(function() {
        $.unblockUI()
    })

    /// Попап наименований групп ///
    $("td.iRefTd").mouseenter(function() {
        // alert('in')
        var elem = this
        var spWidth = 0
        myTimer = window.setTimeout(function() {
            $(elem).css({
                border: "1px solid rgb(45, 54, 148)",
                position: "absolute",
                backgroundColor: "white",
                boxShadow: "0px 0px 5px 5px rgb(207, 207, 207)",
                zIndex: "11"
            })
            $(elem).find("span").each(function() {
                spWidth = this.offsetWidth
                spWidth = spWidth + 170
            })
            $(elem).animate({
                width: spWidth + "px",
                height: "80px"
            }, 450)
            $(elem).find("span").each(function() {
                $(this).animate({
                    fontWeight: "bold",
                    paddingTop: "30px",
                    height: "51px",
                    display: "block"

                }, 500)

            })
            $(elem).find("div").each(function() {
                $(this).animate({
                    width: "100px",
                    height: "51px",
                    marginTop: "15px",
                    marginLeft: "10px"
                })
                $(this).css({
                    backgroundPosition: "0 0"
                })
            })

        }, 1000)


    }).mouseleave(function() {
        clearTimeout(myTimer)
        $(this).css({
            border: "none",
            position: "relative",
            backgroundColor: "none",
            boxShadow: "none",
            zIndex: "1"
        })
        $(this).css({
            width: "200px",
            height: "70px"
        })
        $(this).find("span").each(function() {
            $(this).css({
                fontWeight: "lighter",
                paddingTop: "0px",
                height: "auto",
                display: "block",
                float: "left"
            })

        })
        $(this).find("div").each(function() {
            $(this).css({
                width: "50px",
                height: "36px",
                backgroundPosition: "50px 36px",
                marginTop: "0px",
                marginLeft: "0px"
            })
        })
    })

    /// Кнопка показать НДС ///
    $("#showNds").change(function() {
        // alert($("#showNds").attr("checked"))
        if($("#showNds").attr("checked") == "checked") {
            $(".NDSHeader, .itemNdsSumTd, .itemNdsKfTd, .ndsAllsum").show()
        } else {
            $(".NDSHeader, .itemNdsSumTd, .itemNdsKfTd, .ndsAllsum").hide()
        }
    })


    /// Вывод товаров по запросу ///
    $("#itemName").focus();

    $("#showAll").click(function() {
        value = $("#itemName").val()
        $.ajax({
            type: "GET",
            url: "/1cengine/site/get_items.py",
            async: false,
            data: "term=" + encodeURIComponent(value) + "&show_all=true",
            success: function(html) {
                $("#tableRes").empty()

                $(html).appendTo("#tableRes")
                $("#showAll").hide();
                $("#seotext").remove()
            }

        });
    })

    tmOutId = 0

    $("#itemName").change(function() {
        $("#groupDiv").hide()
        value = $("#itemName").val();
        value = value.replace("+"," ");
        // alert($("#itemName").attr("placeholder"))

        $("#seotext").remove()

        $.ajax({
            type: "GET",
            url: "/1cengine/site/get_items.py",
            async: false,
            data: "term=" + encodeURIComponent(value) + "",
            success: function(html) {
                $("#tableRes").empty()

                $(html).appendTo("#tableRes")
                if($(".item").length >= 1) {

                    $("#tags").hide();
                    $("#showGroupsDiv").show()
                    $('#hollowResult').empty()
                } else {
                    $('#hollowResult').html('Извините, но по заданному запросу товар не найден')
                    // $('#myCanvasContainer').show();
                    $('#tags').show();
                    $("#showGroupsDiv").hide()
                }
                if($(".item").length == 20) {
                    $("#showAll").show();
                    // $('#hollowResult').empty()
                } else {
                    $("#showAll").hide();
                    // $('#hollowResult').empty()
                }

            }

        });

    })

    $("#itemName").keyup(function() {

        keyEvent = this;
        window.clearTimeout(tmOutId);
        tmOutId = window.setTimeout(

        function() {
            $(keyEvent).change();
        }, 1000);
    });

    /// Разбор GET-параметров ///
    var squery = String(document.location).replace(/\%2F/g, "\\")
    var squery = String(document.location).replace(/\s\s/g, "\s")
    // var squery = String(document.location).replace(/\+/g, "\s")
    if(squery.split("?", 2)[1]) {
        parts = squery.split("?", 2)[1].split("&");
        GET = {};
        for(i = 0; i < parts.length; i++) {
            curr = parts[i].split('=');
            GET[curr[0]] = curr[1];
        }
        if(GET['ref'] != undefined) {
            searchItem2(decodeURI(GET['ref']))
            $('#myCanvasContainer').hide();
            $('#tags').hide();
        }


        if(GET['catalog'] != undefined) {
            showGroup2(decodeURI(GET['catalog']))
            $('#myCanvasContainer').hide();
            $('#tags').hide();
        }

        if(GET['linkUID'] != undefined) {
            openLink(GET['linkUID'], GET['type'])
        }
        if(GET['uid'] != undefined) {
            getOrder(decodeURI(GET['uid']))
        }
    }

    /// работа доставки. автодополнение, выбор города ///
    townS = $('#townSelect option:selected').val()

    $("#destination").autocomplete({
        source: "/1cengine/site/get_street.py?town=" + townS,
        delay: 10,
        minChars: 2,
        matchSubset: 1,
        autoFill: false,
        matchContains: 1,
        cacheLength: 10,
        selectFirst: true,
        maxItemsToShow: 10,
    });

    $("select").change(function() {

        townS = $('#townSelect option:selected').val()
        $("#destination").autocomplete("option", "source", "/1cengine/site/get_street.py?town=" + townS)
    })

    $("#townSelect").change(function() {
        if($("#townSelect :selected").val() != "72000001") {
            $("#carry [value='Длинномер']").attr("selected", "selected")
            $("#carry").attr("disabled", "disabled")

            $("#delivery_cost").empty()
            var d_price = $("#townSelect :selected").attr("price")
            if($("#selfCarry").is(":checked") == false) {

                var totalCost = getTotalCost(1)

                $("#SumAll").empty()
                $("#SumAll").append(totalCost)

            }
            d_price = (d_price - 0).toFixed(2)
            d_price = d_price.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ') + '.' + d_price.split('.')[1]
            if($("#toDeliver").is(":checked")) {
                $("#delivery_cost").append(d_price)
                $("#SumDelivery").html(d_price)
            }
            $("#delivery_cost").attr("name", d_price)


        } else if($("#townSelect :selected").val() == "72000001") {
            $("#carry").removeAttr("disabled")

            if($("#carry :selected").val() == "--") {
                $("#carry [value='Газель']").attr("selected", "selected")
            }

            $("#delivery_cost").empty()
            var d_price = $("#carry :selected").attr("price")
            if($("#selfCarry").is(":checked") == false) {

                var totalCost = getTotalCost(1)

                $("#SumAll").empty()
                $("#SumAll").append(totalCost)
            }
            d_price = (d_price - 0).toFixed(2)
            d_price = d_price.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ') + '.' + d_price.split('.')[1]
            if($("#toDeliver").is(":checked")) {
                $("#delivery_cost").append(d_price)
                $("#SumDelivery").html(d_price)
            }
            $("#delivery_cost").attr("name", d_price)

        }
        $("#destination").val('');
    })
    $("#carry").change(function() {
        if($("#townSelect :selected").val() == "72000001") {
            $("#delivery_cost").empty()
            var d_price = $("#carry :selected").attr("price")
            if($("#selfCarry").is(":checked") == false) {

                var totalCost = getTotalCost(1)

                $("#SumAll").empty()
                $("#SumAll").append(totalCost)
            }
            d_price = (d_price - 0).toFixed(2)
            d_price = d_price.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ') + '.' + d_price.split('.')[1]
            $("#delivery_cost").append(d_price)
            $("#delivery_cost").attr("name", d_price)
            $("#SumDelivery").html(d_price)
        }
    })
    $("#selfCarry").change(function() {
        // alert(1)
        var d_price = $("#delivery_cost").html().replace(/\s/g, "")
        if($("#selfCarry").is(":checked")) {
            // alert(1)
            var totalCost = getTotalCost(0)
            $(".withoutDelivery").show()
            $(".withDelivery").hide()
            $("#SumAll").empty()
            $("#SumAll").append(totalCost)
            $("#SumDelivery").empty()
            $("#delivery_cost").empty()
        }
    })
    $("#toDeliver").change(function() {
        var d_price = $("#delivery_cost").attr("name").replace(/\s/g, "")
        if($("#toDeliver").is(":checked")) {
            // alert(2)
            var totalCost = getTotalCost(1)
            $(".withDelivery").show()
            $(".withoutDelivery").hide()
            $("#SumAll").empty()
            $("#SumAll").append(totalCost)
            d_price = (d_price - 0).toFixed(2)
            d_price = d_price.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ') + '.' + d_price.split('.')[1]
            $("#delivery_cost").append(d_price)
            $("#SumDelivery").html(d_price)
        }
    })

    function getTotalCost(d) {
        var d_price = $("#delivery_cost").attr("name").replace(/\s/g, "")
        var totalCost = $("#SumAll").attr("name")
        if(d == 1) {
            totalCost = ((totalCost - 0) + (d_price - 0)).toFixed(2)
        } else {
            totalCost = (totalCost - 0).toFixed(2)
        }

        // nAll = ((totalCost / 118) * 18).toFixed(2)
        // nAll = nAll.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ') + '.' + nAll.split('.')[1]
        totalCost = totalCost.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ') + '.' + totalCost.split('.')[1]
        return totalCost
    }

})