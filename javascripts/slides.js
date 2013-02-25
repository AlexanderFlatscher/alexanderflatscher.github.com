(function() {

  $(function() {
    var centerSlides, slides, w;
    slides = $('#wrapper .slide');
    w = $(window);
    centerSlides = function() {
      var wh, ww;
      wh = w.height();
      ww = w.width();
      if (ww > wh && ww >= 600) {
        return slides.each(function(i, e) {
          var eh, element, padding;
          element = $(e);
          eh = element.height();
          padding = eh < wh ? (wh - eh) / 2 : '';
          return element.css({
            paddingTop: padding,
            paddingBottom: padding
          });
        });
      } else {
        return slides.each(function(i, e) {
          return $(e).css({
            paddingTop: '',
            paddingBottom: ''
          });
        });
      }
    };
    w.load(centerSlides);
    w.resize(centerSlides);
    return w.scroll(function(e) {
      var breakpoint, lastTop, nearestSlideId, s, slide, top, _i, _len;
      breakpoint = w.scrollTop() + w.height() / 2;
      lastTop = -1;
      nearestSlideId = void 0;
      for (_i = 0, _len = slides.length; _i < _len; _i++) {
        slide = slides[_i];
        s = $(slide);
        top = s.position().top;
        if (top > lastTop && top < breakpoint) {
          lastTop = top;
          nearestSlideId = s.attr('id');
        }
      }
      if (app.activeSlide.attr('id') !== nearestSlideId) {
        return app.activateSlideWithId(nearestSlideId);
      }
    });
  });

}).call(this);
