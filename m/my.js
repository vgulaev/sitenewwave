﻿function filled_options_from_string(html) {
	optionsforapend = html.split(" ");
	addedIndex = 0;
	for (el in optionsforapend) {
		if ($.trim(optionsforapend[el]) != "") {
			$("#WordList").append('<li data-theme="c" data-icon="arrow-r"><a href="#Main" data-transition="slide">' + optionsforapend[el] + '</a></li>');
		}
		;
	}
    $("#WordList").listview("refresh");
}

function doSomething() {
    //alert("Hello!!!");
    
	$.ajax({
		type : "POST",
		url : "/m/getwords.py",
		async : true,
		data : {
			//"fullnamecondition" : fullnamecondition,
			//"orderindex" : selectid.intid
		},
		success : function(html) {
			filled_options_from_string(html);
            //$("#outputass").html(html);
		}
	})
    //$("#outputass").html("Good!!!");
    
    //$("#WordList").html('<li data-theme="c" data-icon="arrow-l"><a href="#Main" data-transition="slide"> Арматура </a></li>');
    //$("#WordList").listview("refresh");
}

$(document).ready(function() {
	$("#output").html("Hello!!!");

    //doSomething();
    /*$("#ButtonEx").click(function(e){
    alert("Hello!!!");
    //$("#output").html("Hello!!!");
    })*/
})