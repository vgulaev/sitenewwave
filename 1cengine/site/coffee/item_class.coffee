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

    constructor: (@id, silent = false, i_obj = null) ->
        # alert(@id)
        # console.log silent
        # console.log @name
        # console.log @char
        # console.log @length
        # console.log @weight
        # console.log @kf
        # for price in @prices
        #     console.log price

        if silent != true
            @set_chars()

        if i_obj != null
            # console.log i_obj
            for key, val of i_obj
                this[key] = val

        if @is_measureable()
            @count = 1
            @change_buy_count(@count)
        else
            @buy_weight = "1"
            @change_buy_weight(@buy_weight)

        if silent != true
            @show_modal()

            # console.log this

        App.Item._existing.push this

    is_measureable: ->
        if @length is "0.0" or @length is "0" or @length is ""
            false
        else
            true


    get_chars: ->
        response = null
        # alert(@id)
        $.ajax
            type: "POST"
            url: "/1cengine/py_scripts/get_item_lwkes.py"
            async: false
            data: "item_hash=" + @id
            success: (html) ->
                response = html
                # console.log response
                # alert(response)
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
        @width  = char_array[5]
        @work_width = parseInt(char_array[6], 10) / 1000
        @ai_flag = char_array[7]
        @min_length = char_array[8]
        @max_length = char_array[9]
        # alert(@work_width)

        i_hash = @id.slice 0, @id.indexOf(":")
        i_class = @id.slice @id.indexOf(":") + 1
        # alert(i_hash)
        if i_hash is "0"
            @is_kis = true
            @weight = 2
            @length = 1000
            @char = @weight
            @kf = 1
        else
            @is_kis = false

        if @ed_izm is "шт"
            @pi_flag = true
        else
            @pi_flag = false

        @pm_select_flag = false

        if @ed_izm is "пог. м" or @ed_izm is "пог.м"
            if @width != "" and @width != 0
                @pm_select_flag = true
                # console.log (@pm_select_flag)
                # console.log (@width)

        # alert(i_class)
        # alert(@is_kis)
        @prices = []
        obj = $("tr[lolid='#{i_class}']")
        # alert($(obj).attr("class"))
        @name = $(obj).find("span.billet_item_name").text()
        if @is_kis is false
            @char = $(obj).find($(".item_billet_select_char option:selected")).val()
            if @length is "0.0" or @length is "0" or @length is ""
                if $.isNumeric( @char.replace(",", ".") )
                    @length = @char.replace(",", ".")

        price_ul = $(obj).find(".selected_price")
        $(price_ul).find("li").each (index, element) =>
            # alert($(element).children( "strong" ).text())
            @prices.push ($(element).children( "strong" ).text()).replace(/\u00a0/g, "").replace(" ", "").replace(",00", "").replace(",", ".")

        # $(obj).find().each (index, element) =>
            # if $(element).attr("class") is "billet_item_name"
            #     @name = $(element).children("[itemprop='name']").text()
            # if $(element).attr("class") is "item_billet_select_char" and @is_kis is false
            #     @char = $(element).find($("option:selected")).val()

            # if ( $(element).attr("class").indexOf "price", 0 ) is 0
            #     @prices.push ($(element).children( "span" ).text()).replace(/\u00a0/g, "").replace(" ", "").replace(",00", "").replace(",", ".")


    change_buy_count: (count) ->
        # alert(count)
        @buy_count = Math.ceil(count)
        @buy_length = (@buy_count * @length).toFixed(2)

        if ( @ed_izm is "пог. м" or @ed_izm is "пог.м" ) and @is_kis is false

            @buy_weight = (( @buy_length * @weight * @kf )).toFixed(3)

        else

            @buy_weight = (( @buy_length * @weight * @kf ) / 1000 ).toFixed(3)


        $(".buy_weight").removeClass("preloading")
        $(".buy_count").removeClass("preloading")
        if @pm_select_flag
            $(".wpm").removeClass("preloading")
        @change_modal()

    change_buy_length: (length) ->
        @buy_length = length.replace /,+/g, "."
        @buy_count = @buy_length / @length

        @change_modal()
        $(".buy_count").change()


    change_buy_weight: (weight) ->
        @buy_weight = weight.replace /,+/g, "."


        if @is_measureable()

            if @ed_izm is "пог. м" or @ed_izm is "пог.м"

                @buy_length = ( ( @buy_weight ) / @weight ) / @kf

            else

                @buy_length = ( ( @buy_weight * 1000 ) / @weight ) / @kf

            # @change_modal()
            $(".buy_length").change()

            if @ai_flag
                @change_buy_length(@buy_length.toString())

        @change_modal()

    change_wpm: (wpm) ->

        @buy_wpm = wpm.replace /,+/g, "."

        if @work_width != ""
            @buy_count = Math.ceil(@buy_wpm / @work_width)
        else
            @buy_count = Math.ceil(@buy_wpm / @width)

        $(".buy_count").val(@buy_count)
        $(".buy_count").change()

    change_modal: ->
        # console.log(@ai_flag)
        if @is_measureable()
            $(".buy_count").val(@buy_count)

            $(".buy_length").html(@buy_length)
            if @ai_flag is "s" and not @is_kis
                if @char.indexOf("*") != -1
                    ch_arr = @char.split("*")
                    if $(ch_arr).length = 2
                        unit_square = (ch_arr[0].replace /,+/g, ".") * (ch_arr[1].replace /,+/g, ".")
                        # alert(unit_square)
                        buy_square = (unit_square * @buy_count).toFixed(3)
                        $(".buy_square").html(buy_square)

                else
                    unit_square = parseFloat(@char.replace /,+/g, ".") * parseFloat(@width.replace /,+/g, ".")
                    buy_square = (unit_square * @buy_count).toFixed(3)
                    $(".buy_square").html(buy_square)


        if @is_kis
            $(".char_length").val(@weight)

            if @work_width != ""
                buy_square = (@weight * @work_width * @buy_count).toFixed(3)
            else
                buy_square = (@weight * @buy_weight * @buy_count).toFixed(3)

            $(".buy_square").html(buy_square)

        $(".buy_weight").val(@buy_weight)

        if @pm_select_flag
            # console.log @work_width
            if @work_width != ""
                @buy_wpm = (@buy_count * @work_width).toFixed(3)
                # console.log @buy_count+", "+@work_width
            else
                @buy_wpm = (@buy_count * @width).toFixed(3)

            $(".wpm").val(@buy_wpm)


        @change_modal_price()

    change_modal_price: ->
        @set_price_weight()

        if @is_measureable()
            @price_length = ( ( @price_weight / 1000 ) * @weight ).toFixed(2)
            @price_count = ( ( @price_weight * @buy_weight ) / @buy_count ).toFixed(2)

            # $(".price_length").html(@price_length)
            $(".price_count").html(@price_count)

            if @work_width != ""
                price_pm = (1 / @work_width * @price_count).toFixed(2)
            else
                price_pm = (1 / @width * @price_count).toFixed(2)

            $(".price_pm").html(price_pm)

        $(".price_weight").html(@price_weight)

        @set_final_price()

    set_price_weight: ->
        if @ed_izm is "т"
            price_index = App.MyBasket._active_price_measured
        if @ed_izm is "пог. м" or @ed_izm is "пог.м"
            price_index = App.MyBasket._active_rm_price_measured
        else
            price_index = 0

        @price_weight = ( +@prices[price_index] ).toFixed(2)
        # alert(@price_weight)

    set_final_price: ->
        @set_price_weight()
        @final_price = ( @buy_weight * @price_weight ).toFixed(2)
        $(".final_price").html(@final_price)

    change_char_length: (n_length) ->
        n_length = n_length.replace /,+/g, "."
        if n_length < @min_length
            n_length = @min_length
        else if n_length > @max_length
            n_length = @max_length

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
                if @pm_select_flag
                    $(".wpm").addClass("preloading")
                window.clearTimeout(time_out_handle)
                time_out_handle = window.setTimeout (=> @change_buy_count($(".buy_count").val())), 1000


            $(".buy_length").bind 'change keyup', (event) =>
                window.clearTimeout(time_out_handle)
                time_out_handle = window.setTimeout (=> @change_buy_length($(".buy_length").html())), 1000

        # $(".buy_weight").bind 'change', (event) =>
        #     @change_buy_weight($(".buy_weight").val())

        $(".buy_weight").bind 'change keyup', (event) =>

            $(".buy_count").addClass("preloading")
            window.clearTimeout(time_out_handle)
            time_out_handle = window.setTimeout (=> @change_buy_weight($(".buy_weight").val())), 1000

        if @is_kis
            $(".char_length").bind 'change keyup', (event) =>
                $(".buy_weight").addClass("preloading")
                window.clearTimeout(time_out_handle)
                time_out_handle = window.setTimeout (=> @change_char_length($(".char_length").val())), 1000
                # @change_char_length($(".char_length").val())

        if @pm_select_flag
            $(".wpm").bind 'change keyup', (event) =>
                $(".buy_count").addClass("preloading")
                window.clearTimeout(time_out_handle)
                time_out_handle = window.setTimeout (=> @change_wpm($(".wpm").val())), 1000

        @change_modal_price()

        $(".add_to_basket").bind 'click', (event) =>

            App.MyBasket.add_item(this)
            $.unblockUI()


        $(".change_in_basket").bind 'click', (event) =>

            App.MyBasket.change_item_from_modal(this)
            $.unblockUI()
            # alert(Basket._total_weight)


        yaCounter23067595.reachGoal('OpenItem');

        $(".set_to_w").bind 'click', (event) =>
            $(".buy_weight").parent().hide()
            $(".price_weight").hide()

            $(".wpm").parent().show()
            $(".price_pm").show()

            $(".pm_choice_cont").css("background-image", "url('images/pm_choice_arrows_w.png')")
            $(".set_to_w").addClass("sc_active")
            $(".set_to_l").removeClass("sc_active")

        $(".set_to_l").bind 'click', (event) =>
            $(".wpm").parent().hide()
            $(".price_pm").hide()

            $(".buy_weight").parent().show()
            $(".price_weight").show()

            $(".pm_choice_cont").css("background-image", "url('images/pm_choice_arrows_l.png')")
            $(".set_to_l").addClass("sc_active")
            $(".set_to_w").removeClass("sc_active")


    get_modal: ->
        if App.MyBasket.is_in_basket(this)
            modal_link = '<a class="change_in_basket" href="javascript:void(0)">Изменить</a>'
        else
            modal_link = '<a class="add_to_basket" href="javascript:void(0)">В корзину</a>'


        if @is_measureable()
            # l_input = '<input class="buy_length" pattern="[0-9,\\.]+" value="'+@buy_length+'" />'
            c_input = '<input class="buy_count" pattern="[0-9]+" value="'+@buy_count+'" />'
            if @ai_flag is "l"
                l_input = """<div class="length_item_overall">Общий метраж: <span class="buy_length">#{@buy_length}</span></div>"""
            else if @ai_flag is "s" and not @is_kis
                if @char.indexOf("*") != -1
                    ch_arr = @char.split("*")
                    if $(ch_arr).length = 2
                        unit_square = (ch_arr[0].replace /,+/g, ".") * (ch_arr[1].replace /,+/g, ".")
                        # alert(unit_square)
                        buy_square = (unit_square * @buy_count).toFixed(3)

                        l_input = """<div class="length_item_overall">Общая площадь: <span class="buy_square">#{buy_square}</span></div>"""
                else
                    unit_square = parseFloat(@char.replace /,+/g, ".") * parseFloat(@width.replace /,+/g, ".")
                    buy_square = (unit_square * @buy_count).toFixed(3)
                    $(".buy_square").html(buy_square)

                    l_input = """<div class="length_item_overall">Общая площадь: <span class="buy_square">#{buy_square}</span></div>"""
            else
                l_input = ""
        else
            # l_input = '<input class="buy_length" value="---" disabled />'
            c_input = '<input class="buy_count" value="---" disabled />'
            l_input = ""
        w_input = '<input class="buy_weight" pattern="[0-9,\\.]+" value="'+@buy_weight+'" />'

        if @is_kis
            cl_input = '<input class="char_length" pattern="[0-9,\\.]+" value="'+@weight+'" />'

            set_length = """
                <p class="list_length">Укажите требуемую длину листа: #{cl_input}</p>
            """

            if @work_width != ""
                buy_square = (@weight * @work_width * @buy_count).toFixed(3)
            else
                buy_square = (@weight * @buy_weight * @buy_count).toFixed(3)
            # alert(@width+" x "+@weight)
            l_input = """<div class="length_item_overall">Рабочая площадь: <span class="buy_square">#{buy_square}</span></div>"""
        else
            set_length = ""

        if @pi_flag
            hide_opt = "hide_opt"
        else
            hide_opt = ""

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


        if @pm_select_flag
            wpm = """
                <td class="wpm_td" style="display:none;">
                    <input class="wpm" patter="[0-9,\\.]+" value="#{@buy_wpm}" />
                </td>
            """
            ppm ="""
                <td class="price_pm" style="display:none;">0</td>
            """
            pmcc = """
                <div class="pm_choice_cont">
                    Расчет пог. метров по
                    <span class="set_cont">
                        <span class="set_to_l sc_active">длине</span>
                        <span class="set_to_w">ширине</span>
                    </span>
                </div>
            """
        else
            wpm = ""
            ppm = ""
            pmcc = ""


        message = """
        <div class="buy_item_div">
        <span class="close_button">x</span>
        <span class="buy_item_name">#{@name}</span> <br />
        <span class="buy_item_name">Длина: #{@char}</span>
        #{set_length}
        <table class="buy_item_table">
        <tr class="buy_item_head">
        <th></th>

        <th class="#{hide_opt}">Штуки</th>
        <th>#{c_izm}</th>
        </tr>
        <tr class="buy_item_count">
        <td>Количество</td>

        <td class="#{hide_opt}">
            #{c_input}
        </td>
        <td>
            #{w_input}
        </td>
        #{wpm}
        </tr>
        <tr class="buy_item_price">
        <td>Стоимость за ед.</td>
        <td class="price_count #{hide_opt}">0</td>
        <td class="price_weight">0</td>
        #{ppm}
        </tr>

        </table>


        #{pmcc}
        <div class="buy_item_overall">Итого: <span class="final_price"></span></div>
        #{l_input}
        <div class="basket_item_overall">*В корзине товар на: <span class="basket_price">#{App.MyBasket._sum}</span></div>

        <span class="popUpContinue">#{modal_link}</span>
                </div>""";

        message