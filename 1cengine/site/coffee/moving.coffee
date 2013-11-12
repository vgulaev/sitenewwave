show_basket = () ->
    
    $("#pTableContentTab").hide()
    $("#basketDiv").show()
    $("#showBasketSpan").hide()
    $("#showPriceSpan").show()
    0
    
    
show_price = () ->
    $("#pTableContentTab").show()
    $("#basketDiv").hide()
    $("#showBasketSpan").show()
    $("#showPriceSpan").hide()
    0

$(document).ready ->

    $("#tabBasket").click ->
        show_basket()
        0
    
    $("#tabPrice").click ->
        show_price()
        0

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
            async: false
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
