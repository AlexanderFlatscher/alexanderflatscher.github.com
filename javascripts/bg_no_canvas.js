(function() {

  if (Modernizr.canvas) {
    return;
  }

  $(function() {
    var bg_no_canvas, scroll_factors;
    scroll_factors = {
      biggest: 0.2,
      big: 0.4,
      medium: 0.5,
      small: 0.6,
      smallest: 0.9
    };
    bg_no_canvas = $('#bg_no_canvas');
    window.bg_circles = bg_no_canvas.find('.bg_circle');
    if (Modernizr.csstransitions) {
      bg_circles.not(".bg_circle0").addClass('inactive');
    } else {
      bg_circles.not(".bg_circle0").css({
        display: 'none'
      });
    }
    $(window).scroll(function() {
      var factor, name, scrollTop, _results;
      scrollTop = $(window).scrollTop();
      _results = [];
      for (name in scroll_factors) {
        factor = scroll_factors[name];
        _results.push(bg_no_canvas.children("." + name).css({
          top: -parseInt(scrollTop) * factor
        }));
      }
      return _results;
    });
    return $(window).bind('sectionChange', function(e) {
      var actives, inactives;
      actives = bg_circles.filter(".bg_circle" + e.index);
      inactives = bg_circles.not(".bg_circle" + e.index);
      if (Modernizr.csstransitions) {
        actives.removeClass('inactive');
        return inactives.addClass('inactive');
      } else if (Modernizr.opacity) {
        actives.finish().fadeIn(1000);
        return inactives.stop().fadeOut(1000);
      } else {
        actives.css('display', 'block');
        return inactives.css('display', 'none');
      }
    });
  });

}).call(this);
