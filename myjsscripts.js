/**
 * @author Administrator
 */
function selector_constructor(idElement, welcomLabel, items) {
	//.html('<div id=\"' + idElement + 'Header' + '\"' + welcomLabel+"</div>");
	header = document.createElement("div");
	header.id = idElement + "Header";
	header.innerHTML = welcomLabel;
	$("#"+idElement).append(header);
	
}

function showalert() {
	alert("Hello!!!");
}


$(document).ready(function() {
	//alert("Hello!!!");
	selector_constructor("profilName", "Выберите профиль...",["Арматура", "Швелер", "Провола", "Балка"]);
})
