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