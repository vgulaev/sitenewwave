$(document).ready( function(){
    /// Открытие ссылок для загрузки ///
    $(".orderItem").click( function(){
        $(".orderDownload").hide()
        $(".ar_img").attr("src","/1cengine/kabinet_orders/arrow.svg")
        // alert(0)
        $(this).find(".ar_img").each( function(){
            // alert("nya")
            $(this).attr("src","/1cengine/kabinet_orders/arrow_down.svg")
        })
        $(this).find(".orderDownload").each( function(){
            // alert(1)
            
            $(this).show()
        })

    })  

    $.datepicker.regional['ru'] = {clearText: 'Очистить', clearStatus: '',
            
            closeText: 'Закрыть', closeStatus: '',
            prevText: '<Пред',  prevStatus: '',
            nextText: 'След>', nextStatus: '',
            currentText: 'Сегодня', currentStatus: '',
            monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь',
            'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
            monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн',
            'Июл','Авг','Сен','Окт','Ноя','Дек'],
            monthStatus: '', yearStatus: '',
            weekHeader: 'Не', weekStatus: '',
            dayNames: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
            dayNamesShort: ['вск','пнд','втр','срд','чтв','птн','сбт'],
            dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
            dayStatus: 'DD', dateStatus: 'D, M d',
            dateFormat: 'dd.mm.yy', firstDay: 1, 
            initStatus: '', isRTL: false};

    $.datepicker.setDefaults( $.datepicker.regional[ "ru" ] )
    $(".dateInput").datepicker()

    // $("dateFrom").change( function(){ orderDate("up") })

    $(".datePickButton").click( function(){
        $("#dateForm").submit()
    })
})

function orderDate(way){
    if(way="up"){
        date_string_array = $(".dateFrom").val().split("/")
    }
}

function pass(){
    // alert(1)
    var elements = $.makeArray($(".orderItem"))
    elements.reverse()
    // alert(elements)
    $("#ordersContainer").empty()
    $("#ordersContainer").append(elements)

    if( $(".date_arrow").attr("src") == "/1cengine/kabinet_orders/arrow_down.svg" ){
        $(".date_arrow").attr("src","/1cengine/kabinet_orders/arrow_up.svg")
    } else if( $(".date_arrow").attr("src") == "/1cengine/kabinet_orders/arrow_up.svg" ){
        $(".date_arrow").attr("src","/1cengine/kabinet_orders/arrow_down.svg")
    }

    $(".orderItem").click( function(){
        $(".orderDownload").hide()
        $(".ar_img").attr("src","/1cengine/kabinet_orders/arrow.svg")
        
        $(this).find(".ar_img").each( function(){
            // alert("nya")
            $(this).attr("src","/1cengine/kabinet_orders/arrow_down.svg")
        })
        $(this).find(".orderDownload").each( function(){
            
            $(this).show()
        })

    })
}

// Returns a random integer between min and max
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function logout(){
    $.removeCookie("sid",{ expires: 30, path: '/'})
    window.location = "/kabinet/authorization/"
}

/// функция получения ссылки для скачивания. Скоммунизжена из modern_uiJS ж))) ///

function openLink(linkUID, type) {

    downloader_array = new Array("285","365","377","379","382","385")
    
    $.blockUI.defaults.css.borderRadius = '10px'; //убираем серую границу
    $.blockUI.defaults.fadeIn = 100; //ускоряем появление
    $.blockUI.defaults.fadeOut = 100; //и исчезновение
    //$.blockUI.defaults.css.left = '39%'; //окно будет в центре
    $.blockUI.defaults.css.backgroundColor = 'white'
    $.blockUI.defaults.css.cursor = 'defaults'
    $.blockUI.defaults.css.boxShadow = '0px 0px 5px 5px rgb(207, 207, 207)'
    $.blockUI.defaults.css.fontSize = '14px'
    $.blockUI.defaults.css.width = '450px'
    $.blockUI.defaults.css.height = '220px'
    $.blockUI.defaults.css.paddingTop = '10px'

    $.blockUI({
        message: "\
        <div id='wait_please'>Ваш запрос обрабатывается, пожалуйста, подождите<br />\
            <img src='/1cengine/kabinet_orders/" + downloader_array[getRandomInt(0, 5)] + ".png' />\
        </div>"
    });
    $.ajax({
        type: "POST",
        url: "/1cengine/php_scripts/getPaymentFileLink.php",
        async: true,
        data: "linkUID=" + linkUID + "&type=" + type + "",
        success: function(html) {
            //var success = 'true';
            $.unblockUI();
            window.location.href = html
            // alert(html)
        }
    });
}


// функция отправки сообщения техподдержке

function send_support(){
    $.blockUI.defaults.css.borderRadius = '10px'; //убираем серую границу
    $.blockUI.defaults.fadeIn = 100; //ускоряем появление
    $.blockUI.defaults.fadeOut = 100; //и исчезновение
    //$.blockUI.defaults.css.left = '39%'; //окно будет в центре
    $.blockUI.defaults.css.backgroundColor = 'white'
    $.blockUI.defaults.css.cursor = 'defaults'
    $.blockUI.defaults.css.boxShadow = '0px 0px 5px 5px rgb(207, 207, 207)'
    $.blockUI.defaults.css.fontSize = '14px'
    $.blockUI.defaults.css.width = '450px'
    $.blockUI.defaults.css.height = '220px'
    $.blockUI.defaults.css.border = 'none'

    $.blockUI({
        message: "\
        <span class='p_close_button'>x</span>\
        <div>\
            <textarea class='ss_textarea' placeholder='Введите ваше сообщение здесь'></textarea>\
            <span class='send_support_button'>Отправить сообщение в тех.поддержку</span>\
        </div>"
    });

    $(".send_support_button").click( function(){
        $.ajax({
            type: "POST",
            url: "/1cengine/py_scripts/send_support.py",
            async: true,
            data: "text=" + $(".ss_textarea").val()+"&href="+window.location.pathname,
            success: function(html){
                console.log(html)
                $.unblockUI();
            }
        })
    })

    $(document).on('keyup', function(e) {
        e.preventDefault();
        if (e.which === 27) {
            $.unblockUI();
        }
    });

    $(".p_close_button").click(function() {
        $.unblockUI();
    });

}