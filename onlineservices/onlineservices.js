function printlist() {
	$.ajax({
		type : "POST",
		url : "itemtable.py",
		async : true,
		data : "",
		success : function(html) {
			$("#main").html(html)
		}
	})
}