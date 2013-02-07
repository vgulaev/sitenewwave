$(document).ready( function (){
    $(".exitButton").click( function(){
        $.cookie("sid","")
        window.location = "/kabinet/authorization/"
    })

    $(".submitButton").click( function(){
        if($(".newUser").attr("checked") == "checked"){
            newUser()
        } else {
            loginUser()
        }
    })

    $(".newUser").change( function(){
        if($(".newUser").attr("checked") == "checked"){
            $(".passwdRepeatTr").show()
            $(".regButton").show()
            $(".enterButton").hide()
        } else {
            $(".passwdRepeatTr").hide()
            $(".regButton").hide()
            $(".enterButton").show()
        }
    })

    function loginUser(){
        passwd = $(".passwdInput").attr("value")
        email = $(".emailInput").attr("value")
        if(passwd!="" && email!=""){
            passwd = hex_sha256(passwd)
            $(".passwdInput").attr("value",passwd) 
            $("#regForm").submit()  
        }
    }

    function newUser(){
        passwd = $(".passwdInput").attr("value")
        passwdRepeat = $(".passwdInputRepeat").attr("value")
        email = $(".emailInput").attr("value")
        if(passwd!="" && email!=""){
            if(passwd==passwdRepeat){
                passwd = hex_sha256(passwd)
                $(".passwdInput").attr("value",passwd) 
                $("#regForm").submit()
            }
        }
    }

})

