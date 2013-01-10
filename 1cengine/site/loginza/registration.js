$(document).ready( function(){

	$('#showPasswd').change(function(){
      if($(this).attr('checked')){
      	value = $('#passwdh').attr('value')
        $('#passwdv').attr('value', value)
        $('#passwdh').hide()
        $('#passwdv').show()
      } else {
        value = $('#passwdv').attr('value')
        $('#passwdh').attr('value', value)
        $('#passwdv').hide()
        $('#passwdh').show()
      }
    });

	$('input#regButton').click( function(){
		var login = $('input#login').attr('value')
		var phoneNumber = $('input#phoneNumber').attr('value')
		var fio = $('input#fio').attr('value')
		var email = $('input#email').attr('value')

		if($('#showPasswd').attr('checked')){
			var password = $('input#passwdv').attr('value') 
		} else {
			var password = $('input#passwdh').attr('value') 
		}
		

		if(login==''){
			alert('Логин не может быть пустым!')
			$('input#login').focus();
		} else if(password=='') {
			alert('Пароль не может быть пустым!')
			$('#passwd').focus();
		} else {
			$.ajax({
				type: "POST",
				url: "register.php",
				async: false,
				data: "login="+login+"&password="+password+"&fio="+fio+"&phoneNumber="+phoneNumber+"&email="+email+"",
				success: function(html){

					//alert(html)
					if(html.indexOf('Пользователь с такоим логином уже существует')!='-1'){
						alert('Пользователь с такоим логином уже существует. Попробуйте другой логин')
					} else if(html.indexOf('Пользователь успешно создан')!='-1') {
						alert('Пользователь успешно создан. Вы теперь можете войти, используя указанный вами логин и пароль')
						location="http://trimet.ru/1cengine/newdev-site/loginza/" 
					} else {
						alert('Что-то пошло не так. Попробуйте снова через какое-то время')
					}
					
				}
			});
		}
		
	});

});