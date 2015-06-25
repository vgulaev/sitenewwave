$(document).ready( function(){
   
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

    // $("dateFrom").change( function(){ shippingDate("up") })

    $(".datePickButton").click( function(){
        $("#dateForm").submit()
    })
})

function after_get_list(){
     /// Открытие ссылок для загрузки ///

     $(".show_order_download").each(function(){

        info_content = ($(this).parent().find(".orderDownload").html())
        $(this).tooltipster({
            content: info_content,
            contentAsHTML: true,
            animation: 'fade',
            delay: 200,
            position: 'right',
            trigger: "hover",
            theme: "my-info-theme",
            interactive: true
        })
    })

}


function logout(){
    $.removeCookie("sid",{ expires: 30, path: '/'})
    window.location = "/kabinet/authorization/"
}

function pass(){
    // alert(1)
    var elements = $.makeArray($(".shippingItem"))
    elements.reverse()
    // alert(elements)
    $("#shippingsContainer").empty()
    $("#shippingsContainer").append(elements)

    if( $(".date_arrow").attr("way") == "down" ){
        $(".date_arrow").attr("way", "up")
        $(".date_arrow").html("▴")
    } else if( $(".date_arrow").attr("way") == "up" ){
        $(".date_arrow").attr("way", "down")
        $(".date_arrow").html("▾")
    }


}

// Returns a random integer between min and max
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/// Функция получения табличной части

function showTabPart(UID){

    if( $(".close_button[goal='"+UID+"']").length ){

        $(".close_button[goal='"+UID+"']").parent().show()
        $("tr[name='"+UID+"']").addClass("tab_part_show")

    } else {

        $.ajax({
            type: "GET",
            url: "/1cengine/py_scripts/get_tab_part_shipping.py",
            async: true,
            data: "UID=" + UID + "",
            success: function(html) {
                // alert(html)
                $(html).insertAfter($("tr[name='"+UID+"']"))
                $("tr[name='"+UID+"']").addClass("tab_part_show")

                $("div.close_button").click( function(){
                    // alert(1)
                    $(this).parent().hide()
                    uid = $(this).attr("goal")
                    $("tr[name='"+UID+"']").removeClass("tab_part_show")
                })
            }
        })
    }
}


/// функция получения ссылки для скачивания. Скоммунизжена из modern_uiJS ж))) ///

function openLink(linkUID, type) {

    downloader_array = new Array("285","365","377","379","382","385")
    
    $.blockUI.defaults.css.bshippingRadius = '10px'; //убираем серую границу
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
            <img src='/1cengine/kabinet_shipping/" + downloader_array[getRandomInt(0, 5)] + ".png' />\
        </div>"
    });
    $.ajax({
        type: "POST",
        url: "/1cengine/php_scripts/getShippingFileLink.php",
        async: true,
        data: "linkUID=" + linkUID + "&type=" + type + "",
        success: function(html) {
            //var success = 'true';
            $.unblockUI();
            window.open(html, "_blank")
            // window.location.href = html
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
