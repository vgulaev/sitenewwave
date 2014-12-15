App.show_rezka_ch_modal = () ->

    table_rows = ""
    for item in App.MyBasket._item_list
        if item.is_measureable()
            if item.id in App.MyBasket._rezka_list
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
    App.MyBasket._rezka_list.length = 0

    $(".rezka_choose_table").find("input").each ->
        if $(this).is(":checked")
            # alert($(this).attr("name"))
            App.MyBasket._rezka_list.push($(this).attr("name"))

            create_rezka()

            $.unblockUI();

create_rezka = () ->
    new_tbody_string = ""
    slice_table = """
        <table class="rezka_table_tt">
            <thead>
                <tr>
                    <th>Длина м.</th>
                    <th>Кол-во шт.</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <input type="textarea" class="rezka_length_input" value="0.2" />
                    </td>
                    <td>
                        <input type="textarea" class="rezka_count_input" value="0" />
                    </td>
                    <td class="rezka_part_delete">
                        <div></div>
                    </td>
                </tr>
            </tbody>
        </table>
    """
    for item in App.MyBasket._item_list
        if item.id in App.MyBasket._rezka_list
                # """<tr>
                #                                                     <td class="rezka_item_name">#{item.name} #{item.char}</td>
                #                                                     <td class="rezka_item_description">
                #                                                         <textarea class="rezka_item_text"></textarea>
                #                                                     </td>
                #                                                     <td class="rezka_item_delete"><div idname="#{item.id}"></div>
                #                                                 </tr>"""
            new_tr = """
                <div class="rezka_item" rid="#{item.id}" name="#{item.name} #{item.char}">
                    <div class="rezka_item_header">#{item.name} #{item.char}
                        <span class="rezka_delete_item" idname="#{item.id}">⤬</span>
                    </div>
                    <span class="red_info">
                        *Максимальная длина отрезка: #{item.char} м
                    </span>
                    <div class="rezka_table_container" max="#{item.length}">
                        #{slice_table}
                        <div class="rezka_part_add"><font>Добавить рез</font></div>
                    </div>
                    <div class="rezka_info_container">
                        <div class="rezka_count_info">
                            <div>Количестуво резов: <span class="rezka_count">X</span></div>
                            <div>Остатки: <span class="rezka_leftovers">Y</span></div>
                        </div>
                        <div class="rezka_count_button">Рассчитать</div>
                        <div class="rezka_price_container" style="display:none">Цена: <span class="rezka_price">Z</span></div>
                    </div>
                </div>
            """
            new_tbody_string = new_tbody_string + new_tr

    $(".rezka_table").html new_tbody_string

    $(".rezka_delete_item").each (index, element) =>
        $(element).click ->
            delete_rezka_item($(element).attr("idname"))

    $(".rezka_part_add").click ->
        $(this).before(slice_table)
        # alert($(this).closest(".rezka_item").attr("id"))
        delete_rezka_part()
        length_input_change()

    $(".rezka_count_button").click ->
        itid = $(this).closest(".rezka_item").attr("rid")
        fill_rezka(itid)

    delete_rezka_part()
    length_input_change()

length_input_change = () ->
    $(".rezka_length_input").change ->
        max_len = $(this).closest(".rezka_table_container").attr("max")

        r_length = $(this).val().replace /,+/g, "."
        if r_length < 0.2
            r_length = 0.2
        else if parseFloat(r_length) > parseFloat(max_len)
            r_length = max_len

        $(this).val(r_length)

delete_rezka_part = () ->
    $(".rezka_part_delete").click ->
        $(this).closest(".rezka_table_tt").remove()

delete_rezka_item = (id) ->
    App.MyBasket._rezka_list.splice(App.MyBasket._rezka_list.indexOf(id), 1)
    create_rezka()

fill_rezka = (itid) ->
    for _item in App.MyBasket._item_list
        if _item.id = itid
            item = _item
            # alert(itid)

    M_len = item.length.replace /,+/g, "."
    M_count = item.buy_count
    rezka_array = []


    # alert($("div[rid='#{item.id}']").attr("class"))


    $("div[rid='#{item.id}']").find(".rezka_table_tt").each (index, element) =>
        r_len = $(element).find(".rezka_length_input").val()
        r_count = $(element).find(".rezka_count_input").val()
        rezka_array.push ([r_len, r_count])

        # alert(r_len + " : " + r_count)

    # alert(JSON.stringify(rezka_array))
    $.ajax
        type: "GET"
        url: "/1cengine/py_scripts/rezka_count.py"
        async: false
        data: "rezka_array=" + JSON.stringify(rezka_array) + "&M=" + M_len + ""
        success: (html) ->
            $("div[rid='#{item.id}']").find(".rezka_show_wrapper").remove()
            $("div[rid='#{item.id}']").append(html)

            rez_count = $("div[rid='#{item.id}']").find(".rezka_show_wrapper").attr("rez_count")
            $("div[rid='#{item.id}']").find(".rezka_count").html rez_count
            rez_price_min = rez_count * 15
            rez_price_max = rez_count * 800
            $("div[rid='#{item.id}']").find(".rezka_price").html rez_price_min + " - " + rez_price_max
            leftovers = $("div[rid='#{item.id}']").find(".rezka_show_wrapper").attr("leftovers")
            $("div[rid='#{item.id}']").find(".rezka_leftovers").html leftovers
