$(document).ready( function(){
    $("#passwd_button").click( function(){

        if( $("#passwd_input").val() != "" ){
            passwd = hex_sha256($("#passwd_input").val())
            $.ajax({
                type: "POST",
                url: "/1cengine/py_scripts/user.py",
                async: false,
                data: "passwd=" + passwd + "&funkt=change_passwd()",
                success: function(html) {
                    alert("Пароль успешно сменен")
                    is_email_valid = html
                    return is_email_valid
                }

            });
        } else {
            alert("Пароль не может быть пустым")
        }
        
        // alert($("#passwd_input").val())
    })
})