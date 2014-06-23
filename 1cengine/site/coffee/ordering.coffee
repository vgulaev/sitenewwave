class App.Item
    @_existing: []

    @elem_exist: (id) ->
        flag = false
        for item in @_existing
            if item.id is id
                flag = true
                break
        if flag
            item
        else
            false

    constructor: (@id) ->
        @set_chars()

        # console.log @name
        # console.log @char
        # console.log @length
        # console.log @weight
        # console.log @kf
        # for price in @prices
        #     console.log price

        if @is_measureable()
            @count = 1
            @change_buy_count(@count)
        else
            @buy_weight = "1"
            @change_buy_weight(@buy_weight)

        @show_modal()

        App.Item._existing.push this

    is_measureable: ->
        if @length is "0"
            false
        else
            true


    get_chars: ->
        response = null
        $.ajax
            type: "POST"
            url: "/1cengine/py_scripts/get_item_lwkes.py"
            async: false
            data: "item_hash=" + @id
            success: (html) ->
                response = html
                response

        response

    set_chars: (chars) ->
        chars = @get_chars().replace /\s+$/g, ""
        char_array = chars.split "|"
        @length = char_array[0]
        @weight = char_array[1]
        @kf     = char_array[2]
        @ed_izm = char_array[3]
        @stock  = char_array[4]

        i_hash = @id.slice 0, @id.indexOf(":")

        if i_hash is "0"
            @is_kis = true
            @weight = 2
            @length = 1000
            @char = @weight
        else
            @is_kis = false

        @prices = []
        obj = $("tr[id='#{@id}']")
        $(obj).children().each (index, element) =>
            if $(element).attr("class") is "itemName"
                @name = $(element).children("[itemprop='name']").text()
            if $(element).attr("class") is "itemChar"
                @char = $(element).text()

            if ( $(element).attr("class").indexOf "price", 0 ) is 0
                @prices.push $(element).children( "span" ).text()


    change_buy_count: (count) ->
        # alert(count)
        @buy_count = Math.ceil(count)
        @buy_length = (@buy_count * @length).toFixed(2)

        @buy_weight = (( @buy_length * @weight ) / 1000 ).toFixed(3)

        @change_modal()

    change_buy_length: (length) ->
        @buy_length = length.replace /,+/g, "."
        @buy_count = @buy_length / @length

        @change_modal()
        $(".buy_count").change()

    change_buy_weight: (weight) ->
        @buy_weight = weight.replace /,+/g, "."

        if @is_measureable()
            @buy_length = ( @buy_weight * 1000 ) / @weight

            @change_modal()
            $(".buy_length").change()

        @change_modal()

    change_modal: ->
        if @is_measureable()
            $(".buy_count").val(@buy_count)

            $(".buy_length").val(@buy_length)

        if @is_kis
            $(".char_length").val(@weight)

        $(".buy_weight").val(@buy_weight)

        @change_modal_price()

    change_modal_price: ->
        @set_price_weight()

        if @is_measureable()
            @price_length = ( ( @price_weight / 1000 ) * @weight ).toFixed(2)
            @price_count = ( ( @price_weight * @buy_weight ) / @buy_count ).toFixed(2)

            # $(".price_length").html(@price_length)
            $(".price_count").html(@price_count)

        $(".price_weight").html(@price_weight)

        @set_final_price()

    set_price_weight: ->
        if @ed_izm is "т"
            price_index = App.Basket._active_price_measured
        else
            price_index = 0

        @price_weight = ( +@prices[price_index] ).toFixed(2)

    set_final_price: ->
        @set_price_weight()
        @final_price = ( @buy_weight * @price_weight ).toFixed(2)
        $(".final_price").html(@final_price)

    change_char_length: (n_length) ->
        if n_length < 0.2
            n_length = 0.2
        else if n_length > 6
            n_length = 6

        @weight = n_length
        @char = @weight

        @change_buy_count($(".buy_count").val())

    show_modal: ->

        my_css = {
            width: '450px',
            height: 'auto',
            paddingTop: '10px',
            paddingBottom: '10px'
        }

        $.blockUI
            message: @get_modal(),
            css: my_css

        $(".blockMsg").draggable();

        $(document).on "keyup", (e) ->
            e.preventDefault()
            if e.which is 27
                $.unblockUI();

        if @is_measureable()
            $(".buy_count").bind 'change keyup', (event) =>
                @change_buy_count($(".buy_count").val())

            $(".buy_length").bind 'change keyup', (event) =>
                @change_buy_length($(".buy_length").val())

        $(".buy_weight").bind 'change keyup', (event) =>
            @change_buy_weight($(".buy_weight").val())

        if @is_kis
            $(".char_length").bind 'change keyup', (event) =>
                @change_char_length($(".char_length").val())

        @change_modal_price()

        $(".add_to_basket").bind 'click', (event) =>

            App.Basket.add_item(this)
            $.unblockUI()

        $(".change_in_basket").bind 'click', (event) =>

            App.Basket.change_item(this)
            $.unblockUI()
            # alert(Basket._total_weight)


    get_modal: ->
        if App.Basket.is_in_basket(this)
            modal_link = '<a class="change_in_basket" href="Изменить" onClick="return false">Изменить</a>'
        else
            modal_link = '<a class="add_to_basket" href="Добавить в корзину" onClick="return false">В корзину</a>'


        if @is_measureable()
            l_input = '<input class="buy_length" pattern="[0-9,\\.]+" value="'+@buy_length+'" />'
            c_input = '<input class="buy_count" pattern="[0-9]+" value="'+@buy_count+'" />'
        else
            l_input = '<input class="buy_length" value="---" disabled />'
            c_input = '<input class="buy_count" value="---" disabled />'
        w_input = '<input class="buy_weight" pattern="[0-9,\\.]+" value="'+@buy_weight+'" />'

        if @is_kis
            cl_input = '<input class="char_length" pattern="[0-9,\\.]+" value="'+@weight+'" />'

            set_length = """
                <p>Укажите требуемую длину листа: #{cl_input}</p>
            """
        else
            set_length = ""

        edizm_dict = {
            "т":"Тонны",
            "шт":"Штуки",
            "м2":"Метры кв.",
            "кв.м.":"Метры кв.",
            "кв. м.":"Метры кв.",
            "пог.м":"Метры пог.",
            "пог. м":"Метры пог."
            }

        c_izm = edizm_dict["#{@ed_izm}"]




        message = """
        <div class="buy_item_div">
        <span class="buy_item_name">#{@name} #{@char}</span>
        #{set_length}
        <table class="buy_item_table">
        <tr class="buy_item_head">
        <th></th>

        <th>Штуки</th>
        <th>#{c_izm}</th>
        </tr>
        <tr class="buy_item_count">
        <td>Количество</td>
        <td style="display:none">
            #{l_input}
        </td>
        <td>
            #{c_input}
        </td>
        <td>
            #{w_input}
        </td>
        </tr>
        <tr class="buy_item_price">
        <td>Стоимость за ед.</td>
        <td class="price_count">0</td>
        <td class="price_weight">0</td>
        </tr>

        </table>
        <div class="buy_item_overall">Итого: <span class="final_price"></span></div>
        <div class="basket_item_overall">*В корзине товар на: <span class="basket_price">#{App.Basket._sum}</span></div>
        <span class="popUpContinue">#{modal_link}</span>
        </div>""";

        message


