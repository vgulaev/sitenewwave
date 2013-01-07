function printlist() {
	$.ajax({
		type : "POST",
		url : "itemtable.py",
		async : true,
		data : {
			"likecondition" : $("#searchstring").val()
		},
		success : function(html) {
			$("#main").html(html)
		}
	})
}

function filled_options_from_string(selectid, html) {
	optionsforapend = html.split(" ");

	for (el in optionsforapend) {
		if (optionsforapend[el].length > 2) {
			options = document.createElement("option");
			options.value = optionsforapend[el];
			text = document.createTextNode(optionsforapend[el]);
			options.appendChild(text);
			$(selectid.jqueryid).append(options);
		}
		;
	}
	// $("#main").html(html);
}

function filed_options_for_seperator_id(selectid) {
	/*
	 * str1 = "Арматура Балка Воронка Ендова"; str2 = "Желоб Заглушка Квадрат";
	 * str3 = "Колено Конек Кронштейн"; if (selectid.jqueryid == "#selector1") {
	 * filled_options_from_string(selectid, str1); } else if (selectid.jqueryid ==
	 * "#selector2") { filled_options_from_string(selectid, str2); } else {
	 * filled_options_from_string(selectid, str3); } ;
	 */

	fullnamecondition = "";
	orderindex = selectid.intid;

	$("#searchPanel> select").each(function(index, el) {
		if (el.value != "null") {
			fullnamecondition = fullnamecondition + el.value + "%";
		}
	});

	if (fullnamecondition == "") {
		fullnamecondition = "%";
	}

	// $("#main").html(fullnamecondition + " == " + orderindex.toString());

	$.ajax({
		type : "POST",
		url : "getwords.py",
		async : true,
		data : {
			"likecondition" : fullnamecondition
		},
		success : function(html) {
			filled_options_from_string(selectid, html);
		}
	})

}

function add_selector() {

	selectorIndex = parseInt($("#searchPanel").attr("selectorIndex"))
	var selectorid = {
		intid : selectorIndex + 1,
		strid : "selector" + (selectorIndex + 1).toString(),
		jqueryid : "#selector" + (selectorIndex + 1).toString()
	}
	idselector = selectorid.strid;
	selectorbody = document.createElement("select");
	selectorbody.setAttribute("id", selectorid.strid)

	options = document.createElement("option");
	options.value = "null";
	text = document.createTextNode("Выбери что ни будь");
	options.appendChild(text);
	selectorbody.appendChild(options);

	$("#searchPanel").append(selectorbody);

	$("#searchPanel").attr("selectorIndex", selectorid.intid)
	$(selectorid.jqueryid).change(function() {
		add_selector();
	});

	optionsforapend = filed_options_for_seperator_id(selectorid);
}

function managesearchPanel() {
	add_selector();
}
