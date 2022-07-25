!function(e){
  "use strict";
  e((function() {
    var t, i , a = 2500,
        n = 650,
        o = 1500;

    function word_wrap(e) {
      var t = function (e) {
        return e.is(':last-child') ? e.parent().children().eq(0) : e.next()
      }(e);

      e.parents('.cd-headline').hasClass('clip') && e.parents('.cd-words-wrapper').animate({
        width: "2px"
      }, n, (function() {
        var i;
        i = t,
        e.removeClass('is-visible').addClass('is-hidden'),
        i.removeClass('is-hidden').addClass('is-visible'),
        function(e,t) {
          e.parents('.cd-headline').hasClass('clip') && e.parents('.cd-words-wrapper').animate({
            width: e.width()
          }, n, (function(){
            setTimeout((function() {
              word_wrap(e);
            }), o)
          }))
        }(t)
      }))
    }

    t = e('.cd-headline'), i = a, t.each((function(){
      var t = e(this);
      if (t.hasClass("clip")) {
        var wrap = t.find(".cd-words-wrapper"),
          wrap_w = wrap.width();
        wrap.css("width", wrap_w);
      }

      setTimeout((function() {
        word_wrap(t.find('.is-visible').eq(0))
      }), i)
    }))
  })), e(window).on("load", (function() {
    e(".preloader-icon").fadeOut(400), e(".preloader").delay(500).fadeOut("slow")
  }))
}(jQuery);