Array::toDict = (key) ->
    @reduce ((dict, obj) -> dict[ obj[key] ] = obj if obj[key]?; return dict), {}

tabs = [
    {
        id: "tabBasket"
        other: [
            "basketDiv",
            "showPriceSpan"
        ]
        counter: [ "tabPrice" ]
    },
    {
        id: "tabPrice"
        other: [
            "pTableContentTab",
            "showBasketSpan"
        ]
        counter: [ "tabBasket" ]
    },
    {
        id: "closeBasket"
        other: [
            "pTableContentTab",
            "showBasketSpan"
        ]
        counter: [ "tabBasket" ]
    },
    {
        id: "switchOrderDiv"
        other: [
            "orderDiv",
            "showNDSlabel"
        ]
        counter: [
            "switchDeliveryDiv",
            "switchNotificationDiv"
        ]
        active_class: "activeDiv"
        inactive_class: "inactiveDiv"
    },
    {
        id: "switchDeliveryDiv"
        other: [
            "deliveryDiv"
        ]
        counter: [
            "switchOrderDiv",
            "switchNotificationDiv"
        ]
        active_class: "activeDiv"
        inactive_class: "inactiveDiv"
    },
    {
        id: "switchNotificationDiv"
        other: [
            "notificationDiv"
        ]
        counter: [
            "switchOrderDiv",
            "switchDeliveryDiv"
        ]
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

$(document).ready ->

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

        $.ajax
            type: "GET"
            url: "/1cengine/py_scripts/get_items_bs.py"
            async: true
            data: "term=" + encodeURIComponent(value) + ""
            success: (html) ->
                $("#qRes").html html
                
                # $(html).appendTo("#tableRes")
                if $(".item").length >= 1
                    $("#tags").hide()
                    $("#showGroupsDiv").show()
                    $("#hollowResult").empty()
                else
                    $("#hollowResult").html "Извините, но по заданному запросу товар не найден"

                    # $('#myCanvasContainer').show();
                    $("#tags").show()
                    $("#showGroupsDiv").hide()
                if $(".item").length is 20
                    $("#showAll").show()
                
                # $('#hollowResult').empty()
                else
                    $("#showAll").hide()
