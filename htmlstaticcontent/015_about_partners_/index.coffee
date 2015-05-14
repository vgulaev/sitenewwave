class SwitchingTable
    @tabs = []
    @c_tab

    constructor: (@id, @headers_class) ->
        @populate()

    populate: () ->
        @tabs = $("##{@id}").find(".#{@headers_class}")

        $(@tabs).each (index, elem) =>

            if $(elem).hasClass("c_tab")
                @c_tab = elem

            $(elem).click (e) =>
                # alert($(@c_tab).attr("name"))
                $(@c_tab).removeClass("c_tab")
                c_tabtable_class = $(@c_tab).attr("name")
                $(".#{c_tabtable_class}").fadeOut(400)

                $(elem).addClass("c_tab")
                n_tabtable_class = $(elem).attr("name")
                $(".#{n_tabtable_class}").fadeIn(400)

                @c_tab = elem


$(document).ready ->
    partners_table = new SwitchingTable("partners_table", "pt_header")