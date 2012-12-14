/**
 * @author Administrator
 */
function selector_constructor(idElement, welcomLabel, items) {
	//.html('<div id=\"' + idElement + 'Header' + '\"' + welcomLabel+"</div>");
	var _local_menu = $("#" + idElement);
	header = document.createElement("div");
	header.id = idElement + "Header";
	header.innerHTML = welcomLabel;

	_local_menu.append(header);

	for (i in items) {
		item_menu = document.createElement("p");
		item_menu.id = idElement + "Item" + items[i];
		item_menu.className = "MenuElement";
		item_menu.innerHTML = items[i];
		_local_menu.append(item_menu);
	}
}

function showalert() {
	alert("Hello!!!");
}

function example() {
	/*$("#metalSelector").animate({
	 "height": "toggle", "opacity": "toggle"
	 }, "slow");*/
	$("#metalSelector").css("position", "absolute");
	$("#metalSelector").animate({
		"bottom" : "-=50px"
	}, "slow");

}


$(document).ready(function() {
	//alert("Hello!!!");
	selector_constructor("profilName", "Выберите профиль...", ["Арматура", "Швелер", "Провола", "Балка"]);
})
