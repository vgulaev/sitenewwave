### DEPRECATED START!!!! ###

isValidEmail = (str) ->
    (str.indexOf(".") > 2) and (str.indexOf("@") > 0)

sendOrder = (orderString, is_async) ->
    is_async = true  if typeof is_async is "undefined"

    if $("#i_want_delivery").prop("checked")
        destination = $(".city_select option:selected").html() + " - " + $(".street_select").val()
        carry = $(".delivery_car").html()
        delivery_info = $(".active_city").attr("name")

        delivery_cost = $(".delivery_cost").html().replace("&nbsp;", "")

    else
        carry = $(".delivery_car").html()
        destination = "None"
        delivery_cost = "0"


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

    counterparty = $("#counterpartySelect").val()

    # alert(counterparty)

    rezka_text = ""
    # $(".rezka_body").find("tr").each (index, element) =>
    #     rezka_text = rezka_text + $(element).find(".rezka_item_name").html() + " :: "
    #     rezka_text = rezka_text + $(element).find(".rezka_item_text").val() + " ;; "

    $(".rezka_item").each (index, element) =>
        rezka_text = rezka_text + $(element).attr("name") + " :: "
        $(element).find(".rezka_table_tt").each (rindex, relement) =>
            rezka_slices = $(relement).find(".rezka_count_input").val() + " x " + $(relement).find(".rezka_length_input").val() + " , "
            rezka_text = rezka_text + rezka_slices
        rezka_text = rezka_text + " ;; "

    if rezka_text is ""
        rezka_text = "NOREZKA ;;"

    comment_text = $("#commentInput").val()


    $.ajax
        type: "POST"
        url: "/1cengine/php_scripts/createOrder.php"
        async: is_async
        data: "orderString=" + orderString + "&carry=" + carry + "&destination=" + destination + "&email=" + email + "&delivery_cost=" + delivery_cost + "&main_phone=" + main_phone + "&other_phone=" + other_phone + "&name_surname=" + name_surname + "&last_name=" + last_name + "&rezka=" + rezka_text + " комментарий :: " + comment_text + "&delivery_info=" + delivery_info + "&counterparty=" + counterparty
        success: (html) ->
            #var success = 'true';
            ret = html
            $("#popUpOrderClose").show()
            $(".oInProcess").hide()
            $(".oProcessed").show()
            $("#basketCaption").empty()
            order = ret
            oA = order.split(",")
            $("#basketCaption").append "Заказ номер " + oA[0]
            $("#switchOrderDiv").click()
            mail_to_client(oA[1], oA[2], email, main_phone+", "+other_phone, name_surname+" "+last_name, oA[3], oA[4], oA[0])
            save_to_db(oA[0], email, main_phone+", "+other_phone, name_surname+" "+last_name)
            block_order()
            ret

    #alert(ret)
    ret

mail_to_client = (uid, accepted, mail, phones, fname, regresult, pwd, onumber) ->

    $.ajax
        type: "POST"
        url: "/1cengine/py_scripts/mail_order.py"
        async: true
        data: "uid=" + uid + "&accepted=" + accepted + "&mail=" + mail + "&phones=" + phones + "&fname=" + fname + "&regresult=" + regresult + "&pwd=" + pwd + "&onumber=" + onumber
        success: (html) ->
            true

save_to_db = (onumber, mail, phones, fname) ->
    sum = $("#SumGoods").html()
    $.ajax
        type: "POST"
        url: "/1cengine/py_scripts/save_order_db.py"
        async: true
        data: "sum=" + sum + "&mail=" + mail + "&phones=" + phones + "&fname=" + fname + "&onumber=" + onumber
        success: (html) ->
            true

$("#sendOrderButton").click ->
    createOrder()
    yaCounter23067595.reachGoal('FinishOrder');
    return


