Array::toDict = (key) ->
    @reduce ((dict, obj) -> dict[ obj[key] ] = obj if obj[key]?; return dict), {}

tabs = [
    {
        id: "tabBasket"
        other: [ "basketDiv", "showPriceSpan" ]
        counter: [ "tabPrice" ]
    },
    {
        id: "tabPrice"
        other: [ "pTableContentTab", "showBasketSpan" ]
        counter: [ "tabBasket" ]
    },
    {
        id: "closeBasket"
        other: [ "pTableContentTab", "showBasketSpan" ]
        counter: [ "tabBasket" ]
    },
    {
        id: "switchOrderDiv"
        other: [ "orderDiv", "showNDSlabel" ]
        counter: [ "switchDeliveryDiv", "switchNotificationDiv" ]
        active_class: "activeDiv"
        inactive_class: "inactiveDiv"
    },
    {
        id: "switchDeliveryDiv"
        other: [ "deliveryDiv" ]
        counter: [ "switchOrderDiv", "switchNotificationDiv" ]
        active_class: "activeDiv"
        inactive_class: "inactiveDiv"
    },
    {
        id: "switchNotificationDiv"
        other: [ "notificationDiv" ]
        counter: [ "switchOrderDiv", "switchDeliveryDiv" ]
        active_class: "activeDiv"
        inactive_class: "inactiveDiv"
    }
]

tabs_dict = tabs.toDict("id")

switch_tabs = (id) ->
    # alert(id)
    counters = tabs_dict[id]["counter"]

    for counter in counters
        for other in tabs_dict[counter]["other"]
            $("##{other}").hide()

        if tabs_dict[counter]["active_class"]
            $("##{tabs_dict[counter]['id']}").removeClass(tabs_dict[counter]['active_class'])

        if tabs_dict[counter]["inactive_class"]
            $("##{tabs_dict[counter]['id']}").addClass(tabs_dict[counter]['inactive_class'])

    for other in tabs_dict[id]["other"]
        $("##{other}").show()

    if tabs_dict[id]["active_class"]
        $("##{id}").addClass(tabs_dict[id]['active_class'])

    if tabs_dict[id]["inactive_class"]
        $("##{id}").removeClass(tabs_dict[id]['inactive_class'])



App.load_delivery_cost = () ->
    # alert("nya")
    $.ajax
        type: "GET"
        url: "/1cengine/json/delivery.json"
        async: false
        data: ""
        success: (html) ->
            # alert $(".active_city").attr("name")
            opt_string = "<option>--</option>"
            # if $(".active_city").attr("name") is "city"
            for key, value of html[$(".active_city").attr("name")]
                # alert key + " : " + value
                n_car = "Газель"
                if App.MyBasket._total_weight > 2
                    n_car = "Длинномер"
                else if $(".active_city").attr("name") is "outcity"
                    n_car = "Длинномер"
                else
                    for item in App.MyBasket._item_list
                        if item.length > 6
                            n_car = "Длинномер"

                cost_car = value[n_car]

                # for t, p of value
                #     alert(t)
                    # if t is "Газель"
                    #     cost_car = p
                    #     c_car = "Газель"
                    # else
                    #     cost_car = p
                    #     c_car = "Камаз"

                opt_string  = opt_string + "<option value='#{cost_car}'>#{key}</option>"
                $(".delivery_car").html n_car
                # alert html["city"][key]

            $(".city_select").html opt_string
            $(".delivery_cost").html 0

show_dop_uslugi = (chkbox) ->
    if $(chkbox).is(":checked")
        $(".is_in_city").show()
        $(".city_choose").show()
        App.load_delivery_cost()
    else
        $(".is_in_city").hide()
        $(".city_choose").hide()

show_rezka = (chkbox) ->
    if $(chkbox).is(":checked")
        $(".rezka_wrapper").show()
    else
        $(".rezka_wrapper").hide()


get_item_list = (hash) ->
    # alert(hash)
    $("body").css("cursor", "wait")
    $("#itemName").val ""
    $.ajax
        type: "GET"
        url: "/1cengine/py_scripts/get_ncatalog_items.py"
        async: true
        data: "hash=" + encodeURIComponent(hash) + ""
        success: (html) ->
            App.C_HASH = hash
            get_item_table(html)


