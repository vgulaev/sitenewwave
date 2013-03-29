waitnomenklaturaanswer = false;
curentselector = "";
a = "";
ddfdf = "dfdfD3"

function getfilters() {
	var filters = {};
	var r =	$("#queryconditionfields").find("select").each(function () {
		filters[this.id] = this.value;
	});
	
	return(filters);
}

function load_options_to_selectors(curentfield) {
	//alert("Hello");
	//
	//eeabd8c3-9498-11e2-b2ec-e569e5e79087
	var filters = getfilters();
	//curentfield = "bd1b34a7-9537-11e2-b2ec-e569e5e79087";
	$("#"+curentfield).empty();
	$("#"+curentfield).append('<option value="null">Уточните:'+ $("#"+curentfield).attr('name') + '</option>')
	$.ajax({
		type : "POST",
		url : "/m/getqueryresult.py",
		async : true,
		//traditional: true,
		data : {
			"queryname" : "get_words_by_filter",
			"curentfield": curentfield,
			"NamingRules": $("#NamingRules").val(),
			"filters": JSON.stringify(filters)
			//"orderindex" : selectid.intid
		},
		success : function(html) {
			//alert(html);
			var optionsforapend = JSON.parse(html);
			for (var el in optionsforapend.records) {
				$("#"+curentfield).append('<option value="' + optionsforapend.records[el].ssylka+ '">' + optionsforapend.records[el].naimenovanie +'</option>');
			}
		}
	});
}

function create_filter_selectors() {
    $("#queryconditionfields").empty();
    
	$.ajax({
		type : "POST",
		url : "/m/getqueryresult.py",
		async : true,
		data : {
			"queryname" : "get_filter_selectors",
			"ssylka" : $("#NamingRules").val()
		},
		success : function(html) {
            var optionsforapend = JSON.parse(html);
			var selectsforfilingbyajax = new Array();
            for (var el in optionsforapend.records) {
                var select = document.createElement('select');
                select.setAttribute("name", optionsforapend.records[el].naimenovanie);
                select.setAttribute("id", optionsforapend.records[el].chastrechi);
                $("#queryconditionfields").append(select);
                $("#"+optionsforapend.records[el].chastrechi).append('<option value="null"> Уточните:'+ optionsforapend.records[el].naimenovanie + '</option>');
                $('select').selectmenu();
				
				selectsforfilingbyajax.push(optionsforapend.records[el].chastrechi);
				
				$("#"+optionsforapend.records[el].chastrechi).change(function() {
					(new nomenklaturalist()).show();
					curentselector = this.id;
					$("#queryconditionfields").find("select").each(function (index, domEle) {
						//domEle.id <> curentid
						if (domEle.id != curentselector) {
							load_options_to_selectors(domEle.id);
						};
					});
				});
            };
			
			for (var el in selectsforfilingbyajax) {
				load_options_to_selectors(selectsforfilingbyajax[el]);
			};
            //$("#queryconditionfield").listview("refresh");
		}
	});
}

function load_NamingRules(){
    $("#NamingRules").empty();
    $("#NamingRules").append('<option value="null">Выберите группу товаров</option>');
    
    $("#NamingRules").change(function() {
        //$.mobile.showPageLoadingMsg();
		create_filter_selectors();
        //(new queryconditionfield).show();
		//(new nomenklaturalist()).show();
        //$.mobile.hidePageLoadingMsg();
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

load_nomenklatura_list = function (){
    
    this.show = function(){
		$("#nomenklaturalist").empty();
		
		var datafilters = {
		"queryname" : "get_nomenklatura",
		"filters": JSON.stringify(getfilters()),
		"NamingRules" : $("#NamingRules").val()
		};

		if (waitnomenklaturaanswer == false) {
			waitnomenklaturaanswer = true;
			$.ajax({
				type : "POST",
				url : "/m/getqueryresult.py",
				async : true,
				data : datafilters,
				success : function(html) {
					var optionsforapend = JSON.parse(html);
					if (optionsforapend.count < 30) {
						for (var el in optionsforapend.records) {
							$("#nomenklaturalist").append('<li data-theme="c" data-icon="arrow-r"><a href="#Main" data-transition="slide">' + optionsforapend.records[el].Article + '</a></li>');
							}
					}
					else {
					$("#nomenklaturalist").append('<li data-theme="c" data-icon="alert"><a href="#Main" data-transition="slide">' + optionsforapend.count + ' вариантов, уточните условия</a></li>');
					}
					$("#nomenklaturalist").listview("refresh");
					waitnomenklaturaanswer = false;
				}
			});
		}
    //alert("Hello");
    }
}

function filled_options_from_string(html) {
	optionsforapend = html.split(" ");
	addedIndex = 0;
    $("#WordList").empty();
	for (el in optionsforapend) {
		if ($.trim(optionsforapend[el]) != "") {
			$("#WordList").append('<li data-theme="c" data-icon="arrow-r"><a href="#Main" data-transition="slide">' + optionsforapend[el] + '</a></li>');
		}
	}
    $("#WordList").listview("refresh");
}

/*function doSomething() {
    load_NamingRules();
	//alert("Hello!!!");
    //(new nomenklaturalist()).show();
    //(new querycondition()).show();
    //$.mobile.pageLoading(); 
    //$("#outputass").html("Good!!!");
    
    //$("#WordList").html('<li data-theme="c" data-icon="arrow-l"><a href="#Main" data-transition="slide"> Арматура </a></li>');
    //$("#WordList").listview("refresh");
}*/

$(document).delegate('#assortiment', 'pageshow', function () {
    //doSomething();
	load_NamingRules();
});

$(document).ready(function() {
	$("#output").html("Hello!!!");
})