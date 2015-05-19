class App.MyBasket
    @_item_list: []
    @_rezka_list: []
    @_sum: 0
    @_count: 0
    @_total_weight: 0
    @_total_running_meter: 0
    @_active_price_measured: 0
    @_active_rm_price_measured: 0

    @is_in_basket: (item) ->
        index = @_item_list.indexOf(item)
        if index is -1
            false
        else
            true

    @find_by_id: (id) ->
        flag = false
        for item in @_item_list
            if item.id is id
                flag = true
                break
        if flag
            item
        else
            false

    @add_item: (item) ->
        index = @_item_list.indexOf(item)
        if index is -1
            @_item_list.push item
            @_sum = ( (+item.final_price) + (+@_sum) ).toFixed(2)
            if item.ed_izm is "т"
                @_total_weight = ( parseFloat(item.buy_weight) + parseFloat(@_total_weight) ).toFixed(3)
            if item.ed_izm is "пог. м"
                @_total_running_meter = ( parseFloat(item.buy_weight) + parseFloat(@_total_running_meter) ).toFixed(3)


            @_count++

            # @change_basket()

            # alert(@_total_running_meter)

            @on_weight_change_handler(@_total_weight)
            @on_running_meter_change_handler(@_total_running_meter)
            @on_active_price_measured_change_handler()

            i_id = "##{item.id}".replace(":", "\\:")
            # alert($("#{i_id}").attr("class"))
            # $("#tableRes").find("##{item.id}")
            $("#{i_id}").addClass("in_basket")



            # $( "#tabBasket" ).tooltip({
            #     content: "Товар добавлен в корзину",
            #     position: { my: "left+15 center", at: "right center" },
            #     show: { effect: "drop" },
            #     open: (event, ui) ->
            #         setTimeout (->
            #             $(ui.tooltip).hide { effect: "drop" }
            #             return
            #         ), 3000
            #         return
            # })
            # $("#tabBasket").tooltip().off("mouseover mouseout");

            # $( "#tabBasket" ).tooltip( "enable" )
            # $( "#tabBasket" ).tooltip( "open" )

            $("#tabBasket").tooltipster("show")

            yaCounter23067595.reachGoal('AddItem');

    @change_item_from_modal: (item) ->
        @change_item(item)
        @on_weight_change_handler(@_total_weight)
        @on_running_meter_change_handler(@_total_running_meter)
        @on_active_price_measured_change_handler()
        # @change_basket()

    @change_item: (item) ->
        # alert("lol")
        index = @_item_list.indexOf(item)
        if index > -1
            @_sum = 0
            @_total_weight = 0
            for elem in @_item_list
                @_sum = ( (+elem.final_price) + (+@_sum) ).toFixed(2)
                @_total_weight = ( (+elem.buy_weight) + (+@_total_weight) ).toFixed(3)

            # @on_weight_change_handler(@_total_weight)
            # @change_basket()
        # @on_active_price_measured_change_handler()

    @delete_item: (id) ->

        item = @find_by_id(id)
        index = @_item_list.indexOf(item)
        if index > -1
            # @_sum = ( (+@_sum) - (+item.final_price) ).toFixed(2)
            # @_total_weight = ( (+@_total_weight) - (+item.buy_weight) ).toFixed(3)
            i_id = "##{item.id}".replace(":", "\\:")
            $("#{i_id}").removeClass("in_basket")


            @_count--
            @_item_list.splice(index,1)
            # alert(@_item_list)

            @_sum = 0
            @_total_weight = 0
            @_total_running_meter = 0
            for elem in @_item_list
                @_sum = ( (+elem.final_price) + (+@_sum) ).toFixed(2)
            if item.ed_izm is "т"
                @_total_weight = ( parseFloat(item.buy_weight) + parseFloat(@_total_weight) ).toFixed(3)
            if item.ed_izm is "пог. м"
                @_total_running_meter = ( parseFloat(item.buy_weight) + parseFloat(@_total_running_meter) ).toFixed(3)


                # @change_basket()

                @on_weight_change_handler(@_total_weight)
                @on_running_meter_change_handler(@_total_running_meter)
                @on_active_price_measured_change_handler()

        @change_basket()

    @get_count: ->
        @_count

    @change_basket: ->
        # alert(@_sum)
        $(".basketCount").html(@_count)
        $(".lItemTab").empty()
        for item in @_item_list
            $(".#{item.ed_izm.replace('.','\\.').replace(' ','')}").append(@create_row(item))
            # $("#lItemTab").append(@create_row(item))

            $("tr[name='#{item.id}']").find(".delete_from_basket").bind "click", (event) =>
                target = $(event.currentTarget)
                App.MyBasket.delete_item(target.closest( "tr" ).attr("name"))

            $("tr[name='#{item.id}']").find(".edit_from_basket").bind "click", (event) =>
                target = $(event.currentTarget)
                element = @find_by_id(target.closest( "tr" ).attr("name"))
                element.show_modal()

                # @change_basket()

        nds = ( ( @_sum / 100 ) * 18 ).toFixed(2)
        $("#SumGoods").html(@_sum.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&thinsp;').replace(".",","))
        $("#CountAll").html(@_total_weight.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&thinsp;').replace(".", ","))
        $("#NDSAll").html(nds)

        App.load_delivery_cost()
        # alert("changed")

    @rebuild_basket: ->


    @create_row: (item) ->
        nds = ( ( item.final_price / 100 ) * 18 ).toFixed(2).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&thinsp;').replace(".",",")
        price_td = item.price_weight.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&thinsp;').replace(".",",")
        sum_td = item.final_price.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&thinsp;').replace(".",",")
        count_td = item.buy_weight.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1&thinsp;').replace(".",",")
        if item.buy_count is undefined
            count_unit_td = "&#151;"
        else
            count_unit_td = item.buy_count
        row = """
            <tr class="itemTr" name="#{item.id}">
            <td>#{@_item_list.indexOf(item)+1}</td>
            <td class='itemNameTd'>#{item.name}</td>

            <td class='itemCharTd'>#{item.char}</td>


            <td class='itemCountTd'>#{count_td}</td>
            <td class='itemEdIzmTd'>#{item.ed_izm}</td>
            <td class='itemCountUnitTd'>#{count_unit_td}</td>
            <td class='itemPriceTd'>#{price_td}</td>
            <td class='itemNdsKfTd'>18%</td>
            <td class='itemNdsSumTd'>#{nds}</td>
            <td class='itemSumTd'>#{sum_td}</td>
            <td class='itemEdit'>
                <span class="delEdSpan">
                <a class="edit_from_basket" href="Редактировать" onClick="return false"><img src="/1cengine/site/images/cart_edit.png" /></a></span>
                <a class="delete_from_basket" href="Убрать из корзины" onClick="return false"><img src="/1cengine/site/images/cart_delete.png" /></a>
            </td>
            </tr>
        """

    @on_weight_change_handler: (weight) ->

        if weight < 2
            @_active_price_measured = 0
        if weight >= 2 and weight < 8
            @_active_price_measured = 1
        if weight >= 8 and weight < 15
            @_active_price_measured = 2
        if weight >= 15
            @_active_price_measured = 3

        weight

    @on_running_meter_change_handler: (running_meter) ->

        if running_meter < 100
            @_active_rm_price_measured = 0
        if running_meter >= 100 and running_meter < 200
            @_active_rm_price_measured = 1
        if running_meter >= 200
            @_active_rm_price_measured = 2

        running_meter

    # @observe @_total_weight,  ->
    #     @on_weight_change_handler(newval)
    #     @_total_weight = newval


    @on_active_price_measured_change_handler: ->
        @update_price()

        @_active_price_measured

    # @observe @_active_price_measured, ->
    #     @on_active_price_measured_change_handler()
    #     @_active_price_measured = newval

    @update_price: ->
        for item in @_item_list
            item.set_price_weight()
            item.set_final_price()

            @change_item(item)
            @change_basket()


    constructor: () ->
