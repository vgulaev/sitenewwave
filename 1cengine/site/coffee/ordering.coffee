class Item
    @length = 0
    constructor: (@id) ->
        this.get_chars(@id)
        alert(this.length)

    get_chars: (hash) ->
        $.ajax
            type: "POST"
            url: "/1cengine/py_scripts/get_item_char.py"
            async: true
            data: "item_hash=" + hash
            success: (html) ->
                set_chars(html)

    set_chars: (chars) ->
        char_array = chars.spit("|")

        this.length = char_array[0]
        this.weigth = char_array[1]
        this.kf     = char_array[2]
            

$(document).ready ->
    $(".bItem").click ->
        item = new Item $(this).closest( "tr" ).attr("id")