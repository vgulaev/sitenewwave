/// работа доставки. автодополнение, выбор города ///
townS = $('#townSelect option:selected').val()

$("#destination").autocomplete({
    source: "/1cengine/py_scripts/get_street.py?town=" + townS,
    delay: 10,
    minChars: 2,
    matchSubset: 1,
    autoFill: false,
    matchContains: 1,
    cacheLength: 10,
    selectFirst: true,
    maxItemsToShow: 10,
});

$("select").change(function() {

    townS = $('#townSelect option:selected').val()
    $("#destination").autocomplete("option", "source", "/1cengine/py_scripts/get_street.py?town=" + townS)
})

$("#townSelect").change(function() {
    if($("#townSelect :selected").val() != "72000001") {
        $("#carry [value='Длинномер']").attr("selected", "selected")
        $("#carry").attr("disabled", "disabled")

        $("#delivery_cost").empty()
        var d_price = $("#townSelect :selected").attr("price")
        if($("#selfCarry").is(":checked") == false) {

            var totalCost = getTotalCost(1)

            $("#SumAll").empty()
            $("#SumAll").append(totalCost)

        }
        d_price = (d_price - 0).toFixed(2)
        d_price = d_price.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ') + '.' + d_price.split('.')[1]
        if($("#toDeliver").is(":checked")) {
            $("#delivery_cost").append(d_price)
            $("#SumDelivery").html(d_price)
        }
        $("#delivery_cost").attr("name", d_price)


    } else if($("#townSelect :selected").val() == "72000001") {
        $("#carry").removeAttr("disabled")

        if($("#carry :selected").val() == "--") {
            $("#carry [value='Газель']").attr("selected", "selected")
        }

        $("#delivery_cost").empty()
        var d_price = $("#carry :selected").attr("price")
        if($("#selfCarry").is(":checked") == false) {

            var totalCost = getTotalCost(1)

            $("#SumAll").empty()
            $("#SumAll").append(totalCost)
        }
        d_price = (d_price - 0).toFixed(2)
        d_price = d_price.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ') + '.' + d_price.split('.')[1]
        if($("#toDeliver").is(":checked")) {
            $("#delivery_cost").append(d_price)
            $("#SumDelivery").html(d_price)
        }
        $("#delivery_cost").attr("name", d_price)

    }
    $("#destination").val('');
})
$("#carry").change(function() {
    if($("#townSelect :selected").val() == "72000001") {
        $("#delivery_cost").empty()
        var d_price = $("#carry :selected").attr("price")
        if($("#selfCarry").is(":checked") == false) {

            var totalCost = getTotalCost(1)

            $("#SumAll").empty()
            $("#SumAll").append(totalCost)
        }
        d_price = (d_price - 0).toFixed(2)
        d_price = d_price.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ') + '.' + d_price.split('.')[1]
        $("#delivery_cost").append(d_price)
        $("#delivery_cost").attr("name", d_price)
        $("#SumDelivery").html(d_price)
    }
})
$("#selfCarry").change(function() {
    // alert(1)
    var d_price = $("#delivery_cost").html().replace(/\s/g, "")
    if($("#selfCarry").is(":checked")) {
        // alert(1)
        var totalCost = getTotalCost(0)
        $(".withoutDelivery").show()
        $(".withDelivery").hide()
        $("#SumAll").empty()
        $("#SumAll").append(totalCost)
        $("#SumDelivery").empty()
        $("#delivery_cost").empty()
    }
})
$("#toDeliver").change(function() {
    var d_price = $("#delivery_cost").attr("name").replace(/\s/g, "")
    if($("#toDeliver").is(":checked")) {
        // alert(2)
        var totalCost = getTotalCost(1)
        $(".withDelivery").show()
        $(".withoutDelivery").hide()
        $("#SumAll").empty()
        $("#SumAll").append(totalCost)
        d_price = (d_price - 0).toFixed(2)
        d_price = d_price.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ') + '.' + d_price.split('.')[1]
        $("#delivery_cost").append(d_price)
        $("#SumDelivery").html(d_price)
    }
})

function getTotalCost(d) {
    alert($("#delivery_cost").attr("name"))
    var d_price = $("#delivery_cost").attr("name").replace(/\s/g, "")
    var totalCost = $("#SumAll").attr("name")
    if(d == 1) {
        totalCost = ((totalCost - 0) + (d_price - 0)).toFixed(2)
    } else {
        totalCost = (totalCost - 0).toFixed(2)
    }

    // nAll = ((totalCost / 118) * 18).toFixed(2)
    // nAll = nAll.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ') + '.' + nAll.split('.')[1]
    totalCost = totalCost.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ') + '.' + totalCost.split('.')[1]
    return totalCost
}