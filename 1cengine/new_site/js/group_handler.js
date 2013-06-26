/// показать группы товаров ///

function showGroups() {

    $.blockUI.defaults.css.borderRadius = '10px'; //убираем серую границу
    $.blockUI.defaults.fadeIn = 100; //ускоряем появление
    $.blockUI.defaults.fadeOut = 100; //и исчезновение
    //$.blockUI.defaults.css.left = '39%'; //окно будет в центре
    $.blockUI.defaults.css.backgroundColor = 'white'
    $.blockUI.defaults.css.cursor = 'defaults'
    $.blockUI.defaults.css.boxShadow = '0px 0px 5px 5px rgb(207, 207, 207)'
    $.blockUI.defaults.css.fontSize = '14px'
    $.blockUI.defaults.css.width = '700px'
    $.blockUI.defaults.css.height = '370px'
    $.blockUI.defaults.css.paddingTop = '70px'
    $.blockUI.defaults.css.paddingLeft = '20px'


    $.blockUI({
        message: $("#tags")
    });
    $(".blockMsg").draggable();

}

$("#popUpOrderClose").click(function() {
        $.unblockUI()
    })

/// Попап наименований групп ///
$("td.iRefTd").mouseenter(function() {
    // alert('in')
    var elem = this
    var spWidth = 0
    myTimer = window.setTimeout(function() {
        $(elem).css({
            border: "1px solid rgb(45, 54, 148)",
            position: "absolute",
            backgroundColor: "white",
            boxShadow: "0px 0px 5px 5px rgb(207, 207, 207)",
            zIndex: "11"
        })
        $(elem).find("span").each(function() {
            spWidth = this.offsetWidth
            spWidth = spWidth + 170
        })
        $(elem).animate({
            width: spWidth + "px",
            height: "80px"
        }, 450)
        $(elem).find("span").each(function() {
            $(this).animate({
                fontWeight: "bold",
                paddingTop: "30px",
                height: "51px",
                display: "block"

            }, 500)

        })
        $(elem).find("div").each(function() {
            $(this).animate({
                width: "100px",
                height: "51px",
                marginTop: "15px",
                marginLeft: "10px"
            })
            $(this).css({
                backgroundPosition: "0 0"
            })
        })

    }, 1000)


}).mouseleave(function() {
    clearTimeout(myTimer)
    $(this).css({
        border: "none",
        position: "relative",
        backgroundColor: "none",
        boxShadow: "none",
        zIndex: "1"
    })
    $(this).css({
        width: "200px",
        height: "70px"
    })
    $(this).find("span").each(function() {
        $(this).css({
            fontWeight: "lighter",
            paddingTop: "0px",
            height: "auto",
            display: "block",
            float: "left"
        })

    })
    $(this).find("div").each(function() {
        $(this).css({
            width: "50px",
            height: "36px",
            backgroundPosition: "50px 36px",
            marginTop: "0px",
            marginLeft: "0px"
        })
    })
})