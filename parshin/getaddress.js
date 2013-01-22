
function getaddress() {
	$.ajax({
		type : "POST",
		url : "webservice.py",
		async : true,
		data : {
			"likecondition" : $("#searchstring").val()
		},
		success : function(address) {
			//$("#ymap").html(address)
			//alert("sdf");
			$('.ymap').empty();
			CreateMap(address.split(';'));
		}
	})
}