get_subgroup = (element, g_name, g_hash) ->
    # alert(g_name+" :: "+g_hash)

    $.ajax
        type: "GET"
        url: "/1cengine/py_scripts/get_ncatalog_item_group.py"
        async: false
        data: "term=" + encodeURIComponent(g_hash) + ""
        success: (html) ->
            # alert(html)
            $(element).append(html)
            $(".menu_back_button").click ->
                group_menu_back()

            $(".sungroup_show_button").click ->
                get_parameters()

            $(".sidebar_checkbox").click ->
                exclude_parameters(this)

            my_content = $('<a href=# onClick="$(\'.sungroup_show_button\').click(); return false">Выбрать</a>')

            $(".sidebar_checkbox").tooltipster({
                content: my_content,
                interactive: true,
                animation: 'fade',
                delay: 200,
                position: 'right',
                offsetX: 100,
                timer: 3000,
                trigger: "click",
                theme: "tooltipster-my"
            })


group_click = (element) ->
    $(element).click ->
        li_element = $(this).parent()

        g_name = $(this).parent().attr("name")
        g_hash = $(this).parent().attr("inid")
        # $(".subgroup_c").hide()
        if $(li_element).hasClass("active_group") is false


            # $("#itemName").val g_name
            # $("#itemName").change()
            get_item_list(g_hash)

            $("#groups_list").find("li.main_group").removeClass("active_group")
            $("li.main_group").hide()
            $(li_element).addClass("active_group")
            $(li_element).show()

        # alert($(this).attr("name"))
        if $(li_element).children().is(".subgroup_c") is false
            # alert($(li_element).children("ul"))
            get_subgroup(li_element, g_name, g_hash)
        else
            $(li_element).children().show()

group_menu_back = () ->
    $("li.main_group").show()
    $("#groups_list").find("li.main_group").removeClass("active_group")
    $(".subgroup_c").hide()
    $(".subgroup_c").find("input[type=checkbox]").prop('checked', false)
    $(".subgroup_c").find("input[type=checkbox]").prop('disabled', false)
    $(".choice_container").removeClass("choice_disabled")


get_parameters = () ->
    params = ""
    $(".active_group").find("input[type=checkbox]:checked:enabled").each (index, element) =>
        params = params + "'"+$(element).attr("name")+"',"
        # alert($(element).attr("name"))
    params = params + ";"
    $("#itemName").val ""
    hash = $(".active_group").attr("inid")
    $.ajax
        type: "GET"
        url: "/1cengine/py_scripts/get_ncatalog_items.py"
        async: true
        data: "hash=" + encodeURIComponent(hash) + "&params=" + encodeURIComponent(params) + ""
        success: (html) ->
            # alert(html)
            App.C_HASH = hash
            App.PAGE = 1
            get_item_table(html)

exclude_parameters = (chk_box) ->
    preload_header = {
        backgroundImage: "url('/1cengine/nsite/images/input_preloader.png')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right center"
    }
    $(".choice_header").css( preload_header )
    params = ""
    $(".active_group").find("input[type=checkbox]:checked:enabled").each (index, element) =>
        params = params + "'"+$(element).attr("name")+"',"
        # alert($(element).attr("name"))
    params = params + ";"
    $("#itemName").val ""
    hash = $(".active_group").attr("inid")
    $.ajax
        type: "GET"
        url: "/1cengine/py_scripts/get_excluded.py"
        async: true
        data: "params=" + encodeURIComponent(params) + "&hash=" + encodeURIComponent(hash) + ""
        success: (html) ->
            param_string = html
            # alert(param_string)
            $(".active_group").find("input[type=checkbox]").each (index, element) =>
                $(element).parent().removeClass("choice_disabled")
                $(element).prop('disabled', false)
                if param_string.indexOf($(element).attr("name")) > -1
                    $(element).prop('checked', false)
                    $(element).prop('disabled', true)
                    $(element).parent().addClass("choice_disabled")
                    # alert($(element).attr("name"))

            # App.C_HASH = hash
            # get_item_table(html)
            $(".choice_header").css(
                "background-image", "none"
                )

