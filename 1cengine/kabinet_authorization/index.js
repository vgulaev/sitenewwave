$(document).ready( function (){
    $(".exitButton").click( function(){
        $.removeCookie("sid",{ expires: 30, path: '/'})
        window.location = "/kabinet/authorization/"
    })

    $(document).on("keyup", function(e) {
        e.preventDefault();
        if (e.which === 27) {
            return $.unblockUI();
        }
    });

    $(".passwdInput").on("keyup", function(e) {
            e.preventDefault();
            if (e.which === 13) {
                $(".enterButton").click()
            }
        });

    $(".enterButton").click( function(){

        if($(".passwdInput").val() == "") {
            $(".passwdInput").focus()
            $(".passwdInput").addClass("input_empty")
            return false
        }

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
        $.blockUI.defaults.css.height = 'auto'
        $.blockUI.defaults.css.paddingTop = '10px'


        downloader_array = new Array("285","365","377","379","382","385")

        wait_message = "<div id='wait_please'><h3>Авторизация</h3>"
        wait_message += "<div class='authorize_message'>"
        wait_message += "<img src='/1cengine/kabinet_authorization/" + downloader_array[getRandomInt(0, 5)] + ".png' />"
        wait_message += "<p >Пытаемся Вас авторизовать...</p></div></div>"

        $.blockUI({
            message: wait_message
        });

        $(document).on("keyup", function(e) {
            e.preventDefault();
            if (e.which === 27) {
                return $.unblockUI();
            }
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
    
    $(".htr_closed").click( function(){
        $(this).find(".infoHide").show()
        $(this).removeClass("htr_closed")
    })

    $("#fileuploader").uploadFile({
        url: "/1cengine/py_scripts/send_lk_request.py",
        allowedTypes:"pdf,tif,png,gif,jpg,jpeg",
        maxFileCount: 1,
        fileName: "myfile",
        afterUploadAll: function(){
            alert("Ваше заявление поступило в нашу компанию и будет обработано. Уведомление об этом придёт на указанный в заявлениие адрес электронной почты вместе с реквизитами для входа.")
        }
    });


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
            async: true,
            data: "passwd=" + $(".hidden_passwd").val() + "&email=" + $(".emailInput").val() + "&funkt=authorize_me",
            success: function(html) {
                authorization = html
                eval(authorization)
                
                $(".reset_close").click( function(){
                    $.unblockUI()
                })
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

    function reset_password(){
        my_css = {
            borderRadius: '10px',
            fadeIn: 100,
            fadeOut: 100,
            backgroundColor: 'white',
            cursor: 'defaults',
            boxShadow: '0px 0px 5px 5px rgb(207, 207, 207)',
            fontSize: '14px',
            width: '500px',
            height: 'auto',
            paddingTop: '10px',
            textAlign: 'left',
            paddingBottom: '30px'
        }

        msg = "<div class='wrapper'><h3>Сброс пароля</h3>"
        msg += "<div class='reset_text'>"
        msg += "<p>Введите адрес вашей электронной почты, чтобы мы выслали на него новый пароль</p>"
        msg += "<input class='reset_email' type='teaxarea' /><div class='reset_button'>Сбросить</div></div></div>"

        $.blockUI({
            message: msg,
            css: my_css
        });

        $(".blockMsg").draggable();

        $(".reset_button").click(function() {
            email = $(".reset_email").val()
            downloader_array = new Array("285","365","377","379","382","385")

            wait_message = "<img src='/1cengine/kabinet_authorization/" + downloader_array[getRandomInt(0, 5)] + ".png' />"
            wait_message += "<p>Сбрасываем ваш пароль...</p>"

            $(".reset_text").html(wait_message)

            window.setTimeout(function(){ send_reset(email) },1000)

        });

        $(document).on("keyup", function(e) {
            e.preventDefault();
            if (e.which === 27) {
                return $.unblockUI();
            }
        });

        $(".reset_email").on("keyup", function(e) {
            e.preventDefault();
            if (e.which === 13) {
                $(".reset_button").click()
            }
        });


    }

    function send_reset(email){
        // alert(email)
        $.ajax({
                type: "POST",
                url: "/1cengine/py_scripts/reset_passwd.py",
                async: true,
                data: "email=" + email,
                success: function(html) {
                    result_message = "<p>"+html+"</p>"
                    result_message += "<div class='reset_close'>Закрыть</div>"
                    $(".reset_text").html(result_message)
                    // $.unblockUI();

                    $(".reset_close").click( function(){
                        $.unblockUI()
                    })
                }

            });
    }

    $(".iForgotPasswd").click( function(){

        reset_password()
    })

})
