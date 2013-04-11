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

function load_price(){
    $.ajax({
        type: "POST",
        url: "/m/getnamingrules.py",
        async: true,
        data: {
            "queryname": "get_price",
            "nomenklatura": $("#nomenklatura_naimenovanie").attr("ssylka"),
            "harakteristika": $("#nomenklatura_naimenovanie").val()
            //"orderindex" : selectid.intid
        },
        success: function (html) {
            var optionsforapend = JSON.parse(html);
            /*for (var el in optionsforapend.records) {
                $("#NamingRules").append('<option value="' + optionsforapend.records[el].ssylka + '">' + optionsforapend.records[el].naimenovanie + '</option>');
            }*/
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
			var har_id;
			var el_selector;
			$("#div_for_harakteristikinomenklatury_list_ff").empty();
			$("#div_for_harakteristikinomenklatury_list_ff").append('<fieldset data-role="controlgroup" data-type="horizontal" id="div_for_harakteristikinomenklatury_list"></fieldset>');
			$("#div_for_harakteristikinomenklatury_list").append('<select id = "harakteristikinomenklatury_list"></select>');
			
			for (var el in optionsforapend.records) {
				har_id = optionsforapend.records[el].ssylka;
				$("#harakteristikinomenklatury_list").append('<option id="' + har_id + '">Длинна шт: ' + optionsforapend.records[el].naimenovanie + ' м.</option>');
				el_selector = $("#"+har_id);
				el_selector.attr("value", optionsforapend.records[el].ssylka);
				el_selector.attr("vesvkilogramah", optionsforapend.records[el].vesvkilogramah);
				el_selector.attr("kratnostedinitsy", optionsforapend.records[el].kratnostedinitsy);
				el_selector.attr("koeffitsientgost", optionsforapend.records[el].koeffitsientgost);
			}
			$("#div_for_harakteristikinomenklatury_list_ff").trigger("create");
			if (optionsforapend.count > 0) {
				$("#nomenklatura_naimenovanie").attr("vesvkilogramah", optionsforapend.records[0].vesvkilogramah);
				$("#kolichecnvo_metrov").val((optionsforapend.records[0].kratnostedinitsy * 1).toFixed(2));
				$("#kolichecnvo_shtuk").val(1);
				recalculate_prokat("kolichecnvo_metrov");
			}
            load_price();
			$("#harakteristikinomenklatury_list").change(function () {
				recalculate_prokat("kolichecnvo_shtuk");
			});
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
	var m = $("#kolichecnvo_metrov").val() * 1;
	var s = $("#kolichecnvo_shtuk").val() * 1;
	var t = $("#kolichecnvo_tonn").val() * 1;
	
	var opt = $("#" + $("#harakteristikinomenklatury_list").val());
	var kratnostedinitsy = opt.attr("kratnostedinitsy");
	var vesvkilogramah = opt.attr("vesvkilogramah");
	if (mainfield == "kolichecnvo_metrov") {
		s = m / kratnostedinitsy;
		//m = s * kratnostedinitsy;
		t = (m * vesvkilogramah / 1000);
	} else if (mainfield == "kolichecnvo_shtuk") {
		m = kratnostedinitsy * s;
		t = (m * vesvkilogramah / 1000);
	} else if (mainfield == "kolichecnvo_tonn") {
		m = t / vesvkilogramah * 1000;
		s = m / kratnostedinitsy;
	};
	
	if (s < 1) {
		$("#kolichecnvo_shtuk").val("");
		$("#kolichecnvo_shtuk").attr("placeholder", "--");
	}else {
		$("#kolichecnvo_shtuk").val(s.toFixed(1));
	};
	if ($("#kolichecnvo_tonn").val() != t.toFixed(3))
	{
		$("#kolichecnvo_tonn").val(t.toFixed(3));
	};
	if ($("#kolichecnvo_metrov").val() != m.toFixed(2))
	{
		$("#kolichecnvo_metrov").val(m.toFixed(2));
	};
};

$(document).ready(function () {
    $("#output").html("Hello!!!");
	$('#kolichecnvo_metrov').bind('input', function() {
		recalculate_prokat("kolichecnvo_metrov");
	});
	$('#kolichecnvo_shtuk').bind('input', function() {
		recalculate_prokat("kolichecnvo_shtuk");
	});
	$('#kolichecnvo_tonn').bind('input', function() {
		recalculate_prokat("kolichecnvo_tonn");
	});
});