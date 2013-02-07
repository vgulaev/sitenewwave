$(document).ready( function (){
    $(".enterButton").click( function(){
        if($(".newUser").attr("checked") == "checked"){
            newUser()
        } else {
            loginUser()
        }
    })

    $(".newUser").change( function(){
        if($(".newUser").attr("checked") == "checked"){
            $(".passwdRepeatTr").slideDown("400")
        } else {
            $(".passwdRepeatTr").slideUp("400")
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