createOrder = () ->
    accept_flag = true

    if $("#mainPhoneInput").val() is ""

        # $.unblockUI()
        $("#switchNotificationDiv").click()
        $("#mainPhoneInput").focus()
        $("#mainPhoneInput").addClass("invalid_input")

        $("#mainPhoneInput").parent().parent().children().addClass("require_field")

        accept_flag = false

    if $("#emailInput").val() is ""

        # $.unblockUI()
        $("#switchNotificationDiv").click()
        $("#emailInput").focus()
        $("#emailInput").addClass("invalid_input")

        $("#emailInput").parent().parent().children().addClass("require_field")

        accept_flag = false

    if accept_flag
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
                и будет обработан менеджером.<br />
                На указанный вами электронный адрес отправлена предварительная форма заказа.
            </span><div style='disply:block;margin-top:70px'><a href='' onClick='$.unblockUI(); return false' id='popUpOrderClose' style='display:none;cursor:pointer;'>Закрыть</a></div>"""
        sendRow = ""
        $("tr.itemTr").each ->
            if $(this).attr("name").split(":")[0] is "0"
                sendRow += "" + $(this).find(".itemCharTd").html() + ":" + $(this).attr("name").split(":")[1] + ":-:" + $(this).find(".itemCountTd").html() + ":" + $(this).find(".itemPriceTd").html() + ";"
            else
                sendRow += "" + $(this).attr("name") + ":-:" + $(this).find(".itemCountTd").html() + ":" + $(this).find(".itemPriceTd").html() + ";"

        # alert(sendRow)

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

block_order = () ->
    $(".next_step").hide()
    $(".return_to_catalog").hide()
    $("#switchDiv").hide()
    $("#tabPrice").attr("href","/1cengine/site/")
    $("#tabPrice").html("Новый заказ")
    $("#tabPrice").attr("onClick", "")

### LOGIN USER START ###

submit_form = (passwd) ->
  $.ajax
    type: 'POST'
    url: '/1cengine/py_scripts/user.py'
    async: true
    data: 'passwd=' + passwd + '&email=' + $('.emailInput').val() + '&funkt=authorize_me'
    success: (html) ->
      authorization = html
      # eval authorization

      authorization = authorization.replace('window.location = "/kabinet/orders/"', "")
      eval authorization
      check_user()
  return

loginUser = ->
  passwd = $('.passwdInput').val()
  email = $('.emailInput').val()
  if passwd != '' and email != ''
    passwd = hex_sha256(passwd)
    # $('.hidden_passwd').val passwd
    submit_form(passwd)
    # $("#regForm").submit()
  return

show_login_user = () ->
    my_css = {
        borderRadius: '10px',
        fadeIn: 100,
        fadeOut: 100,
        backgroundColor: 'white',
        cursor: 'defaults',
        boxShadow: '0px 0px 5px 5px rgb(207, 207, 207)',
        fontSize: '14px',
        width: '500px',
        height: 'auto',
        paddingTop: '10px',
        textAlign: 'left',
        paddingBottom: '30px'
    }

    msg = """
        <div class='wrapper'>
            <span class="close_button">x</span>
            <h3>Войти как контрагент</h3>
            <table class="loginTable">
                <tr>
                    <td>Email:</td>
                </tr>
                <tr>
                    <td><input class="emailInput" name="email" /></td>
                </tr>
                <tr>
                    <td>Пароль:</td>
                </tr>
                <tr>
                    <td><input type="password" class="passwdInput" /></td>
                </tr>
            </table>
            <div class='enterButton'>Войти</div>
        </div>"""

    $.blockUI({
        message: msg,
        css: my_css
    });

    # $(".blockMsg").draggable();

    $(document).on 'keyup', (e) ->
        e.preventDefault()
        if e.which == 27
            return $.unblockUI()
        return

    $(".close_button").click ->
        $.unblockUI()

    $(".enterButton").click ->
        $("body").css("cursor", "wait")
        $(".emailInput").addClass("preloading")
        $(".passwdInput").addClass("preloading")
        loginUser()

check_user = () ->
    $.ajax
        type: "POST"
        dataType: "json"
        url: "/1cengine/py_scripts/check_user.py"
        async: true
        data: ""
        success: (html) ->

            #var success = 'true';
            user = (html)
            $("#emailInput").val(user["Email"])
            # alert( user["Counterparty"][0] )
            c_select = """
                <select id="counterpartySelect">
                    <option value="Розничный покупатель">Без контрагента</option>
            """
            $(user["Counterparty"]).each (index, element) =>
                c_select += "<option value='" + element + "'>" + element + "</option>"
            c_select += "</select>"
            $(".counterpartySelectContainer").empty()
            $(".counterpartySelectContainer").append(c_select)
            $(".counterpartyRow").show()
            return
        error: (html) ->
            c_select = '<noindex><div id="counterpartyLoginButton"><span>Я зарегистрированный контрагент</span></div></noindex>'
            $(".counterpartySelectContainer").empty()
            $(".counterpartySelectContainer").append(c_select)
            $(".counterpartyRow").show()

            $("#counterpartyLoginButton").click ->
                show_login_user()
            return

### LOGIN USER END ###


### Print DA OЯDER ###

@printOrder = () ->
    # console.log "ok =)"

    order_json = { "order": [], "total": "0" }

    $("#basketTab").find("tr.itemTr").each (i, el) =>
        line_json = []

        line_json.push($(el).find(".itemNameTd")[0].innerHTML)
        line_json.push($(el).find(".itemCharTd")[0].innerHTML)
        line_json.push($(el).find(".itemCountTd")[0].innerHTML)
        line_json.push($(el).find(".itemEdIzmTd")[0].innerHTML)
        line_json.push($(el).find(".itemPriceTd")[0].innerHTML)
        line_json.push($(el).find(".itemSumTd")[0].innerHTML)

        order_json["order"].push(line_json)
        # console.log ($(el).find(".itemNameTd")[0].innerHTML)


    # console.log JSON.stringify(order_json)


    total = $("#SumGoods")[0].innerHTML

    order_json["total"] = total

    if $("#i_want_delivery").prop("checked")
        line_json = []

        destination = "Доставка: " + $(".city_select option:selected").html() + " - " + $(".street_select").val()
        carry = $(".delivery_car").html()
        delivery_info = $(".active_city").attr("name")

        delivery_cost = $(".delivery_cost").html().replace("&nbsp;", "")

        line_json.push(destination)
        line_json.push("")
        line_json.push("1")
        line_json.push('услуга')
        line_json.push(delivery_cost.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ').replace(".", ","))
        line_json.push(delivery_cost.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ').replace(".", ","))

        order_json["order"].push(line_json)

        s1 = parseFloat(App.MyBasket._sum)
        s2 = parseFloat(delivery_cost)

        console.log (s1 + " + " + s2)

        order_json["total"] = String((s1+s2).toFixed(2)).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ').replace(".", ",")

    console.log JSON.stringify(order_json)

    $.ajax
        type: "POST"
        url: "/1cengine/py_scripts/return_print_form.py"
        async: false
        data: "order_json="+JSON.stringify(order_json)+""
        success: (html) ->

            params = "toolbar=no"

            x = window.open("","Печать заказа Тримет", params)
            x.document.open()
            x.document.write(html)
            x.document.close()
            #var success = 'true';
            # window.location.href = html
            return

    return

### Print DA OЯDER END ###

$(document).ready ->

    # alert($.cookie("sid"))

    check_user()

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
        App.show_rezka_ch_modal()


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

    # $('#mainPhoneInput').keypress (key) ->
    #     if (key.charCode < 48 or key.charCode > 57) and key.charCode != 219 and key.charCode != 221 and key.charCode != 43 and key.charCode != 32 and key.charCode != 45 and key.charCode != 8
    #         return false

    $('#mainPhoneInput').bind 'keypress', (event) ->
        regex = new RegExp('^[A-Za-zА-Яа-я=\\\\\\[\\]{}`@#%&*|/,\\.\\!\\$\\~_<>\\?]+$')
        key = String.fromCharCode(if !event.charCode then event.which else event.charCode)
        if regex.test(key)
            event.preventDefault()
            return false
        return

