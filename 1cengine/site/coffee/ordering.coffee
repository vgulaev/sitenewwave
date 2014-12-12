### DEPRECATED START!!!! ###

isValidEmail = (str) ->
    (str.indexOf(".") > 2) and (str.indexOf("@") > 0)

sendOrder = (orderString, is_async) ->
    is_async = true  if typeof is_async is "undefined"

    destination = $(".city_select option:selected").html() + " - " + $(".street_select").val()
    carry = $(".delivery_car").html()

    delivery_cost = $(".delivery_cost").html().replace("&nbsp;", "")


    email = $("input#emailInput").val()
    unless email is ""
        if isValidEmail(email) is false
            # $.unblockUI()
            alert "Проверьте правильность адреса электронной почты"
            return null
    main_phone = $("#mainPhoneInput").val()
    last_name = $("#lastNameInput").val()
    name_surname = $("#nameSurnameInput").val()
    other_phone = $("#otherPhoneInput").val()
    ret = ""


    rezka_text = ""
    $(".rezka_body").find("tr").each (index, element) =>
        rezka_text = rezka_text + $(element).find(".rezka_item_name").html() + " :: "
        rezka_text = rezka_text + $(element).find(".rezka_item_text").val() + " ;; "

    if rezka_text is ""
        rezka_text = "NOREZKA ;;"

    comment_text = $("#commentInput").val()


    $.ajax
        type: "POST"
        url: "/1cengine/php_scripts/createOrder.php"
        async: is_async
        data: "orderString=" + orderString + "&carry=" + carry + "&destination=" + destination + "&email=" + email + "&delivery_cost=" + delivery_cost + "&main_phone=" + main_phone + "&other_phone=" + other_phone + "&name_surname=" + name_surname + "&last_name=" + last_name + "&rezka=" + rezka_text + " комментарий :: " + comment_text
        success: (html) ->
            #var success = 'true';
            ret = "номер " + html
            $("#popUpOrderClose").show()
            $(".oInProcess").hide()
            $(".oProcessed").show()
            $("#basketCaption").empty()
            order = ret
            oA = order.split(",")
            $("#basketCaption").append "Заказ " + oA[0]
            $("#switchOrderDiv").click()
            ret

    #alert(ret)
    ret

$("#sendOrderButton").click ->
    createOrder()
    yaCounter23067595.reachGoal('FinishOrder');
    return


createOrder = () ->
    if $("#emailInput").val() is ""

        # $.unblockUI()
        $("#switchNotificationDiv").click()
        $("#emailInput").focus()
    else if $("#mainPhoneInput").val() is ""

        # $.unblockUI()
        $("#switchNotificationDiv").click()
        $("#phoneMainInput").focus()
    else
        $.blockUI.defaults.css.borderRadius = "10px" #убираем серую границу
        $.blockUI.defaults.fadeIn = 100 #ускоряем появление
        $.blockUI.defaults.fadeOut = 100 #и исчезновение
        #$.blockUI.defaults.css.left = '39%'; //окно будет в центре
        $.blockUI.defaults.css.backgroundColor = "white"
        $.blockUI.defaults.css.cursor = "defaults"
        $.blockUI.defaults.css.boxShadow = "0px 0px 5px 5px rgb(207, 207, 207)"
        $.blockUI.defaults.css.fontSize = "14px"
        $.blockUI.defaults.css.width = "450px"
        $.blockUI.defaults.css.height = "220px"
        $.blockUI.defaults.css.paddingTop = "10px"
        $.blockUI message: """
            <span class='oInProcess' style='margin-top:50px;font-size:16px'>
                Ваш заказ сейчас регистрируется в нашей системе<br />
            </span>
            <span class='oProcessed' style='display:none;margin-top:50px;font-size:16px'>
                Ваш заказ успешно зарегистрирован<br />
                и позднее будет обработан менеджером.<br />
                На указанный вами электронный адрес так же отправлена предварительная форма заказа.
            </span><div style='disply:block;margin-top:70px'><a href='' onClick='$.unblockUI(); return false' id='popUpOrderClose' style='display:none;cursor:pointer;'>Закрыть</a></div>"""
        sendRow = ""
        $("tr.itemTr").each ->
            if $(this).attr("name").split(":")[0] is "0"
                sendRow += "" + $(this).find("itemCharTd").html() + ":" + $(this).attr("name") + ":-:" + $(this).find(".itemCountTd").html() + ":" + $(this).find(".itemPriceTd").html() + ";"
            else
                sendRow += "" + $(this).attr("name") + ":-:" + $(this).find(".itemCountTd").html() + ":" + $(this).find(".itemPriceTd").html() + ";"

        order = sendOrder(sendRow)