get_item_table = (html) ->
    $("#qRes").html html
    $("#qRes").fadeIn(400)
    if $(".item").length >= 1
        $("#hollowResult").empty()
    else
        $("#hollowResult").html "<p class='hollow_result'>Извините, но по заданному запросу товар не найден</p>"

    if $(".item").length is 20
        $("#show_next_prev").show()
    else
        if App.PAGE == 1
            $("#show_next_prev").hide()

    $("body").css("cursor", "default")

    $(".bItem").click ->
        # alert("lol")
        elem_id = $(this).attr("name")
        char_id = $(this).closest( "table" ).find($(".item_billet_select_char option:selected")).attr("name")
        if char_id is undefined
            char_id = "0"
        nid = (char_id+":"+elem_id)
        item = App.Item.elem_exist(nid)
        if item is false
            item = new App.Item nid
        else
            item.show_modal()

    $(".oItem").click ->
        # alert("lol")
        elem_id = $(this).attr("name")
        char_id = $(this).closest( "table" ).find($(".item_billet_select_char option:selected")).attr("name")
        if char_id is undefined
            char_id = "0"
        nid = (char_id+":"+elem_id)
        item = App.Item.elem_exist(nid)
        if item is false
            item = new App.Item nid
        else
            item.show_modal()

    $(".more").click ->
        name = $(this).attr("name")
        $("##{name}").hide()
        $(".#{name}").show()
        return

    $(".less").click ->
        name = $(this).attr("name")
        $("##{name}").show()
        $(".#{name}").hide()
        return

    $(".eye").each (index, element) =>
        img_class = $(element).attr('class').split(' ')[1]
        $(element).tooltipster({
            content: "<img src='images/eye_pic/"+img_class+".png' />",
            animation: 'fade',
            position: 'top',
            trigger: "click",
            theme: "tooltipster-my",
            contentAsHTML: true
        })

    $(".more_colors").each (index, element) =>
        colors = $("#"+$(element).attr("ralid")).find(".r_c")
        $(element).tooltipster({
            content: colors,
            animation: 'fade',
            position: 'top',
            trigger: "click",
            theme: "tooltipster-my",
            contentAsHTML: true,
            interactive: true,
            functionReady: ->
                # console.log("span[ralid='"+$(element).attr("ralid")+"']")
                c_ral = $(".tooltipster-content").find("span[ralid='"+$(element).attr("ralid")+"']")
                c_ral.addClass("active_ral")

                $(".tooltipster-content").find("span").click ->
                    name = $(this).attr("ralid")
                    o_ral = $(c_ral).attr("ralid")
                    $(".#{o_ral}").hide()
                    $(".#{name}").show()
                    $(element).tooltipster('hide')

        })

    $(".item_billet_select_char").change ->
        char = $(this).parent().find($(".item_billet_select_char option:selected")).attr("name")
        stock = $(this).parent().find($(".item_billet_select_char option:selected")).attr("stock")
        # alert(stock)
        $(this).parent().parent().parent().parent().find($(".item_billet_select_price")).removeClass("selected_price")
        $(this).parent().parent().parent().parent().find(".item_billet_select_price").each (index, element) =>
            if $(element).attr("for") is char
                # alert(char)
                $(element).addClass("selected_price")

        if stock is "0.0" or stock is "0" or stock is ""
            # alert(stock)
            c_button = $(this).parent().parent().parent().parent().find(".bItem")
            c_button.removeClass("bItem").addClass("oItem")
            c_button.find(".buySpan").html("Под заказ")
        else
            # alert(stock)
            c_button = $(this).parent().parent().parent().parent().find(".oItem")
            c_button.removeClass("oItem").addClass("bItem")
            c_button.find(".buySpan").html("Рассчитать")

    params = ""
    $(".active_group").find("input[type=checkbox]:checked:enabled").each (index, element) =>
        params = params + "'"+$(element).attr("name")+"',"
        # alert($(element).attr("name"))
    params = params + ";"

    value = $("#itemName").val()
    value = value.replace("+", " ")

    if value is ""
        what = "hash"
        data_string = what + "=" + encodeURIComponent(App.C_HASH) + "&params=" + encodeURIComponent(params) + ""
    else
        what = "term"
        data_string = what + "=" + encodeURIComponent(value)

    $.ajax
        type: "GET"
        url: "/1cengine/py_scripts/get_ncatalog_count_items.py"
        async: true
        data: data_string
        success: (html) ->
            # alert(html)
            App.PAGE_COUNT = Math.ceil(html / 20)
            i = 1
            page_list = "<ul>"
            # alert(App.PAGE)
            App.PAGE
            while i != App.PAGE_COUNT+1
                if i == App.PAGE
                    page_list = page_list + "<li name='#{i}' class='active_page'>#{i}</li>"
                else
                    page_list = page_list + "<li name='#{i}'>#{i}</li>"
                i++
            page_list = page_list + "</ul>"
            $(".count_all_result").html (page_list)

            $(".count_all_result").find("li").each (index, element ) =>
                $(element).click ->
                    page_needed = $(this).attr("name")
                    App.PAGE = (page_needed-1)
                    $(".next_result").click()


App.setCookie = (name, value, days) ->
    if days
        date = new Date()
        date.setTime date.getTime() + (days * 24 * 60 * 60 * 1000)
        expires = "; expires=" + date.toGMTString()
    else
        expires = ""
    document.cookie = name + "=" + value + expires + "; path=/"