class App.Basket
    @_item_list: []
    @_rezka_list: []
    @_sum: 0
    @_count: 0
    @_total_weight: 0
    @_active_price_measured: 0


    @is_in_basket: (item) ->
        index = @_item_list.indexOf(item)
        if index is -1
            false
        else
            true

    @find_by_id: (id) ->
        flag = false
        for item in @_item_list
            if item.id is id
                flag = true
                break
        if flag
            item
        else
            false

    @add_item: (item) ->
        index = @_item_list.indexOf(item)
        if index is -1
            @_item_list.push item
            @_sum = ( (+item.final_price) + (+@_sum) ).toFixed(2)
            if item.ed_izm is "т"
                @_total_weight = ( (+item.buy_weight) + (+@_total_weight) ).toFixed(3)
            @_count++

            @change_basket()

            i_id = "##{item.id}".replace(":", "\\:")
            # alert($("#{i_id}").attr("class"))
            # $("#tableRes").find("##{item.id}")
            $("#{i_id}").addClass("in_basket")

    @change_item: (item) ->
        # alert("lol")
        index = @_item_list.indexOf(item)
        if index > -1
            @_sum = 0
            @_total_weight = 0
            for elem in @_item_list
                @_sum = ( (+elem.final_price) + (+@_sum) ).toFixed(2)
                @_total_weight = ( (+elem.buy_weight) + (+@_total_weight) ).toFixed(3)

                @change_basket()

    @delete_item: (id) ->

        item = @find_by_id(id)
        index = @_item_list.indexOf(item)
        if index > -1
            # @_sum = ( (+@_sum) - (+item.final_price) ).toFixed(2)
            # @_total_weight = ( (+@_total_weight) - (+item.buy_weight) ).toFixed(3)
            i_id = "##{item.id}".replace(":", "\\:")
            $("#{i_id}").removeClass("in_basket")


            @_count--
            @_item_list.splice(index,1)
            # alert(@_item_list)

            @_sum = 0
            @_total_weight = 0
            for elem in @_item_list
                @_sum = ( (+elem.final_price) + (+@_sum) ).toFixed(2)
                @_total_weight = ( (+elem.buy_weight) + (+@_total_weight) ).toFixed(3)

                # @change_basket()

        @change_basket()

    @get_count: ->
        @_count

    @change_basket: ->
        # alert(@_sum)
        $(".basketCount").html(@_count)
        $(".lItemTab").empty()
        for item in @_item_list
            $(".#{item.ed_izm.replace('.','\\.').replace(' ','')}").append(@create_row(item))
            # $("#lItemTab").append(@create_row(item))

            $("tr[name='#{item.id}']").find(".delete_from_basket").bind "click", (event) =>
                target = $(event.currentTarget)
                App.Basket.delete_item(target.closest( "tr" ).attr("name"))

            $("tr[name='#{item.id}']").find(".edit_from_basket").bind "click", (event) =>
                target = $(event.currentTarget)
                element = @find_by_id(target.closest( "tr" ).attr("name"))
                element.show_modal()

                # @change_basket()

        nds = ( ( @_sum / 100 ) * 18 ).toFixed(2)
        $("#SumGoods").html(@_sum)
        $("#CountAll").html(@_total_weight)
        $("#NDSAll").html(nds)

        App.load_delivery_cost()
        # alert("changed")

    @rebuild_basket: ->


    @create_row: (item) ->
        nds = ( ( item.final_price / 100 ) * 18 ).toFixed(2)
        row = """
            <tr class="itemTr" name="#{item.id}">
            <td>#{@_item_list.indexOf(item)+1}</td>
            <td class='itemNameTd'>#{item.name}</td>

            <td class='itemCharTd'>#{item.char}</td>

            <td class='itemCountTd'>#{item.buy_weight}</td>
            <td class='itemEdIzmTd'>#{item.ed_izm}</td>
            <td class='itemPriceTd'>#{item.price_weight}</td>
            <td class='itemNdsKfTd'>18%</td>
            <td class='itemNdsSumTd'>#{nds}</td>
            <td class='itemSumTd'>#{item.final_price}</td>
            <td class='itemEdit'>
                <span class="delEdSpan">
                <a class="edit_from_basket" href="Редактировать" onClick="return false"><img src="/1cengine/site/images/cart_edit.png" /></a></span>
                <a class="delete_from_basket" href="Убрать из корзины" onClick="return false"><img src="/1cengine/site/images/cart_delete.png" /></a>
            </td>
            </tr>
        """

    @on_weight_change_handler: (weight) ->

        if weight < 2
            @_active_price_measured = 0
        if weight >= 2 and weight < 8
            @_active_price_measured = 1
        if weight >= 8 and weight < 15
            @_active_price_measured = 2
        if weight >= 15
            @_active_price_measured = 3

        weight

    @watch "_total_weight", (id, oldval, newval) ->
        @on_weight_change_handler(newval)
        @_total_weight = newval


    @on_active_price_measured_change_handler: ->
        @update_price()

        @_active_price_measured

    @watch "_active_price_measured", (id, oldval, newval) ->
        @on_active_price_measured_change_handler()
        @_active_price_measured = newval

    @update_price: ->
        for item in @_item_list
            item.set_price_weight()
            item.set_final_price()

            @change_item(item)
            @change_basket()


    constructor: (@name) ->

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



    $.ajax
        type: "POST"
        url: "/1cengine/php_scripts/createOrder.php"
        async: is_async
        data: "orderString=" + orderString + "&carry=" + carry + "&destination=" + destination + "&email=" + email + "&delivery_cost=" + delivery_cost + "&main_phone=" + main_phone + "&other_phone=" + other_phone + "&name_surname=" + name_surname + "&last_name=" + last_name + "&rezka=" + rezka_text
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
            unless $(this).find("input.itemCharInput").length is 0
                sendRow += "" + $(this).find("input.itemCharInput").val() + ":" + $(this).attr("name") + ":-:" + $(this).find(".itemCountTd").html() + ":" + $(this).find(".itemPriceTd").html() + ";"
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
    for item in App.Basket._item_list
        if item.id in App.Basket._rezka_list
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
    App.Basket._rezka_list.length = 0

    $(".rezka_choose_table").find("input").each ->
        if $(this).is(":checked")
            # alert($(this).attr("name"))
            App.Basket._rezka_list.push($(this).attr("name"))

            create_rezka()

            $.unblockUI();

create_rezka = () ->
    new_tbody_string = ""
    for item in App.Basket._item_list
        if item.id in App.Basket._rezka_list
            new_tr = """
                <tr>
                    <td class="rezka_item_name">#{item.name} #{item.char}</td>
                    <td class="rezka_item_description">
                        <textarea class="rezka_item_text"></textarea>
                    </td>
                    <td class="rezka_item_delete"><div idname="#{item.id}"></div>
                </tr>
            """
            new_tbody_string = new_tbody_string + new_tr

    $(".rezka_table").find("tbody").html new_tbody_string

    $(".rezka_item_delete").find("div").each (index, element) ->
        $(element).click ->
            delete_rezka_item($(element).attr("idname"))

delete_rezka_item = (id) ->
    App.Basket._rezka_list.splice(App.Basket._rezka_list.indexOf(id), 1)
    create_rezka()

$(document).ready ->


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
