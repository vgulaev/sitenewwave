queryconditionfield = function () {

    this.show = function(){
    $("#queryconditionfields").empty();
    //alert($("#querycondition").val());
    $.ajax({
		type : "POST",
		url : "/m/getnamingrulesshemanazvaniya.py",
		async : true,
		data : {
			"ssylka" : $("#NamingRules").val()
			//"orderindex" : selectid.intid
		},
		success : function(html) {
            var optionsforapend = JSON.parse(html);
            for (var el in optionsforapend.records) {
                var select = document.createElement('select');
                select.setAttribute("name", optionsforapend.records[el].chastrechi);
                select.setAttribute("id", optionsforapend.records[el].chastrechi);
                
                $("#queryconditionfields").append(select);
                
                $("#"+optionsforapend.records[el].chastrechi).append('<option value="clear"> Уточните:'+ optionsforapend.records[el].naimenovanie + '</option>');
                
                $("#queryconditionfields").trigger("create");
                
            }
            //$("#queryconditionfield").listview("refresh");
		}
	});
    }
}

querycondition = function (){
    this.show = function(){
    $("#NamingRules").empty();
    $("#NamingRules").append('<option value="null">Выберите группу товаров</option>');
    
    $("#NamingRules").change(function() {
        $.mobile.showPageLoadingMsg();
        (new queryconditionfield).show();
		(new nomenklaturalist()).show();
        $.mobile.hidePageLoadingMsg();
        });
    
    $.ajax({
		type : "POST",
		url : "/m/getnamingrules.py",
		async : true,
		data : {
			//"fullnamecondition" : fullnamecondition,
			//"orderindex" : selectid.intid
		},
		success : function(html) {
            var optionsforapend = JSON.parse(html);
            for (var el in optionsforapend.records) {
                $("#NamingRules").append('<option value="' + optionsforapend.records[el].ssylka+ '">' + optionsforapend.records[el].naimenovanie +'</option>');
            }
		}
	});
    
    }
}

nomenklaturalist = function (){
    
    this.show = function(){
    $("#nomenklaturalist").empty();
    
	var datafilters = {
	"NamingRules" : $("#NamingRules").val()
	};

    $.ajax({
		type : "POST",
		url : "/m/getnomenklatura.py",
		async : true,
		data : datafilters,
		success : function(html) {
            var optionsforapend = JSON.parse(html);
			if (optionsforapend.count < 30) {
			$("#nomenklaturalist").append('<li data-theme="c" data-icon="alert"><a href="#Main" data-transition="slide">' + optionsforapend.count + ' вариантов, уточните условия</a></li>');
			}
			else {
			$("#nomenklaturalist").append('<li data-theme="c" data-icon="alert"><a href="#Main" data-transition="slide">' + optionsforapend.count + ' вариантов, уточните условия</a></li>');
			}
			$("#nomenklaturalist").listview("refresh");
		}
	});
    
    
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
})