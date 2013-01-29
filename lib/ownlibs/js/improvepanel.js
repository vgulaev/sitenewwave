/**
 * 
 */
improvepanel = function() {
	/*$("#improve_panel_button").hover(function() {
		$("#improve_panel_options").show("slow");
	});*/
	animationwork = false;
	
	$("#improve_panel_button").hover(function() {
		if (animationwork == false) {
			$("#improve_panel_options").show("slow");
		}
	});
	$("#improve_panel").mouseleave(function() {
		$("#improve_panel_options").hide();
	});
	$("#improve_panel_yes").click(function() {
		animationwork = true;
		yaCounter15882208.reachGoal('onSearchSatisfiedYes');
		$("#improve_panel_options").hide("slow", function() {
			$("#improve_panel_thanks_label").show(3000, function() {
				$("#improve_panel_thanks_label").hide(3000, function() {
					animationwork = false;
				});
			});
		});
	});
	$("#improve_panel_no").click(function() {
		animationwork = true;
		yaCounter15882208.reachGoal('onSearchSatisfiedNo');
		$("#improve_panel_options").hide("slow", function() {
			$("#improve_panel_thanks_label").show(3000, function() {
				$("#improve_panel_thanks_label").hide(3000, function() {
					animationwork = false;
				});
			});
		});
	});
}