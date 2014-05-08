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

show_groups = () ->
    $.blockUI.defaults.css.borderRadius = '10px';
    $.blockUI.defaults.fadeIn = 100;
    $.blockUI.defaults.fadeOut = 100;
    $.blockUI.defaults.css.backgroundColor = 'white'
    $.blockUI.defaults.css.cursor = 'defaults'
    $.blockUI.defaults.css.boxShadow = '0px 0px 5px 5px rgb(207, 207, 207)'
    $.blockUI.defaults.css.fontSize = '14px'
    $.blockUI.defaults.css.width = '700px'
    $.blockUI.defaults.css.height = '370px'
    $.blockUI.defaults.css.paddingTop = '70px'
    $.blockUI.defaults.css.paddingLeft = '20px'

    $.blockUI
        message: $("#tags")

    $(".blockMsg").draggable();

    $(document).on "keyup", (e) ->
        e.preventDefault()
        if e.which is 27
            $.unblockUI();

showGroup2 = (term) ->
    $("#itemName").val(term)
    $("#itemName").change()
    $.unblockUI()

load_delivery_cost = () ->
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
                opt_string  = opt_string + "<option value='#{value}'>#{key}</option>"
                # alert html["city"][key]

            $(".city_select").html opt_string

show_dop_uslugi = (chkbox) ->
    if $(chkbox).is(":checked")
        $(".is_in_city").show()
        $(".city_choose").show()
        load_delivery_cost()
    else
        $(".is_in_city").hide()
        $(".city_choose").hide()



$(document).ready ->

    PAGE = 1

    if $("#tags").css("display") is "none"
        $("#showGroupsDiv").show()
        # alert(1)

    for item of tabs_dict
        name = item
        $("##{name}").click ->
            switch_tabs(this.id)


    $("#itemName").autocomplete(
        source: "/1cengine/py_scripts/item_autocomplete.py",
        autoFocus: true,
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
        $("#groupDiv").hide()
        value = $("#itemName").val()
        value = value.replace("+", " ")
        $("#qRes").fadeOut(400)
        $.ajax
            type: "GET"
            url: "/1cengine/py_scripts/get_items_bs.py"
            async: true
            data: "term=" + encodeURIComponent(value) + ""
            success: (html) ->
                $("#qRes").html html
                $("#qRes").fadeIn(400)
                if $(".item").length >= 1
                    $("#tags").hide()
                    $("#showGroupsDiv").show()
                    $("#hollowResult").empty()
                else
                    $("#hollowResult").html "<p class='hollow_result'>Извините, но по заданному запросу товар не найден</p>"

                if $(".item").length is 20
                    $("#show_next_prev").show()
                else
                    $("#show_next_prev").hide()

                window.history.pushState(
                    {term: value},
                    '',
                    '/1cengine/site/'+$.trim(value)+'/'
                )

                $(".bItem").click ->
                    # alert("lol")
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
                false


        $.ajax
            type: "GET"
            url: "/1cengine/py_scripts/get_count_items.py"
            async: true
            data: "term=" + encodeURIComponent(value) + ""
            success: (html) ->
                $(".count_all_result").html html


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

    $("#showAll").click ->

        value = $("#itemName").val()
        value = value.replace("+", " ")

        $.ajax
            type: "GET"
            url: "/1cengine/py_scripts/get_items_bs.py"
            async: true
            data: "term=" + encodeURIComponent(value) + "&show_all=true"
            success: (html) ->
                $("#qRes").html html

                if $(".item").length >= 1
                    $("#hollowResult").empty()
                else
                    $("#hollowResult").html "Извините, но по заданному запросу товар не найден"

                $("#show_next_prev").hide()

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


    $(".next_result").click ->
        value = $("#itemName").val()
        value = value.replace("+", " ")

        $.ajax
            type: "GET"
            url: "/1cengine/py_scripts/get_items_bs.py"
            async: true
            data: "term=" + encodeURIComponent(value) + "&page=" + PAGE+1 + ""
            success: (html) ->
                $("#qRes").html html
                PAGE = PAGE + 1

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


    $(".prev_result").click ->
        value = $("#itemName").val()
        value = value.replace("+", " ")
        if PAGE != 1
            n_page = PAGE - 1
            $.ajax
                type: "GET"
                url: "/1cengine/py_scripts/get_items_bs.py"
                async: true
                data: "term=" + encodeURIComponent(value) + "&page=" + n_page + ""
                success: (html) ->
                    $("#qRes").html html
                    PAGE = PAGE - 1

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

    $("#orderDiv").find(".next_step").click ->
        switch_tabs("switchDeliveryDiv")

    $("#groups_list").find("li.main_group").each (index, element) =>
        $(element).click ->
            g_name = $(this).attr("name")
            if $(element).hasClass("active_group") is false

                $("#itemName").val g_name
                $("#itemName").change()

                $("#groups_list").find("li.main_group").removeClass("active_group")
                $(element).addClass("active_group")

            # alert($(this).attr("name"))
            if $(element).children().is(".subgroup_c") is false
                # alert($(element).children("ul"))
                $(element).append("<ul class=\"subgroup_c\"></ul>")
                $.ajax
                    type: "GET"
                    url: "/1cengine/py_scripts/item_autocomplete.py"
                    async: false
                    data: "term=" + encodeURIComponent(g_name) + ""
                    success: (html) ->
                        subgroups = JSON.parse html
                        for subgroup in subgroups then do (subgroup) =>
                            subgroup_name = subgroup.replace(g_name, "")
                            $(element).find("ul").append("<li class='subgroup' name='#{subgroup_name}'>"+subgroup_name+"</li>")
                            # alert(subgroup)

                        $(element).find("li.subgroup").each (index, sgroup) =>
                            $(sgroup).click ->
                                $(".subgroup").removeClass("active_subgroup")
                                $(sgroup).addClass("active_subgroup")
                                i_name = g_name.replace /^\s+|\s+$/g, "" + " " + $(sgroup).attr("name").replace /^\s+|\s+$/g, ""
                                # alert(i_name)

                                $("#itemName").val(i_name)
                                $("#itemName").change()

    $("li.subgroup").each (index, sgroup) =>
        $(sgroup).click ->
            $(".subgroup").removeClass("active_subgroup")
            $(sgroup).addClass("active_subgroup")
            group = $(sgroup).closest(".active_group")
            g_name = $(group).attr("name")
            i_name = g_name.replace /^\s+|\s+$/g, "" + " " + $(sgroup).attr("name").replace /^\s+|\s+$/g, ""
            # alert(i_name)

            $("#itemName").val(i_name)
            $("#itemName").change()

    c_url = window.location.pathname
    # alert(c_url)
    is_empty = c_url.replace "/1cengine/site/", ""
    # alert($(things[Math.floor(Math.random()*things.length)]).attr("name"))
    if is_empty.length < 3
        things = $("li.main_group")
        $(things[Math.floor(Math.random()*things.length)]).click()

    $("#i_want_delivery").change ->
        show_dop_uslugi(this)

    $(".is_city_choose").click ->
        $(".active_city").removeClass("active_city")
        $(this).addClass("active_city")
        load_delivery_cost()

    $(".city_select").change ->
        $(".delivery_cost").html $(".city_select option:selected").val()
        # alert($(".city_select option:selected").val())