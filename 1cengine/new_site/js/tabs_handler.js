
    $("#tabBasket").click(function() {

        $('#pTableContentTab').hide()
        $('#basketDiv').show()
        $('#showBasketSpan').hide()
        $('#showPriceSpan').show()
    })
    $("#tabPrice").click(function() {

        $('#basketDiv').hide()
        $('#pTableContentTab').show()
        $('#showPriceSpan').hide()
        $('#showBasketSpan').show()
    })
    

    $("#switchOrderDiv").click(function() {
        $("#orderDiv").show()
        $("#deliveryDiv").hide()
        $("#notificationDiv").hide()
        $("#switchOrderDiv").removeClass("inactiveDiv").addClass("activeDiv")
        $("#switchDeliveryDiv").removeClass("activeDiv").addClass("inactiveDiv")
        $("#switchNotificationDiv").removeClass("activeDiv").addClass("inactiveDiv")

        $("#showNDSlabel").show()
        return false
    })
    $("#switchDeliveryDiv").click(function() {
        $("#deliveryDiv").show()
        $("#orderDiv").hide()
        $("#notificationDiv").hide()
        $("#switchDeliveryDiv").removeClass("inactiveDiv").addClass("activeDiv")
        $("#switchOrderDiv").removeClass("activeDiv").addClass("inactiveDiv")
        $("#switchNotificationDiv").removeClass("activeDiv").addClass("inactiveDiv")

        $("#showNDSlabel").hide()
    })
    $("#switchNotificationDiv").click(function() {
        $("#notificationDiv").show()
        $("#deliveryDiv").hide()
        $("#orderDiv").hide()
        $("#switchNotificationDiv").removeClass("inactiveDiv").addClass("activeDiv")  
        $("#switchDeliveryDiv").removeClass("activeDiv").addClass("inactiveDiv")
        $("#switchOrderDiv").removeClass("activeDiv").addClass("inactiveDiv")

        $("#showNDSlabel").hide()
    })
