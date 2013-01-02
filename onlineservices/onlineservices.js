function printlist() {
	$.ajax({
		type : "POST",
		url : "itemtable.py",
		async : true,
		data : {"likecondition" : "труба арматура"},
		success : function(html) {
			$("#main").html(html)
		}
	})
}