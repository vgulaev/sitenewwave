cleaner_css = function() {
	console_element = document.createElement("div");
	cleaner_css_id = "cleaner_css_console" + Math.floor(Math.random() * 3000).toString();
	console_element.setAttribute("id", cleaner_css_id);
	$("body").append(console_element);
	this.uotputid = $("#" + cleaner_css_id);

	this.uotputid.css("border", "3px solid red");
	this.uotputid.css("position", "absolute");

	this.printcss = function(ss) {
		//for (var int = ss.cssRules.length - 1; int > -1; int--) {
		for (var int = 0; int < ss.cssRules.length; int++) {
			if (document.querySelector(ss.cssRules[int].selectorText) != null) {
				pelement = document.createElement("p");
				text = document.createTextNode(ss.cssRules[int].cssText);
				pelement.appendChild(text);
				this.uotputid.append(pelement);
			}
		}
		//alert("Hello");
	}

	this.processedcssfiles = function() {
		for (var int = 0; int < document.styleSheets.length; int++) {
			pelement = document.createElement("p");
			text = document.createTextNode(document.styleSheets[int].href);
			pelement.appendChild(text);
			this.uotputid.append(pelement);
			this.printcss(document.styleSheets[int]);
		}
	}
	//this.newproperty = "hello it is object";
}
function clearcss() {
	//processedcssfiles();
	//alert(cleaner_css.newproperty);
	t = new cleaner_css();

	t.processedcssfiles();
	//alert(t.newproperty);
}