App.getCookie = (name) ->
    nameEQ = name + "="
    ca = document.cookie.split(";")
    i = 0

    while i < ca.length
        c = ca[i]
        c = c.substring(1, c.length)  while c.charAt(0) is " "
        return c.substring(nameEQ.length, c.length)  if c.indexOf(nameEQ) is 0
        i++
    null

App.loadBasket = () ->
    il = App.getCookie('saved_basket')
    if il != null
        il = $.parseJSON(il)
        # console.log(il);
        for i in il
            # console.log(i);
            new_item = new (App.Item)(i.id, true, i)
            App.MyBasket.add_item new_item

highlight_me = () ->
    term =  ($("#itemName").val()).toString()
    $(".itemName").each (i, el) =>
        qarr = ($(el).html()).split("<span")
        query = qarr[0]
        # alert(query)
        match = fuzzy([query], term, false, '<ins>', '</ins>')

        if match[0] != undefined
            if qarr[1] != undefined
                $(el).html(match[0]+"<span"+qarr[1])
            else
                $(el).html(match[0])
        else
            tarr = term.split(" ")
            match = fuzzy([query], tarr[0], false, '<ins>', '</ins>')
            i = 1
            while i < tarr.length
                if match[0] != undefined
                    match2 = fuzzy([match[0]], tarr[i], false, '<ins>', '</ins>')
                    # console.log match2[0]
                    if match2[0] != undefined
                        match[0] = match2[0]
                else
                    match[0] = query

                i = i + 1

            if match[0] != undefined
                if qarr[1] != undefined
                    $(el).html(match[0]+"<span"+qarr[1])
                else
                    $(el).html(match[0])

        # console.log match[0]

