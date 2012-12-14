/**
 * @author Administrator
 */
function selector_constructor(idElement, welcomLabel, items) {
	//.html('<div id=\"' + idElement + 'Header' + '\"' + welcomLabel+"</div>");
	header = document.createElement("div");
	header.id = idElement + "Header";
	header.innerHTML = welcomLabel;

	$("#" + idElement).append(header);

}

function showalert() {
	alert("Hello!!!");
}

function example() {
	/*$("#metalSelector").animate({
	 "height": "toggle", "opacity": "toggle"
	 }, "slow");*/
	$("#metalSelector").css("position", "absolute");
	$("#metalSelector").animate({"left": "+=50px"}, "slow");

}


$(document).ready(function() {
	//alert("Hello!!!");
	selector_constructor("profilName", "Выберите профиль...", ["Арматура", "Швелер", "Провола", "Балка"]);
})
