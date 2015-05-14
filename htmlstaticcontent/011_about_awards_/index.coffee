class RoundSwitcher
    @elem_list = []
    @c_index
    constructor: (@container_id, @elem_class, @active_class) ->
        @populate_list()

    populate_list: () ->
        container = $("##{@container_id}")
        @elem_list = $(container).find(".#{@elem_class}")
        @elem_count = @elem_list.length
        $(@elem_list).each (index, elem) =>
            if $(elem).hasClass("#{@active_class}") is true
                @c_index = index
                $(elem).find("img").fadeIn(400)

    switch_right: () ->
        c_element = @elem_list[@c_index]
        new_index = @c_index - 1
        if new_index < 0
            new_index = @elem_count - 1
        new_element = @elem_list[new_index]

        $(c_element).find("img").fadeOut(400)
        $(c_element).removeClass("#{@active_class}")
        $(new_element).find("img").fadeIn(400)
        $(new_element).addClass("#{@active_class}")

        @c_index = new_index

    switch_left: () ->
        c_element = @elem_list[@c_index]
        new_index = @c_index + 1
        if new_index is @elem_count
            new_index = 0
        new_element = @elem_list[new_index]

        $(c_element).find("img").fadeOut(400)
        $(c_element).removeClass("#{@active_class}")
        $(new_element).find("img").fadeIn(400)
        $(new_element).addClass("#{@active_class}")

        @c_index = new_index

$(document).ready ->

    diploma_switcher = new RoundSwitcher("rspm","diploma","d_current")
    $("#rspm").find(".arrow_right").click ->
        diploma_switcher.switch_right()
    $("#rspm").find(".arrow_left").click ->
        diploma_switcher.switch_left()

    partners_switcher = new RoundSwitcher("partners","p_award","p_current")
    $("#partners").find(".arrow_right").click ->
        partners_switcher.switch_right()
    $("#partners").find(".arrow_left").click ->
        partners_switcher.switch_left()