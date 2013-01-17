
function getaddress() {
	$.ajax({
		type : "POST",
		url : "webservice.py",
		async : true,
		data : {
			"likecondition" : $("#searchstring").val()
		},
		success : function(html) {
			$("#ymap").html(html)
		}
	})
}