// Generated by CoffeeScript 1.6.3
(function() {
  var show_basket;

  $("#tabBasket").click(show_basket());

  show_basket = function() {
    $("#pTableContent").hide();
    return $("#basketDiv").show();
  };

}).call(this);