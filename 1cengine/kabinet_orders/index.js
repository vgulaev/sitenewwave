$(document).ready( function(){
    /// Открытие ссылок для загрузки ///
    $(".orderItem").click( function(){
        $(".orderDownload").hide()
        // alert(0)
        $(this).find(".orderDownload").each( function(){
            // alert(1)
            $(this).show()
        })

    })  
    $.datepicker.setDefaults( $.datepicker.regional[ "ru-RU" ] )
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

function parseDate(input){
    // alert(input)
    if(typeof(input)=="string"){
        var parts = input.split(".")    
        return new Date(parts[0], parts[2], parts[1]-1)
    }
    
    // alert(parts)

    
}

function pass(){
    // alert(1)
    var elements = $.makeArray($(".orderItem"))
    elements.reverse()
    // alert(elements)
    $("#ordersContainer").empty()
    $("#ordersContainer").append(elements)
    $(".orderItem").click( function(){
        $(".orderDownload").hide()
        // alert(0)
        $(this).find(".orderDownload").each( function(){
            // alert(1)
            $(this).show()
        })

    })
}

/// функция получения ссылки для скачивания. Скоммунизжена из modern_uiJS ж))) ///

function openLink(linkUID, type) {
    $.ajax({
        type: "POST",
        url: "/1cengine/php_scripts/getfilelink.php",
        async: false,
        data: "linkUID=" + linkUID + "&type=" + type + "",
        success: function(html) {
            //var success = 'true';
            window.location.href = html
            // alert(html)
        }
    });
}

