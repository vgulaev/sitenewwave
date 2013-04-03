waitnomenklaturaanswer = false;
wait_create_filter_selectors = false;
curentselector = "";
ajaxcount = 0;

function show_filters() {
	$("#filters").show();
	$("#div_button_show_filters").hide();
}

function getfilters() {
    var filters = {};
    var r = $("#queryconditionfields").find("select").each(function () {
        filters[this.id] = this.value;
    });

    return (filters);
}

function load_options_to_selectors(curentfield) {
    //alert("Hello");
    //
    //eeabd8c3-9498-11e2-b2ec-e569e5e79087
    var filters = getfilters();
    //curentfield = "bd1b34a7-9537-11e2-b2ec-e569e5e79087";
    //$("#" + curentfield).empty();
    //$("#" + curentfield).empty();
    if ($("#" + curentfield).find("option").length == 0) {
        $("#" + curentfield).append('<option value="null">Уточните:' + $("#" + curentfield).attr('name') + '</option>')
    }
    $.ajax({
        type: "POST",
        url: "/m/getqueryresult.py",
        async: true,
        //traditional: true,
        data: {
            "queryname": "get_words_by_filter",
                "curentfield": curentfield,
                "NamingRules": $("#NamingRules").val(),
                "filters": JSON.stringify(filters)
            //"orderindex" : selectid.intid
        },
        success: function (html) {
            //alert(html);
            var optionsforapend = JSON.parse(html);
			var curentselector = $("#" + curentfield);
			curentselector.find("option").each(function (index, domEle) {
				if (domEle.value != "null"){
					domEle.setAttribute("delete", "true");
				}
			});
            for (var el in optionsforapend.records) {
				//$("#" + curentfield).find('[value$="87c4db69-969c-11e2-b2ec-e569e5e79087"]')
				var optionforcheck = curentselector.find('[value$="' + optionsforapend.records[el].ssylka + '"]');
				if (optionforcheck.length > 0) {
					optionforcheck[0].setAttribute("delete", "fasle");
				} else {
					curentselector.append('<option value="' + optionsforapend.records[el].ssylka + '">' + optionsforapend.records[el].naimenovanie + '</option>');
				}
            }
			curentselector.find('[delete$=true]').remove();
			//$("#" + curentfield).
        }
    });
}

