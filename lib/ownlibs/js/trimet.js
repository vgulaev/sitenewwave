function createCookie(name, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	} else
		var expires = "";
	document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for ( var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ')
			c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0)
			return c.substring(nameEQ.length, c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name, "", -1);
}

createCookie("debugmode", "on", 10);


$(function(){
        // Check the initial Poistion of the Sticky Header
        var stickyHeaderTop = $('#nav_div').offset().top;

        $(window).scroll(function(){
                if( $(window).scrollTop() > stickyHeaderTop ) {
                        $('#nav_div').css({
                        	position: 'fixed',
                        	top: '0px',
                        	marginTop:'0px',
                        	zIndex: "10",
                        	width: "972px",
                        	backgroundColor: "white",
                        	boxShadow: "0px 10px 5px rgba(0,0,0,0.3)"

                        });
                        $('#stickyalias').css('display', 'block');
                } else {
                        $('#nav_div').css({
                        	position: 'relative',
                        	margin: "72px 0px 0px",
                        	// width: "775px",
                        	backgroundColor: "none",
                        	boxShadow: "none"
                        });
                        $('#stickyalias').css('display', 'none');
                }
        });
  });