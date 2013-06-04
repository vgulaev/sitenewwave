

$(document).ready( function(){
    // alert(window.location.pathname.split("/")[2])
	$.ajax({
            type: "GET",
            url: "/1cengine/py_scripts/get_order.py",
            async: false,
            data: "funkt=get_order(\""+window.location.pathname.split("/")[2]+"\")",
            success: function(html) {
                
                $("#order_table_div").html(html)


            }

        });
})

window.onload=function(){
    BTH();
    HTB();
    ComputeCString();
    GENhex();
}