$(document).ready ->

    $.blockUI.defaults.css.borderRadius = '10px'
    $.blockUI.defaults.fadeIn = 100
    $.blockUI.defaults.fadeOut = 100
    $.blockUI.defaults.css.backgroundColor = 'white'
    $.blockUI.defaults.css.cursor = 'defaults'
    $.blockUI.defaults.css.boxShadow = '0px 0px 5px 5px rgb(207, 207, 207)'
    $.blockUI.defaults.css.fontSize = '14px'
    $.blockUI.defaults.css.width = '700px'

    $.blockUI.defaults.css.paddingTop = '70px'
    $.blockUI.defaults.css.paddingLeft = '20px'

    App.PAGE = 1

    if $("#tags").css("display") is "none"
        $("#showGroupsDiv").show()
        # alert(1)

    for item of tabs_dict
        name = item
        $("##{name}").click ->
            switch_tabs(this.id)

            # alert(name)

            if name is "switchNotificationDiv"
                yaCounter23067595.reachGoal('GoToBasket');


    $("#itemName").autocomplete(
        source: "/1cengine/py_scripts/ncatalog_item_autocomplete.py",
        autoFocus: false,
        minLength: 0,
        select: (event, ui) ->
            #remember the selected item
            #$(this).data('selected-item', ui.item.label)
            $(this).val(ui.item.label)
            $(this).change()
            $(this).blur()
            $(this).click()
        0
    ).click ->
        $(this).autocomplete "search", $(this).val()

    $("#itemName").change ->
        $(".active_group").removeClass("active_group")
        $(".active_subgroup").removeClass("active_subgroup")
        $("#seotext").html ""
        value = $("#itemName").val()
        value = value.replace("+", " ")
        $("#qRes").fadeOut(400)

        $.ajax
            type: "GET"
            url: "/1cengine/py_scripts/get_ncatalog_clever_search.py"
            async: true
            data: "term=" + encodeURIComponent(value) + ""
            success: (html) ->
                get_item_table(html)
                $(".menu_back_button").click()
                $("#show_next_prev").hide()
                highlight_me()


    $("#searchButton").click ->
        $("#itemName").change



        # $.ajax
        #     type: "GET"
        #     url: "/1cengine/py_scripts/get_ncatalog_count_items.py"
        #     async: true
        #     data: "term=" + encodeURIComponent(value) + ""
        #     success: (html) ->
        #         # alert(html)
        #         App.PAGE_COUNT = Math.ceil(html / 20)
        #         i = 1
        #         page_list = "<ul>"
        #         # alert(App.PAGE)
        #         App.PAGE
        #         while i != App.PAGE_COUNT+1
        #             if i == App.PAGE
        #                 page_list = page_list + "<li name='#{i}' class='active_page'>#{i}</li>"
        #             else
        #                 page_list = page_list + "<li name='#{i}'>#{i}</li>"
        #             i++
        #         page_list = page_list + "</ul>"
        #         $(".count_all_result").html (page_list)

        #         $(".count_all_result").find("li").each (index, element ) =>
        #             $(element).click ->
        #                 page_needed = $(this).attr("name")
        #                 App.PAGE = (page_needed-1)
        #                 $(".next_result").click()

    $(window).on "popstate", (e) ->
        $("#itemName").val(history.state['term'])
        $("#itemName").change()

    $("#showNds").change ->
        if this.checked
            $(".NDSHeader, .itemNdsSumTd, .itemNdsKfTd, .ndsAllsum").show()
        else
            $(".NDSHeader, .itemNdsSumTd, .itemNdsKfTd, .ndsAllsum").hide()

    $("#show_groups").click ->
        show_groups()

    $(".next_result").click ->
        value = $("#itemName").val()
        value = value.replace("+", " ")

        params = ""
        $(".active_group").find("input[type=checkbox]:checked:enabled").each (index, element) =>
            params = params + "'"+$(element).attr("name")+"',"
            # alert($(element).attr("name"))
        params = params + ";"

        if App.PAGE != App.PAGE_COUNT
            n_page = ( App.PAGE * 1 ) + 1

            if value is ""
                what = "hash"
                data_string = what + "=" + encodeURIComponent(App.C_HASH) + "&page=" + n_page + "&params=" + encodeURIComponent(params) + ""
            else
                what = "term"
                data_string = what + "=" + encodeURIComponent(value) + "&page=" + n_page + ""

            $.ajax
                type: "GET"
                url: "/1cengine/py_scripts/get_ncatalog_items.py"
                async: true
                data: data_string
                success: (html) ->
                    App.PAGE++
                    get_item_table(html)




    $(".prev_result").click ->
        value = $("#itemName").val()
        value = value.replace("+", " ")

        params = ""
        $(".active_group").find("input[type=checkbox]:checked:enabled").each (index, element) =>
            params = params + "'"+$(element).attr("name")+"',"
            # alert($(element).attr("name"))
        params = params + ";"


        if App.PAGE != 1
            n_page = App.PAGE - 1

            if value is ""
                what = "hash"
                data_string = what + "=" + encodeURIComponent(App.C_HASH) + "&page=" + n_page + "&params=" + encodeURIComponent(params) + ""
            else
                what = "term"
                data_string = what + "=" + encodeURIComponent(value) + "&page=" + n_page + ""

            $.ajax
                type: "GET"
                url: "/1cengine/py_scripts/get_ncatalog_items.py"
                async: true
                data: data_string
                success: (html) ->
                    App.PAGE--
                    get_item_table(html)


    $("#orderDiv").find(".next_step").click ->
        switch_tabs("switchDeliveryDiv")

    $("#deliveryDiv").find(".next_step").click ->
        switch_tabs("switchNotificationDiv")

    $("#groups_list").find("span.click_name").each (index, element) =>
        group_click(element)

    # $("span.click_name").each (index, sgroup) =>
    #     subgroup_click(sgroup)

    $("span.subgroup2_name").each (index, sgroup) =>
        subgroup_click(sgroup)

    c_url = window.location.pathname

    if c_url.indexOf("catalog/") >= 0
        # console.log "nya"
        el = $(".active_group").find(".click_name")[0]
        g_hash = $(el).parent().attr("inid")
        get_item_list(g_hash)


    $("#i_want_delivery").change ->
        show_dop_uslugi(this)

    $("#i_want_rezka").change ->
        show_rezka(this)

    $(".is_city_choose").click ->
        $(".active_city").removeClass("active_city")
        $(this).addClass("active_city")
        App.load_delivery_cost()

    $(".city_select").change ->
        $(".delivery_cost").html $(".city_select option:selected").val()
        # alert($(".city_select option:selected").val())

    $(".howtomakeorder").click ->
        show_how_to_make_order()

    $(".return_to_catalog").click ->
        $("#tabPrice").click()

    $(".more").click ->
        name = $(this).attr("name")
        $("##{name}").hide()
        $(".#{name}").show()
        return

    $(".less").click ->
        name = $(this).attr("name")
        $("##{name}").show()
        $(".#{name}").hide()
        return

    $(".menu_back_button").click ->
        group_menu_back()

    $(".sungroup_show_button").click ->
        get_parameters()

    $(".sidebar_checkbox").click ->
        exclude_parameters()

    my_content = $('<a href=# onClick="$(\'.sungroup_show_button\').click(); return false">Выбрать</a>')

    $(".sidebar_checkbox").tooltipster({
        content: my_content,
        interactive: true,
        animation: 'fade',
        delay: 200,
        position: 'right',
        offsetX: 100,
        timer: 3000,
        trigger: "click",
        theme: "tooltipster-my"
    })
