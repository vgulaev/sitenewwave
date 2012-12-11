
function определитьБраузер(){
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

// Для разных браузеров пользуются разные пути получения таких объектов, поэтому пользуем попытку/исключение.
// возвращает объект, который может соединяться с сервером.
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

// функция возвращает строку в неизменном виде для всех браузеров, кроме ИЕ. Для ИЕ FF версии 3.0 добавляет "m:".
function ИЕ(стр){
	//if (browser.msie || browser.firefox3 || browser.firefox8) return  "m:" + стр
	//return 'm:'+стр

	if (browser.firefox || browser.msie) return 'm:'+стр
	else return стр
}

function bigRound(num){
	num = num/10
	var div = num%1
	if (div!=0){
		num = ((num-num%1)+1)*10
	} else {
		num = num*10
	}
	return num	
}

function getNodes(DR, RootUl, level, Price){

	var i = 0
	oro = DR.childNodes[0];

	while(i < DR.childNodes.length){

		if(oro.tagName == "m:Группа"){

			var NodeLi = document.createElement("li")

			NodeLi.setAttribute("class", "level"+level+" group")
            var hline = new Array(level+1).join("<span class='hline'></span>")
			$(NodeLi).append("<li class='UlName' onclick='$(this).next().slideToggle(\"fast\")' ><span style='padding-left:"+level*15+"px;'>"+oro.childNodes[1].childNodes[0].data+"</span></li>")
			NodeLi.setAttribute("id", oro.childNodes[1].childNodes[0].data)

			var NodeUl = document.createElement("ul")
			
			NodeLi.appendChild(NodeUl)
			RootUl.appendChild(NodeLi)
			
			getNodes(oro, NodeUl, level+1, Price)
		} else if (oro.tagName == "m:Предмет"){
			
			var BasePrice = oro.childNodes[3].childNodes[0].data
			var NodeLi = document.createElement("li")
			NodeLi.setAttribute("class", "item")
			var prices = '';
			k = 0
			var kfArray = []
			while(k < Price.length){
                
				kf = Price[k].childNodes[3].childNodes[0].data
			    kfArray.push(kf)
				TN = bigRound((BasePrice/(1-(kf/100)))).toFixed(2);
				PC = (Math.round((TN/1000)*Math.round(oro.childNodes[5].childNodes[0].data*oro.childNodes[7].childNodes[0].data)*oro.childNodes[9].childNodes[0].data*100)/100).toFixed(2)
						
				if(oro.childNodes[7].childNodes[0].data==0 | oro.childNodes[9].childNodes[0].data==0){
					PC = '-'
					PM = '-'
				} else {
					PM = (Math.round((PC/(oro.childNodes[7].childNodes[0].data))*oro.childNodes[9].childNodes[0].data*100)/100).toFixed(2)
					
					PC = PC.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ')+'.'+PC.split('.')[1]
					PM = PM.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ')+'.'+PM.split('.')[1]
				}
				

				TN = TN.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ')+'.'+TN.split('.')[1]
				
				
				prices = prices + "<span class='p"+k+"'>"
				prices = prices + "<span class='itemPrice itemTN'>"+TN+"</span>"	
				prices = prices + "<span class='itemPrice itemPC_hid'>"+PC+"</span>"
				prices = prices + "<span class='itemPrice itemPM_hid'>"+PM+"</span>"
				prices = prices + "</span>"
				k++;
			} 
			var itemName = RootUl.parentNode.getAttribute('id')
            var hline = new Array(level+1).join("<span class='hline'></span>")
			$(NodeLi).append("<span class='itemName' style='padding-left:"+level*15+"px;'>"+oro.childNodes[1].childNodes[0].data+"</span> <div class='pr'><a href='Добавить товар' class='addItem' onClick=\"addItem('"+itemName+"', '"+oro.childNodes[1].childNodes[0].data+"', '"+BasePrice+"', '"+kfArray+"', '"+oro.childNodes[5].childNodes[0].data+"', '"+oro.childNodes[7].childNodes[0].data+"', '"+oro.childNodes[9].childNodes[0].data+"', '"+oro.childNodes[11].childNodes[0].data+"'); return false \">купить</a>"+prices+"</div>")
				
			RootUl.appendChild(NodeLi)
			RootUl.parentNode.setAttribute("class","itemGroup")
		}
		oro = DR.childNodes[i];
		i++
	}

}

function getNodesMSIE(DR, RootUl, level, Price){
	var i = 0
	oro = DR.childNodes[0];
	

	while(DR.childNodes[i]!=null){
		if(oro.tagName == "m:Группа"){
			//alert(oro.tagName)
			var NodeLi = document.createElement("li")

			NodeLi.setAttribute("class", "level"+level+" group")

			$(NodeLi).append("<li class='UlName' onclick='$(this).next().slideToggle(\"fast\")' ><span style='padding-left:"+level*15+"px;'>"+oro.childNodes[0].childNodes[0].data+"</span></li>")
			NodeLi.setAttribute("id", oro.childNodes[0].childNodes[0].data)

			var NodeUl = document.createElement("ul")
			
			
			NodeLi.appendChild(NodeUl)
			RootUl.appendChild(NodeLi)
			

			getNodesMSIE(oro, NodeUl, level+1, Price)
		} else if (oro.tagName == "m:Предмет"){
			
			var BasePrice = oro.childNodes[1].childNodes[0].data
			var NodeLi = document.createElement("li")
			NodeLi.setAttribute("class", "item")
			var prices = '';
			k = 0
			var kfArray = []
			while(k < Price.length){

				kf = Price[k].childNodes[1].childNodes[0].data
				kfArray.push(kf)
				TN = bigRound((BasePrice/(1-(kf/100)))).toFixed(2);
				PC = (Math.round((TN/1000)*Math.round(oro.childNodes[2].childNodes[0].data*oro.childNodes[3].childNodes[0].data)*oro.childNodes[4].childNodes[0].data*100)/100).toFixed(2)
				
				
				if(oro.childNodes[3].childNodes[0].data==0 | oro.childNodes[4].childNodes[0].data==0){
					PC = '-'
					PM = '-'
				} else {
					PM = (Math.round((PC/(oro.childNodes[3].childNodes[0].data))*oro.childNodes[4].childNodes[0].data*100)/100).toFixed(2)
					
					PC = PC.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ')+'.'+PC.split('.')[1]
					PM = PM.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ')+'.'+PM.split('.')[1]
				}
				

				TN = TN.split('.')[0].replace(/(\d{1,3})(?=(?:\d{3})+$)/g, '$1 ')+'.'+TN.split('.')[1]
				
				
				
				prices = prices + "<span class='p"+k+"'>"
				prices = prices + "<span class='itemPrice itemTN'>"+TN+"</span>"	
				prices = prices + "<span class='itemPrice itemPC_hid'>"+PC+"</span>"
				prices = prices + "<span class='itemPrice itemPM_hid'>"+PM+"</span>"
				prices = prices + "</span>"
				k++
			} 
            var itemName = RootUl.parentNode.getAttribute('id')
			$(NodeLi).append("<span class='itemName' style='padding-left:"+level*15+"px;'>"+oro.childNodes[0].childNodes[0].data+"</span> <div class='pr'><a href='Добавить товар' class='addItem' onClick=\"addItem('"+itemName+"', '"+oro.childNodes[0].childNodes[0].data+"', '"+BasePrice+"', '"+kfArray+"', '"+oro.childNodes[2].childNodes[0].data+"', '"+oro.childNodes[3].childNodes[0].data+"', '"+oro.childNodes[4].childNodes[0].data+"', '"+oro.childNodes[5].childNodes[0].data+"'); return false\">купить</a>"+prices+"</div>")
			orob = oro	
			RootUl.appendChild(NodeLi)
			RootUl.parentNode.setAttribute("class","itemGroup")
		}
		i++
		oro = DR.childNodes[i]
		
	}

}

function Privet(){

	определитьБраузер();
	
	var xmlhttp = getXmlHttp();
	
	//xmlhttp.open('POST', 'getXML.php');
	//xmlhttp.onreadystatechange = function() { }
    //xmlhttp.send();
	
	xmlhttp.open('POST', 'price.xml');
	xmlhttp.onreadystatechange = function() {ПриОтветеВебСервиса(xmlhttp)}
    xmlhttp.send();
    
	/* Старый вариант с прямым ajax запросом к веб сервису
	
	xmlhttp.open('POST', 'http://195.239.221.58:30080/DemoTrimet/ws/price1c.1cws', true, 'WebService', 'teradel');
	xmlhttp.setRequestHeader("Content-Type", "text/xml") ;

	var Param = '<?xml version="1.0" encoding="UTF-8"?>' +
		'<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"> <soap:Header/>' +
		'<soap:Body> <m:GetPrice xmlns:m="http://www.trimet.ru/Schema1C/Price"/></soap:Body>' +
		'</soap:Envelope>';
	xmlhttp.send(Param);
	
	*/
	// // Напишем на кнопке чего мы ждём, а то пользователи они такие. Понатыкают на кнопку а потом удивляются.
	document.getElementById("MyButton").value = "Формируется прайс...";
	document.getElementById("MyButton").disabled = true;
	$.blockUI({message:'Немного подождите, идет загрузка актуального прайс-листа...',css:{background:'#fff',border:'5px solid #e0e0e0',padding:'3px'},overlayCSS:{background:'#afafaf',opacity:.7}});
}

function ОбновитьТаблицуНоменклатуры(xmlhttp){
	
	var Price = xmlhttp.responseXML.getElementsByTagName(ИЕ("СписокЦен"))
	
	
	var DR = xmlhttp.responseXML.getElementsByTagName(ИЕ("Группа"))[0].parentNode// "m:return" - для IE, "return" - для FF
	
	var RootUl = document.getElementById("ПрайсЛист")
	$("ul#ПрайсЛист").empty()
	if (browser.msie==true){
		getNodesMSIE(DR, RootUl, 0, Price)
	} else {
		
		getNodes(DR, RootUl, 0, Price)
	}

	/// Очистка куки
	// $.cookie("basket", null)
	///

	if($.cookie("basket")){
	    var cook = $.cookie("basket")
	    eval(cook)
	}
	if($.cookie("basketWeight")){
	    var basketWeight = $.cookie("basketWeight")
	    eval(basketWeight)
	}
	//$.cookie('choise','балка')
	
	 var tmp = new Array(); // два вспомагательных
	 var tmp2 = new Array(); // массива
	 var param = new Array();
	
	 var get = location.search; // строка GET запроса
	 if(get != '') {
		tmp = (get.substr(1)).split('&'); // разделяем переменные
		for(var i=0; i < tmp.length; i++) {
			tmp2 = tmp[i].split('='); // массив param будет содержать
			param[tmp2[0]] = tmp2[1]; // пары ключ(имя переменной)->значение
		}
  	//alert(param['product']);
		if(param['product']!=''){
			$.cookie('choise',decodeURI(param['product']))
		}
 	}
 
	if($.cookie("choise")){
		var choise = $.cookie("choise")
		$('input#filterInput').attr('value', choise)
		$('input#filterInput').change()
	}
	
}

// Функция вызывается по мере готовности ответа от сервера
function ПриОтветеВебСервиса(xmlhttp){
	if (xmlhttp.readyState == 4) {// когда ответ готов.
		if(xmlhttp.status != 200) {// Если всё плохо - скажем об этом
			alert("Запрос завершился неудачно. Ответ сервера: " + xmlhttp.responseText);
		}
		else{
			
			ОбновитьТаблицуНоменклатуры(xmlhttp);

		}

		// Когда сервер ответил можно включить кнопочку.
		document.getElementById("MyButton").value = "Обновить прайс";
		document.getElementById("MyButton").disabled = false;
		$.unblockUI();
		
	}
}


