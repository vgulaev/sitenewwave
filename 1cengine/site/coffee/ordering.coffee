class Item
    constructor: (@id) ->
        @set_chars()

        console.log @name
        console.log @char
        console.log @length
        console.log @weight
        console.log @kf
        for price in @prices
            console.log price


        $.blockUI
            message: @get_modal()


    get_chars: ->
        response = null
        $.ajax
            type: "POST"
            url: "/1cengine/py_scripts/get_item_char.py"
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

        @prices = []
        obj = $("tr[id='#{@id}']")
        $(obj).children().each (index, element) =>
            if $(element).attr("class") is "itemName"
                @name = $(element).children("[itemprop='name']").text()
            if $(element).attr("class") is "itemChar"
                @char = $(element).text()

            if ( $(element).attr("class").indexOf "price", 0 ) is 0
                @prices.push $(element).children( "span" ).text()

    get_modal: ->
        message = """
        <div class="buy_item_div">
        <span class="buy_item_name"><<Имя товара>></span>
        <table class="buy_item_table">
        <tr class="buy_item_head">
        <th></th>
        <th>Метры</th>
        <th>Штуки</th>
        <th>Тонны</th>
        </tr>
        <tr class="buy_item_count">
        <td>Количество</td>
        <td>
            <input />
        </td>
        <td>
            <input />
        </td>
        <td>
            <input />
        </td>
        </tr>
        <tr class="buy_item_price">
        <td>Стоимость</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        </tr>

        </table>
        <div class="buy_item_overall">Итого: </div>
        </div>""";

        message


$(document).ready ->
    $(".bItem").click ->
        item = new Item $(this).closest( "tr" ).attr("id")
