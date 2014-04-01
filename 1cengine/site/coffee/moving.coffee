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
                    $("#hollowResult").html "Извините, но по заданному запросу товар не найден"
                    $("#tags").show()
                    $("#showGroupsDiv").hide()

                if $(".item").length is 20
                    $("#showAll").show()
                else
                    $("#showAll").hide()

                window.history.pushState(
                    {term: value},
                    '',
                    '/1cengine/site/'+$.trim(value)+'/'
                )

                $("#show_groups").show()

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
                    $("#tags").hide()
                    $("#showGroupsDiv").show()
                    $("#hollowResult").empty()
                else
                    $("#hollowResult").html "Извините, но по заданному запросу товар не найден"
                    $("#tags").show()
                    $("#showGroupsDiv").hide()

                if $(".item").length is 20
                    $("#showAll").show()
                else
                    $("#showAll").hide()

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



    $("#groups_list").find("li.main_group").each (index, element) =>
        $(element).click ->
            $("#groups_list").find("li.main_group").removeClass("active_group")
            $(element).addClass("active_group")
            g_name = $(this).attr("name")
            $("#itemName").val g_name
            $("#itemName").change()
            # alert($(this).attr("name"))
            if $(element).children().is(".subgroup") is false
                # alert($(element).children("ul"))
                $(element).append("<ul class=\"subgroup\"></ul>")
                $.ajax
                    type: "GET"
                    url: "/1cengine/py_scripts/item_autocomplete.py"
                    async: false
                    data: "term=" + encodeURIComponent(g_name) + ""
                    success: (html) ->
                        subgroups = JSON.parse html
                        for subgroup in subgroups then do (subgroup) =>
                            $(element).find("ul").append("<li>"+subgroup.replace(g_name, "")+"</li>")
                            # alert(subgroup)