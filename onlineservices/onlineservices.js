function printlist() {
	$.ajax({
		type : "POST",
		url : "itemtable.py",
		async : true,
		data : {"likecondition" : $("#searchstring").val()},
		success : function(html) {
			$("#main").html(html)
		}
	})
}