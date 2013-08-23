$(document).ready( function (){
    $(".exitButton").click( function(){
        $.removeCookie("sid",{ expires: 30, path: '/'})
        window.location = "/kabinet/authorization/"
    })


    $(".enterButton").click( function(){ 
        downloader_array = new Array("285","365","377","379","382","385")
    
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
        $.blockUI.defaults.css.paddingTop = '10px'

        $.blockUI({
            message: $("#wait_please")
        });

        window.setTimeout(function(){ loginUser() },1000)

    } )
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
    // 
    
    function logout(){
        $.removeCookie("sid",{ expires: 30, path: '/'})
        window.location = "/kabinet/authorization/"
    }

    // Returns a random integer between min and max
    // Using Math.round() will give you a non-uniform distribution!
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function submit_form(){
        $.ajax({
            type: "POST",
            url: "/1cengine/py_scripts/user.py",
            async: false,
            data: "passwd=" + $(".hidden_passwd").val() + "&email=" + $(".emailInput").val() + "&funkt=authorize_me",
            success: function(html) {
                authorization = html
                eval(authorization)
                
            }

        });    
    }

    function loginUser(){
        
        passwd = $(".passwdInput").val()
        email = $(".emailInput").val()
        if(passwd!="" && email!=""){
            passwd = hex_sha256(passwd)

            $(".hidden_passwd").val(passwd) 

            submit_form()
            // $("#regForm").submit()  
        }
    }

    function logout(){
        $.removeCookie("sid",{ expires: 30, path: '/'})
        window.location = "/kabinet/authorization/"
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

