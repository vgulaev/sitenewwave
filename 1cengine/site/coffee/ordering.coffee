class Item
    constructor: (@id) ->
        @get_chars()
        @set_name()

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

    set_name: () ->
        console.log $("tr#3a3917a0-3fb3-11d9-a449-505054503030:895a109c-3966-11d9-a448-505054503030")
        console.log @id

            

$(document).ready ->
    $(".bItem").click ->
        item = new Item $(this).closest( "tr" ).attr("id")

    console.log $("#3a3917a0-3fb3-11d9-a449-505054503030:895a109c-3966-11d9-a448-505054503030").attr("id")