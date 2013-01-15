function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}

createCookie("debugmode", "on", 10);

if ((document.URL.indexOf("trimet") != -1) || (document.URL.indexOf("тримет") != -1)) {
	var _gaq = _gaq || [];
	_gaq.push(['_setAccount', 'UA-33206471-1']);
	_gaq.push(['_trackPageview']);
	(function() {
		var ga = document.createElement('script');
		ga.type = 'text/javascript';
		ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(ga, s);
	})();
	(function(d, w, c) {
		(w[c] = w[c] || []).push(function() {
			try {
				w.yaCounter15882208 = new Ya.Metrika({
					id : 15882208,
					clickmap : true,
					trackLinks : true,
					webvisor : true
				});
			} catch(e) {
			}
		});

		var n = d.getElementsByTagName("script")[0], s = d.createElement("script"), f = function() {
			n.parentNode.insertBefore(s, n);
		};
		s.type = "text/javascript";
		s.async = true;
		s.src = (d.location.protocol == "https:" ? "https:" : "http:") + "//mc.yandex.ru/metrika/watch.js";

		if (w.opera == "[object Opera]") {
			d.addEventListener("DOMContentLoaded", f);
		} else {
			f();
		}
	})(document, window, "yandex_metrika_callbacks");
}
