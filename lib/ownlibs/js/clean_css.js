function processedcssfiles() {
	for ( var int = 0; int < document.styleSheets.length; int++) {
		pelement = document.createElement("p");
		text = document.createTextNode(document.styleSheets[int].toString());

		pelement.appendChild(text);
		$("#output").append(pelement);
	}
}
function clearcss() {
	processedcssfiles();
}