openLink = (linkUID, type) ->
    $.ajax
        type: "POST"
        url: "/1cengine/php_scripts/getfilelink.php"
        async: false
        data: "linkUID=" + linkUID + "&type=" + type + ""
        success: (html) ->

            #var success = 'true';
            window.location.href = html
            return

    return

getOrderFomat = (format) ->
    $.blockUI.defaults.css.borderRadius = "10px" #убираем серую границу
    $.blockUI.defaults.fadeIn = 100 #ускоряем появление
    $.blockUI.defaults.fadeOut = 100 #и исчезновение
    #$.blockUI.defaults.css.left = '39%'; //окно будет в центре
    $.blockUI.defaults.css.backgroundColor = "white"
    $.blockUI.defaults.css.cursor = "defaults"
    $.blockUI.defaults.css.boxShadow = "0px 0px 5px 5px rgb(207, 207, 207)"
    $.blockUI.defaults.css.fontSize = "14px"
    $.blockUI.defaults.css.width = "450px"
    $.blockUI.defaults.css.height = "220px"
    $.blockUI.defaults.css.paddingTop = "10px"
    $.blockUI message: "<span class='oInProcess' style='margin-top:50px;font-size:16px'>Ваш запрос обрабатывается</span>"
    sendRow = ""
    $("tr.itemTr").each ->
        unless $(this).find("input.itemCharInput").length is 0
            sendRow += "" + $(this).find("input.itemCharInput").val() + ":" + $(this).attr("name") + ":-:" + $(this).find("input.itemCountInput").val() + ":" + $(this).find(".itemPriceTd").html() + ";"
        else
            sendRow += "" + $(this).attr("name") + ":-:" + $(this).find("input.itemCountInput").val() + ":" + $(this).find(".itemPriceTd").html() + ";"
        return

    window.setTimeout (->
        order = sendOrder(sendRow, false)
        q = order.split(",")
        openLink q[1], format
        return
    ), 1000
    return

### DEPRECATED END!!!! ###

show_rezka_ch_modal = () ->

    table_rows = ""
    for item in App.MyBasket._item_list
        if item.id in App.MyBasket._rezka_list
            checked = "checked"
        else
            checked = ""
        d_name = item.name + " " + item.char
        table_rows = table_rows + "<tr><td>#{d_name}</td><td><input name='#{item.id}' type='checkbox' #{checked} /></td></tr>"

    # alert(table_rows)

    table = """<div>
            <p>Отметьте позиции, которые вы хотите порезать</p>
            <table class='rezka_choose_table'>
            <thead><tr><th>Наименование</th><th>Резать?</th></tr></thead>
            <tbody>#{table_rows}</tbody></table>
            <div class="rezka_confirm_button">Применить</div>
            </div>"""

    $.blockUI.defaults.css.borderRadius = '10px';
    $.blockUI.defaults.fadeIn = 100;
    $.blockUI.defaults.fadeOut = 100;
    $.blockUI.defaults.css.backgroundColor = 'white'
    $.blockUI.defaults.css.cursor = 'defaults'
    $.blockUI.defaults.css.boxShadow = '0px 0px 5px 5px rgb(207, 207, 207)'
    $.blockUI.defaults.css.fontSize = '14px'
    $.blockUI.defaults.css.width = '450px'
    $.blockUI.defaults.css.paddingTop = '10px'

    $.blockUI
        message: table

    $(".blockMsg").draggable();

    $(".rezka_confirm_button").click ->
        # alert(1)
        apply_rezka()

    $(document).on "keyup", (e) ->
        e.preventDefault()
        if e.which is 27
            $.unblockUI();

