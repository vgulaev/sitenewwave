$(document).ready( function (){
    $(".enterButton").click( function(){
        passwd = $(".passwdInput").attr("value")
        email = $(".emailInput").attr("value")
        if(passwd!="" && email!=""){
            $.ajax({
                type: "POST",
                url: "/1cengine/kabinet_authorization/user.py",
                async: false,
                data: "funkt=checkUser&email=" + email + "&passwd=" + hex_sha256(passwd),
                success: function(html) {
                    ret = html
                    alert(ret)
                }
            });
            // alert(hex_sha256(passwd))    
        }
        
    })
})

