function defineBrowser(){
	var userAgent = navigator.userAgent.toLowerCase();
	// Определим используемый браузер
	browser = {
		version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1],
		safari: /webkit/.test( userAgent ),
		opera: /opera/.test( userAgent ),
		msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ),
		firefox3: /firefox\/3/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent ),
		firefox2: /firefox\/2/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent ),
		firefox1: /firefox\/1/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent ),
		firefox: /firefox/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent )
	}
}
function IE(стр){
	if (browser.firefox || browser.msie) return 'm:'+стр
	else return стр
}

function getXmlHttp(){
	var xmlhttp;
	try {
		xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
	} catch (e) {
		try {
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		} catch (E) {
			xmlhttp = false;
		}
	}
	if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
		xmlhttp = new XMLHttpRequest();
	}
  return xmlhttp;
}

function parseUser(xmlhttp){
	defineBrowser();
	

	var res = xmlhttp.responseXML
    var nya = res.getElementsByTagName(IE('Nickname'))
    
    // if(res.getElementsByTagName(IE('fullname'))[0].childNodes[0]){
    // 	alert(res.getElementsByTagName(IE('fullname'))[0].childNodes[0].textContent)

    // } else {
    // 	alert(';`(')
    // }

    var f_array = new Array('fullname','email','FacebookID','GoogleID','YandexID','VkontakteID','MailruID')

    for(var i = 0; i < f_array.length; i++) {
    	var field = f_array[i]
    	// alert(IE(field))
    	// alert(f_array.length)
    	// alert(i)
    	if(res.getElementsByTagName(IE(field))[0] && res.getElementsByTagName(IE(field))[0].childNodes[0]){
	    	document.getElementById(field).innerHTML = res.getElementsByTagName(IE(field))[0].childNodes[0].textContent

	    } else {
	    	continue
	    }
	
	}


	// var fullname = res.getElementsByTagName(IE('fullname'))[0].childNodes[0].textContent
	// var email = res.getElementsByTagName(IE('email'))[0].childNodes[0].textContent
	// var YandexID = res.getElementsByTagName(IE('YandexID'))[0].childNodes[0].textContent
	// var GoogleID = res.getElementsByTagName(IE('GoogleID'))[0].childNodes[0].textContent
	// var VkontakteID = res.getElementsByTagName(IE('VkontakteID'))[0].childNodes[0].textContent
	// var FacebookID = res.getElementsByTagName(IE('FacebookID'))[0].childNodes[0].textContent
	// var MailruID = res.getElementsByTagName(IE('MailruID'))[0].childNodes[0].textContent

	// document.getElementById('fullname').innerHTML = fullname;
	// document.getElementById('email').innerHTML = email;
	// document.getElementById('YandexID').innerHTML = YandexID;
	// document.getElementById('GoogleID').innerHTML = GoogleID;
	// document.getElementById('VkontakteID').innerHTML = VkontakteID;
	// document.getElementById('FacebookID').innerHTML = FacebookID;
	// document.getElementById('MailruID').innerHTML = MailruID;
}

function getUser(){
	var xmlhttp = getXmlHttp();
	
	xmlhttp.open('POST', 'getUser.php');
	xmlhttp.onreadystatechange = function(){ 
		ПриОтветеВебСервиса(xmlhttp)
	}
    xmlhttp.send();

}

function ПриОтветеВебСервиса(xmlhttp){
	if (xmlhttp.readyState == 4) {// когда ответ готов.
		if(xmlhttp.status != 200) {// Если всё плохо - скажем об этом
			alert("Запрос завершился неудачно. Ответ сервера: " + xmlhttp.responseText);
		}
		else{
			
			parseUser(xmlhttp);

		}
		
	}
}
