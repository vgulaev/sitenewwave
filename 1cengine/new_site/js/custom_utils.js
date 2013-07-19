/// стрелочка промотать вверх страницы ///
$(function() {
    
    function show_scrollTop() {
    	var e = $(".scrollTop");
	    var speed = 500;

	    e.click(function() {
	        $("html:not(:animated)" + (!$.browser.opera ? ",body:not(:animated)" : "")).animate({
	            scrollTop: 0
	        }, 500);
	        return false; //важно!  
	    });
	    //появление  
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


/// Обработка куки ///
if($.cookie("basket") != undefined) {
    eval($.cookie("basket"))
}

$.cookie("basket", null)


/// Разбор GET-параметров ///
var squery = String(document.location).replace(/\%2F/g, "\\")
var squery = String(document.location).replace(/\s\s/g, "\s")
// var squery = String(document.location).replace(/\+/g, "\s")
if(squery.split("?", 2)[1]) {
    parts = squery.split("?", 2)[1].split("&");
    GET = {};
    for(i = 0; i < parts.length; i++) {
        curr = parts[i].split('=');
        GET[curr[0]] = curr[1];
    }
    if(GET['ref'] != undefined) {
        searchItem2(decodeURI(GET['ref']))
        $('#myCanvasContainer').hide();
        $('#tags').hide();
    }


    if(GET['catalog'] != undefined) {
        showGroup2(decodeURI(GET['catalog']))
        $('#myCanvasContainer').hide();
        $('#tags').hide();
    }

    if(GET['linkUID'] != undefined) {
        openLink(GET['linkUID'], GET['type'])
    }
    if(GET['uid'] != undefined) {
        getOrder(decodeURI(GET['uid']))
    }
}