/**
 * 
 */
improvepanel = function() {
	//$("#improve_panel_options").hide();
	//$("#improve_panel_options").hide();
	$("#improve_panel_button").hover(function() {
		$("#improve_panel_options").show(1000);
	});
	$("#improve_panel_button").hover(function() {
		$("#improve_panel_options").show(1000);
	});
	$("#improve_panel").mouseleave(function() {
		$("#improve_panel_options").hide();
	});
	this.helloobject = function() {
		//alert("Hello from object");
	}
}