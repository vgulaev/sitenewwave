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
			$(selectid).append(options);
		};
	}
	$("#main").html(html);
}

function filed_options_for_seperator_id(selectid) {
	str1 = "Арматура Балка Воронка Ендова";
	str2 = "Желоб Заглушка Квадрат";
	str3 = "Колено Конек Кронштейн";
	if (selectid == "#selector1") {
		filled_options_from_string(selectid, str1);
	} else if (selectid == "#selector2") {
		filled_options_from_string(selectid, str2);
	} else {
		filled_options_from_string(selectid, str3);
	}
	;

	/*$.ajax({
	 type : "POST",
	 url : "getwords.py",
	 async : true,
	 /*data : {
	 "likecondition" : $("#searchstring").val()
	 },
	 success : function(html) {
	 filled_options_from_string(selectid, html);
	 }
	 })*/
}

function add_selector() {

	idselector = (parseInt($("#searchPanel").attr("selectorIndex")) + 1).toString();
	selectorbody = document.createElement("select");
	selectorbody.setAttribute("id", "selector" + idselector)

	options = document.createElement("option");
	options.value = "null";
	text = document.createTextNode("Выбери что ни будь");
	options.appendChild(text);
	selectorbody.appendChild(options);

	/*for (el in optionsforapend) {
	 options = document.createElement("option");
	 options.value = optionsforapend[el];
	 text = document.createTextNode(optionsforapend[el]);
	 options.appendChild(text);
	 selectorbody.appendChild(options);
	 };*/

	$("#searchPanel").append(selectorbody);

	$("#searchPanel").attr("selectorIndex", idselector)
	$("#selector" + idselector).change(function() {
		add_selector();
	});

	optionsforapend = filed_options_for_seperator_id("#selector" + idselector);
}

function managesearchPanel() {
	add_selector();
	//$("#searchPanel").html("опять иван" + $("#searchPanel").attr("selectorIndex"));
}
