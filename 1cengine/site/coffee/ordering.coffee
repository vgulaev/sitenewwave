class Item
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
        @count = 1
        @change_buy_count(@count)

        @show_modal()

        Item._existing.push this



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
        @buy_length = ( @buy_weight * 1000 ) / @weight

        @change_modal()
        $(".buy_length").change()

    change_modal: ->
        $(".buy_count").val(@buy_count)
        $(".buy_weight").val(@buy_weight)
        $(".buy_length").val(@buy_length)

    show_modal: ->
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
            message: @get_modal()

        $(".blockMsg").draggable();

        $(document).on "keyup", (e) ->
            e.preventDefault()
            if e.which is 27
                $.unblockUI();

        $(".buy_count").bind 'change', (event) =>

            @change_buy_count($(".buy_count").val())

        $(".buy_length").bind 'change', (event) =>

            @change_buy_length($(".buy_length").val())

        $(".buy_weight").bind 'change', (event) =>

            @change_buy_weight($(".buy_weight").val())


    get_modal: ->
        message = """
        <div class="buy_item_div">
        <span class="buy_item_name">#{@name} #{@char}</span>
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
            <input class="buy_length" pattern="[0-9,\\.]+" value="#{@buy_length}" />
        </td>
        <td>
            <input class="buy_count" pattern="[0-9]+" value="#{@buy_count}" />
        </td>
        <td>
            <input class="buy_weight" pattern="[0-9,\\.]+" value="#{@buy_weight}" />
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

        elem_id = $(this).closest( "tr" ).attr("id")

        item = Item.elem_exist(elem_id)
        if item is false
            item = new Item $(this).closest( "tr" ).attr("id")
        else
            item.show_modal()
