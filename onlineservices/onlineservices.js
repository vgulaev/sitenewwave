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

function add_selector() {

	idselector = parseInt($("#searchPanel").attr("selectorIndex")) + 1;
	selectorbody = document.createElement("select");
	selectorbody.setAttribute("id", "selector1")

	options = document.createElement("option");
	options.value = "Пусто";
	text = document.createTextNode("Выбери что ни будь");
	options.appendChild(text);
	selectorbody.appendChild(options);

	for (var i = 0; i < 5; i++) {
		options = document.createElement("option");
		options.value = "Арматура";
		text = document.createTextNode("Арматура");
		options.appendChild(text);
		selectorbody.appendChild(options);
	};

	$("#searchPanel").append(selectorbody);

	$("#selector1").change(function () {
		alert("ok");
	});
}

function managesearchPanel() {
	add_selector();
	//$("#searchPanel").html("опять иван" + $("#searchPanel").attr("selectorIndex"));
}
