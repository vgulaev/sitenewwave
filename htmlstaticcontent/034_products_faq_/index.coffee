$(document).ready ->
    $(".headliner").click ->
        $(".headliner").removeClass("active")
        $(this).addClass("active")
        $(".answer_text").fadeOut(400)
        text_block = $(this).parent().find(".answer_text")

        text_block.fadeIn(400)