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
            if $(element).attr("class") is "itemChar" and @is_kis is false
                @char = $(element).text()

            if ( $(element).attr("class").indexOf "price", 0 ) is 0
                @prices.push ($(element).children( "span" ).text()).replace(/\u00a0/g, "").replace(" ", "").replace(",00", "").replace(",", ".")


    change_buy_count: (count) ->
        # alert(count)
        @buy_count = Math.ceil(count)
        @buy_length = (@buy_count * @length).toFixed(2)

        @buy_weight = (( @buy_length * @weight * @kf ) / 1000 ).toFixed(3)
        $(".buy_weight").removeClass("preloading")
        $(".buy_count").removeClass("preloading")
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
            price_index = App.MyBasket._active_price_measured
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

        time_out_handle = 0

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

        $(".close_button").click ->
            $.unblockUI()

        if @is_measureable()
            $(".buy_count").bind 'change', (event) =>
                @change_buy_count($(".buy_count").val())

            $(".buy_count").bind 'keyup', (event) =>
                $(".buy_weight").addClass("preloading")
                window.clearTimeout(time_out_handle)
                time_out_handle = window.setTimeout (=> @change_buy_count($(".buy_count").val())), 1000


            $(".buy_length").bind 'change keyup', (event) =>
                window.clearTimeout(time_out_handle)
                time_out_handle = window.setTimeout (=> @change_buy_length($(".buy_length").val())), 1000

        $(".buy_weight").bind 'change', (event) =>
            @change_buy_weight($(".buy_weight").val())

        $(".buy_weight").bind 'keyup', (event) =>
            $(".buy_count").addClass("preloading")
            window.clearTimeout(time_out_handle)
            time_out_handle = window.setTimeout (=> @change_buy_weight($(".buy_weight").val())), 1000

        if @is_kis
            $(".char_length").bind 'change keyup', (event) =>
                $(".buy_weight").addClass("preloading")
                window.clearTimeout(time_out_handle)
                time_out_handle = window.setTimeout (=> @change_char_length($(".char_length").val())), 1000
                # @change_char_length($(".char_length").val())

        @change_modal_price()

        $(".add_to_basket").bind 'click', (event) =>

            App.MyBasket.add_item(this)
            $.unblockUI()


        $(".change_in_basket").bind 'click', (event) =>

            App.MyBasket.change_item(this)
            $.unblockUI()
            # alert(Basket._total_weight)


        yaCounter23067595.reachGoal('OpenItem');


    get_modal: ->
        if App.MyBasket.is_in_basket(this)
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
                <p class="list_length">Укажите требуемую длину листа: #{cl_input}</p>
            """
        else
            set_length = ""

        edizm_dict = {
            "т":"Тонны",
            "шт":"Метры пог.",
            "м2":"Метры кв.",
            "кв.м.":"Метры кв.",
            "кв. м.":"Метры кв.",
            "пог.м":"Метры пог.",
            "пог. м":"Метры пог."
            }

        c_izm = edizm_dict["#{@ed_izm}"]




        message = """
        <div class="buy_item_div">
        <span class="close_button">x</span>
        <span class="buy_item_name">#{@name}</span> <br />
        <span class="buy_item_name">Длина: #{@char}</span>
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
        <div class="basket_item_overall">*В корзине товар на: <span class="basket_price">#{App.MyBasket._sum}</span></div>
        <span class="popUpContinue">#{modal_link}</span>
        </div>""";

        message