querycondition = function (){
    this.show = function(){
    $("#querycondition").empty();
    $("#querycondition").append('<option value="clear">Выберите группу товаров</option>');
    
    $.ajax({
		type : "POST",
		url : "/m/getnamingrules.py",
		async : true,
		data : {
			//"fullnamecondition" : fullnamecondition,
			//"orderindex" : selectid.intid
		},
		success : function(html) {
            optionsforapend = html.split(" ");
            for (el in optionsforapend) {
                if ($.trim(optionsforapend[el]) != "") {
                    $("#querycondition").append('<option value="clear">' + optionsforapend[el] +'</option>');
                }
                ;
            }
            
		}
	});
    
    }
}

nomenklaturalist = function (){
    
    this.show = function(){
    $("#nomenklaturalist").empty();
    $("#nomenklaturalist").append('<li data-theme="c" data-icon="alert"><a href="#Main" data-transition="slide">Более 1000 вариантов</a></li>');
    $("#nomenklaturalist").listview("refresh");
    //alert("Hello");
    }
}

$(document).delegate('#assortiment', 'pageshow', function () {
    //Your code for each page load here
    //alert("Hello");
    doSomething();
});

function filled_options_from_string(html) {
	optionsforapend = html.split(" ");
	addedIndex = 0;
    $("#WordList").empty();
	for (el in optionsforapend) {
		if ($.trim(optionsforapend[el]) != "") {
			$("#WordList").append('<li data-theme="c" data-icon="arrow-r"><a href="#Main" data-transition="slide">' + optionsforapend[el] + '</a></li>');
		}
		;
	}
    $("#WordList").listview("refresh");
    $.mobile.hidePageLoadingMsg();
}

function doSomething() {
    //alert("Hello!!!");
    $.mobile.showPageLoadingMsg();
    (new nomenklaturalist()).show();
    (new querycondition()).show();
    $.mobile.hidePageLoadingMsg();
	/*$.mobile.showPageLoadingMsg();
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
	});*/
    //$.mobile.pageLoading(); 
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