function create_filter_selectors() {
	if (wait_create_filter_selectors == false) {
		wait_create_filter_selectors = true;
		$("#queryconditionfields").empty();
		$.ajax({
			type: "POST",
			url: "/m/getqueryresult.py",
			async: true,
			data: {
				"queryname": "get_filter_selectors",
					"ssylka": $("#NamingRules").val()
			},
			success: function (html) {
				var optionsforapend = JSON.parse(html);
				var selectsforfilingbyajax = new Array();
				for (var el in optionsforapend.records) {
					var select = document.createElement('select');
					select.setAttribute("name", optionsforapend.records[el].naimenovanie);
					select.setAttribute("id", optionsforapend.records[el].chastrechi);
					$("#queryconditionfields").append(select);
					$("#" + optionsforapend.records[el].chastrechi).append('<option value="null"> Уточните:' + optionsforapend.records[el].naimenovanie + '</option>');
					$('select').selectmenu();

					selectsforfilingbyajax.push(optionsforapend.records[el].chastrechi);

					$("#" + optionsforapend.records[el].chastrechi).change(function () {
						load_nomenklatura_list();
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
				wait_create_filter_selectors = false;
				//$("#queryconditionfield").listview("refresh");
			}
		});
	}
}

function load_NamingRules() {
    $("#NamingRules").empty();
    $("#NamingRules").append('<option value="null">Выберите группу товаров</option>');

    $("#NamingRules").change(function () {
        //$.mobile.showPageLoadingMsg();
        create_filter_selectors();
		load_nomenklatura_list();
        //(new queryconditionfield).show();
        //(new nomenklaturalist()).show();
        //$.mobile.hidePageLoadingMsg();
    });

    $.ajax({
        type: "POST",
        url: "/m/getnamingrules.py",
        async: true,
        data: {
            //"fullnamecondition" : fullnamecondition,
            //"orderindex" : selectid.intid
        },
        success: function (html) {
            var optionsforapend = JSON.parse(html);
            for (var el in optionsforapend.records) {
                $("#NamingRules").append('<option value="' + optionsforapend.records[el].ssylka + '">' + optionsforapend.records[el].naimenovanie + '</option>');
            }
        }
    });
}

function load_nomenklatura_page(el) {
	var ssylka_id = $(el).attr("id");
	$("#nomenklatura_naimenovanie").html($(el).text());
	$("#nomenklatura_naimenovanie").attr("ssylka", ssylka_id);
	
    $.ajax({
        type: "POST",
        url: "/m/getqueryresult.py",
        async: true,
        //traditional: true,
        data: {
            "queryname": "get_vesvkilogramah",
			"vladelets": ssylka_id
        },
        success: function (html) {
            //alert(html);
            var optionsforapend = JSON.parse(html);
			
			$("#harakteristikinomenklatury_list").empty();			
			for (var el in optionsforapend.records) {
				$("#harakteristikinomenklatury_list").append('<option value="' + optionsforapend.records[el].ssylka + '">шт: ' + optionsforapend.records[el].naimenovanie + '</option>');
			}
			$('#harakteristikinomenklatury_list option').eq(0).attr('selected', 'selected');
			//$("#harakteristikinomenklatury_list").val(optionsforapend.records[0].ssylka);
			//$("#harakteristikinomenklatury_list").selectmenu();
			/*if (optionsforapend.count > 0) {
				$("#nomenklatura_naimenovanie").attr("vesvkilogramah", optionsforapend.records[0].vesvkilogramah);
				//$("#kolichecnvo_metrov").val(1);
				recalculate_prokat("kolichecnvo_metrov");
			}*/
        }
    });
}

function load_nomenklatura_list() {
    $("#nomenklaturalist").empty();

    var datafilters = {
        "queryname": "get_nomenklatura",
            "filters": JSON.stringify(getfilters()),
            "NamingRules": $("#NamingRules").val()
    };

    if (waitnomenklaturaanswer == false) {
        waitnomenklaturaanswer = true;
        $.ajax({
            type: "POST",
            url: "/m/getqueryresult.py",
            async: true,
            data: datafilters,
            success: function (html) {
                var optionsforapend = JSON.parse(html);
                if (optionsforapend.count < 30) {
                    for (var el in optionsforapend.records) {
                        $("#nomenklaturalist").append('<li data-theme="c" data-icon="arrow-r"><a id = "' + optionsforapend.records[el].ssylka + '"href="#nomenklatura_element" data-transition="slide" onclick="load_nomenklatura_page(this)">' + optionsforapend.records[el].Article + '</a></li>');
                    }
					$("#filters").hide();
					$("#div_button_show_filters").show();
                } else {
                    $("#nomenklaturalist").append('<li data-theme="c" data-icon="alert"><a href="#nomenklatura_element" data-transition="slide">' + optionsforapend.count + ' вариантов, уточните условия</a></li>');
                }
                $("#nomenklaturalist").listview("refresh");
                waitnomenklaturaanswer = false;
            }
        });
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

$(document).ajaxComplete(function(event,request, settings) {
   ajaxcount = ajaxcount - 1;
   
   if (ajaxcount == 0) {
	$.mobile.hidePageLoadingMsg();
   }
 });
 
$(document).ajaxSend(function() {
	$.mobile.loading( 'show', {
		text: "Идет загрузка...",
		textVisible: true
		//theme: theme,
		//textonly: textonly,
		//html: html
	});
	//$.mobile.showPageLoadingMsg( "b", "Дождитесь пожалуйста загрузки", true );
	ajaxcount = ajaxcount + 1;
  //$( ".log" ).text( "Triggered ajaxSend handler." );
});

function recalculate_prokat(mainfield) {
	if (mainfield == "kolichecnvo_metrov") {
		var t = ($("#kolichecnvo_metrov").val() * $("#nomenklatura_naimenovanie").attr("vesvkilogramah") / 1000).toFixed(3);
		$("#kolichecnvo_tonn").val(t);
		$("#kolichecnvo_shtuk").val("");
		$("#kolichecnvo_shtuk").attr("placeholder", "--")
	};
};

$(document).ready(function () {
    $("#output").html("Hello!!!");
	$('#kolichecnvo_metrov').bind('input', function() {
		recalculate_prokat("kolichecnvo_metrov");
	});	
});