apply_rezka = () ->
    # alert("nya")
    App.MyBasket._rezka_list.length = 0

    $(".rezka_choose_table").find("input").each ->
        if $(this).is(":checked")
            # alert($(this).attr("name"))
            App.MyBasket._rezka_list.push($(this).attr("name"))

            create_rezka()

            $.unblockUI();

create_rezka = () ->
    new_tbody_string = ""
    for item in App.MyBasket._item_list
        if item.id in App.MyBasket._rezka_list
                # """<tr>
                #                                                     <td class="rezka_item_name">#{item.name} #{item.char}</td>
                #                                                     <td class="rezka_item_description">
                #                                                         <textarea class="rezka_item_text"></textarea>
                #                                                     </td>
                #                                                     <td class="rezka_item_delete"><div idname="#{item.id}"></div>
                #                                                 </tr>"""
            new_tr = """
                <div class="rezka_item">
                <div class="rezka_item_header">#{item.name} #{item.char}
                <span class="rezka_delete_item">⤬</span>
                </div>
                <span class="red_info">
                    *Максимальная длина отрезка: #{item.char} м
                </span>
                <div class="rezka_table_container">
                    <table class="rezka_table">
                        <thead>
                            <tr>
                                <th>Длина м.</th>
                                <th>Кол-во шт.</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <input type="textarea" class="rezka_length_input" />
                                </td>
                                <td>
                                    <input type="textarea" class="rezka_count_input" />
                                </td>
                                <td class="rezka_part_delete">
                                    <div></div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="rezka_part_add"><font>Добавить рез</font></div>
                </div>
                <div class="rezka_info_container">
                    <div class="rezka_count_info">
                        <div>Количестуво резов: <span class="rezka_count">X</span></div>
                        <div>Остатки: <span>Y</span></div>
                    </div>
                    <div class="rezka_price_container">Цена: <span class="rezka_price">Z</span></div>
                </div>
            </div>
            """
            new_tbody_string = new_tbody_string + new_tr

    $(".rezka_table").html new_tbody_string

    $(".rezka_item_delete").find("div").each (index, element) ->
        $(element).click ->
            delete_rezka_item($(element).attr("idname"))

delete_rezka_item = (id) ->
    App.MyBasket._rezka_list.splice(App.MyBasket._rezka_list.indexOf(id), 1)
    create_rezka()

$(document).ready ->

    #MyBasket = new App.Basket("MyBasket")


    $(".bItem").click ->

        elem_id = $(this).closest( "tr" ).attr("id")

        item = App.Item.elem_exist(elem_id)
        if item is false
            item = new App.Item $(this).closest( "tr" ).attr("id")
        else
            item.show_modal()

    $(".oItem").click ->

        elem_id = $(this).closest( "tr" ).attr("id")

        item = App.Item.elem_exist(elem_id)
        if item is false
            item = new App.Item $(this).closest( "tr" ).attr("id")
        else
            item.show_modal()

    $("#sendOrderButton").click ->
        createOrder()

        yaCounter23067595.reachGoal('FinishOrder');

    ### DEPRECATED ###

    #/ Разбор GET-параметров ///
    squery = String(document.location).replace(/\%2F/g, "\\")
    squery = String(document.location).replace(/\s\s/g, "s")

    # var squery = String(document.location).replace(/\+/g, "\s")
    if squery.split("?", 2)[1]
        parts = squery.split("?", 2)[1].split("&")
        GET = {}
        i = 0
        while i < parts.length
            curr = parts[i].split("=")
            GET[curr[0]] = curr[1]
            i++
        openLink GET["linkUID"], GET["type"]    unless GET["linkUID"] is `undefined`


    ### /DEPRECATED ###

    $(".rezka_item_add").click ->
        show_rezka_ch_modal()


    $("#tabBasket").tooltipster({
        content: "Товар добавлен в корзину",
        animation: 'fade',
        delay: 200,
        position: 'right',
        timer: 3000,
        trigger: "custom",
        theme: "tooltipster-my"
    })
    # $( "#tabBasket" ).tooltip( "disable" )
    # $( "#tabBasket" ).tooltip( "open" );

