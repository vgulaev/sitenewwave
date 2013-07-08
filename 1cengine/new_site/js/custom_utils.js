/// стрелочка промотать вверх страницы ///
$(function() {
    var e = $(".scrollTop");
    var speed = 500;

    e.click(function() {
        $("html:not(:animated)" + (!$.browser.opera ? ",body:not(:animated)" : "")).animate({
            scrollTop: 0
        }, 500);
        return false; //важно!  
    });
    //появление  


    function show_scrollTop() {
        ($(window).scrollTop() > 300) ? e.fadeIn(600) : e.hide();
    }
    $(window).scroll(function() {
        show_scrollTop()
    });
    show_scrollTop();
});

/// декодирование спец строк ///

function htmlspecialchars_decode(string, quote_style) {

    string = string.toString();

    // Always encode  
    string = string.replace('/&/g', '&');
    string = string.replace('/</g', '<');
    string = string.replace('/>/g', '>');

    // Encode depending on quote_style  
    if(quote_style == 'ENT_QUOTES') {
        string = string.replace('/"/g', '"');
        string = string.replace("/'/g", '\'');
    } else if(quote_style != 'ENT_NOQUOTES') {
        // All other cases (ENT_COMPAT, default, but not ENT_NOQUOTES)  
        string = string.replace('/"/g', '"');
    }

    return string;
}

/// проверка валидности емейла ///

function isValidEmail(str) {
    return(str.indexOf(".") > 2) && (str.indexOf("@") > 0);
}