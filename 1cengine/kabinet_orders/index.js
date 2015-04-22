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

    // $("dateFrom").change( function(){ orderDate("up") })

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

    $(".manager_show").each(function(){

        info_content = ($(this).parent().find(".m_info_wrapper").html())
        $(this).tooltipster({
            content: info_content,
            contentAsHTML: true,
            animation: 'fade',
            delay: 200,
            position: 'top',
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

    if( $(".date_arrow").attr("way") == "down" ){
        $(".date_arrow").attr("way", "up")
        $(".date_arrow").html("▴")
    } else if( $(".date_arrow").attr("way") == "up" ){
        $(".date_arrow").attr("way", "down")
        $(".date_arrow").html("▾")
    }

    after_get_list()

}

// Returns a random integer between min and max
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/// функция получения ссылки для скачивания. Скоммунизжена из modern_uiJS ж))) ///

function openLink(linkUID, type, what) {

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

    if(what=="order"){
        $.ajax({
            type: "POST",
            url: "/1cengine/php_scripts/getfilelink.php",
            async: true,
            data: "linkUID=" + linkUID + "&type=" + type + "",
            success: function(html) {
                //var success = 'true';
                $.unblockUI();
                window.open(html, "_blank")
                // alert(html)
            }
        });
    } else if(what=="rezka"){
        $.ajax({
            type: "POST",
            url: "/1cengine/php_scripts/getRezkaFileLink.php",
            async: true,
            data: "linkUID=" + linkUID + "&type=" + type + "",
            success: function(html) {
                //var success = 'true';
                $.unblockUI();
                window.open(html, "_blank")
                // alert(html)
            }
        });
    }
}

