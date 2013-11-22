class Item
    constructor: (@id) ->
        @get_chars()

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

        @set_chars(response)

    set_chars: (chars) ->
        char_array = chars.split "|"
        @length = char_array[0]
        @weigth = char_array[1]
        @kf     = char_array[2]
            

$(document).ready ->
    $(".bItem").click ->
        item = new Item $(this).closest( "tr" ).attr("id")