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

function take_options() {
	el = "Арматура Балка Воронка Ендова Желоб Заглушка Квадрат Колено Конек Кронштейн";
	
	return el.split(" ");
}

function filed_options_for_seperator_id(selectid){
	$.ajax({
		type : "POST",
		url : "getwords.py",
		async : true,
		/*data : {
			"likecondition" : $("#searchstring").val()
		},*/
		success : function(html) {
			$("#main").html(html)
		}
	})
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
