waitanswer = false;

function say_hello() {
    alert("Hello");
}

function giveoptions() {
    
};

$(document).ready(function() {
    //alert("Hello");
    $("#a11").keyup(function() {
        //alert('Handler for .change() called.');
        $("#output").html($("#a11").val());
        giveoptions();
        });
});