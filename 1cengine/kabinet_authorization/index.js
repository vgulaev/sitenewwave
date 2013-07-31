$(document).ready( function (){
    $(".exitButton").click( function(){
        $.removeCookie("sid",{ expires: 30, path: '/'})
        window.location = "/kabinet/authorization/"
    })


    $(".enterButton").click( function(){ loginUser() } )
    $(".regButton").click( function(){ newUser() } )

    // $(".newUser").change( function(){
    //     if($(".newUser").attr("checked") == "checked"){
    //         $(".passwdRepeatTr").show()
    //         $(".regButton").show()
    //         $(".enterButton").hide()
    //     } else {
    //         $(".passwdRepeatTr").hide()
    //         $(".regButton").hide()
    //         $(".enterButton").show()
    //     }
    // })

    function loginUser(){
        passwd = $(".passwdInput").val()
        email = $(".emailInput").val()
        if(passwd!="" && email!=""){
            passwd = hex_sha256(passwd)
            $(".passwdInput").val(passwd) 
            $("#regForm").submit()  
        }
    }

    function newUser(){
        
        passwd = $(".passwdInput").val()
        passwdRepeat = $(".passwdInputRepeat").val()
        email = $(".emailInput").val()
        

        $(".newUser").attr("checked", "checked")
        if(passwd!="" && email!=""){
            is_email_valid = ""
            $.ajax({
                type: "POST",
                url: "/1cengine/py_scripts/user.py",
                async: false,
                data: "email=" + email + "&funkt=is_valid_email("+email+")",
                success: function(html) {
                    is_email_valid = html
                    return is_email_valid
                }

            });
            // alert(is_email_valid)
            if(is_email_valid.indexOf("False")!=-1){
                alert('Пользователь уже существует')
                $(".emailInput").css("outline","1px solid red")
            } else {
                $(".emailInput").css("outline","None")
                $(".passwdRepeatTr").show()
                if(passwd==passwdRepeat){
                    passwd = hex_sha256(passwd)
                    $(".passwdInput").val(passwd) 
                    $("#regForm").submit()
                } else {
                    $(".passwdInputRepeat").css("outline","1px solid red")
                }    
            }
            
        }
    }

})

