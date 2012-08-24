$(document).ready( function(){
	$('input#enterButton').click( function(){
		var login = $('input#loginInput').attr('value')
		var password = $('input#passwordInput').attr('value') 

		$.ajax({
	        type: "POST",
	        url: "authorization.php",
	        async: false,
	        data: "login="+login+"&password="+password+"",
	        success: function(html){

	        	if(html!='Вашу карточку авторизации съел ручной динозавр '){
	        		$.cookie('uHash', html)
		            $('div#loginDiv').empty()
		            $('div#loginDiv').append('Hello, '+login+'!')
		            $('div#loginDiv').append('Your lucky code is '+html+'')	
	        	} else {
	        		$('div#loginDiv').append(html)
	        	}
	            
	        }
    	});
	});
	// function authorize(){
	// 	var login = $('input#loginInput').value()
	// 	var password = $('input#passwordInput').value() 

	// 	$.ajax({
	//         type: "POST",
	//         url: "authorization.php",
	//         data: "login="+login+"&password="+password+"",
	//         success: function(html){
	//             //$.cookie('uHash', html)
	//             $('div#loginDiv').empty()
	//             $('div#loginDiv').append('Hello, '+login+'!')
	//             $('div#loginDiv').append('Your lucky code is '+html+'')
	//         }
 //    	});
	// }
});