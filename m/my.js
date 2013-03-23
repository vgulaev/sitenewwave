function doSomething() {
    //alert("Hello!!!");
    $("#WordList").html('<li data-theme="c" data-icon="arrow-l"><a href="#Main" data-transition="slide"> Арматура </a></li>');
    $("#WordList").listview("refresh");
}

$(document).ready(function() {
	$("#output").html("Hello!!!");

    //doSomething();
    /*$("#ButtonEx").click(function(e){
    alert("Hello!!!");
    //$("#output").html("Hello!!!");
    })*/
})