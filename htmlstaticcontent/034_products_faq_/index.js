// Generated by CoffeeScript 1.6.3
(function() {
  $(document).ready(function() {
    return $(".headliner").click(function() {
      var text_block;
      $(".headliner").removeClass("active");
      $(this).addClass("active");
      $(".answer_text").fadeOut(400);
      text_block = $(this).parent().find(".answer_text");
      return text_block.fadeIn(400);
    });
  });

}).call(this);