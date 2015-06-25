$(document).ready( function(){
    $("#passwd_button").click( function(){

        if( $("#passwd_input").val() != "" ){

            if( $("#passwd_input").val() == $("#repeat_passwd_input").val() ){
                passwd = hex_sha256($("#passwd_input").val())
                old_passwd = hex_sha256($("#old_passwd_input").val())
                $.ajax({
                    type: "POST",
                    url: "/1cengine/py_scripts/user.py",
                    async: false,
                    data: "passwd=" + passwd + "&old_passwd=" + old_passwd + "&funkt=change_passwd()",
                    success: function(html) {
                        alert(html)
                        $("#passwd_input").val("")
                        $("#repeat_passwd_input").val("")
                        $("#old_passwd_input").val("")
                    }

                });    
            } else {
                alert("Пароли не совпадают!")
            }
            
        } else {
            alert("Пароль не может быть пустым!")
        }
        
        // alert($("#passwd_input").val())
    })

    $("#fullname_button").click( function(){
        $.ajax({
            type: "POST",
            url: "/1cengine/py_scripts/user.py",
            async: false,
            data: "fullname=" + $("#fullname_input").val() + "&funkt=change_fullname()",
            success: function(html) {
                alert(html)

                $("#fullname_input").attr("fullname",$("#fullname_input").val())
            }

        }); 
    })

    $("#fullname_input").change( function(){ fullname_changed() } )
})

function fullname_changed(){
    if( $("#fullname_input").val() == $("#fullname_input").attr("name") ){
        $("#fullname_button").hide()
    } else {
        $("#fullname_button").show()
    }
}

function logout(){
    $.removeCookie("sid",{ expires: 30, path: '/'})
    window.location = "/kabinet/authorization/"
}

// функция отправки сообщения техподдержке

function send_support(){
    $.blockUI.defaults.css.borderRadius = '10px'; //убираем серую границу
    $.blockUI.defaults.fadeIn = 100; //ускоряем появление
    $.blockUI.defaults.fadeOut = 100; //и исчезновение
    //$.blockUI.defaults.css.left = '39%'; //окно будет в центре
    $.blockUI.defaults.css.backgroundColor = 'white'
    $.blockUI.defaults.css.cursor = 'defaults'
    $.blockUI.defaults.css.boxShadow = '0px 0px 5px 5px rgb(207, 207, 207)'
    $.blockUI.defaults.css.fontSize = '14px'
    $.blockUI.defaults.css.width = '450px'
    $.blockUI.defaults.css.height = '220px'
    $.blockUI.defaults.css.border = 'none'

    $.blockUI({
        message: "\
        <span class='close_button'>x</span>\
        <div>\
            <textarea class='ss_textarea' placeholder='Введите ваше сообщение здесь'></textarea>\
            <span class='send_support_button'>Отправить сообщение в тех.поддержку</span>\
        </div>"
    });

    $(".send_support_button").click( function(){
        $.ajax({
            type: "POST",
            url: "/1cengine/py_scripts/send_support.py",
            async: true,
            data: "text=" + $(".ss_textarea").val()+"&href="+window.location.pathname,
            success: function(html){
                console.log(html)
                $.unblockUI();
            }
        })
    })

    $(document).on('keyup', function(e) {
        e.preventDefault();
        if (e.which === 27) {
            $.unblockUI();
        }
    });

    $(".close_button").click(function() {
        $.unblockUI();
    });

}