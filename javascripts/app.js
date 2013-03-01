(function() {

  Modernizr.load({
    load: '/javascripts/hyphenator.js'
  }, {
    test: Modernizr.touch,
    yep: "/javascripts/fastclick.min.js",
    callback: function(result, key) {
      if (result) {
        return $(function() {
          return $('.fastclick').each(function() {
            console.log("fastclick");
            return new FastClick(this);
          });
        });
      }
    }
  });

  /*,
    test: Modernizr.canvas
    yep: "/javascripts/paper.js"
  */


  $(function() {
    var firstSlide;
    firstSlide = $('.slide').first();
    return window.app = {
      activeSlide: firstSlide,
      activateSlideWithId: function(id) {
        var s;
        s = $("#" + id);
        if (s) {
          app.activeSlide = s;
          app.applyBackgroundHue(parseFloat(s.attr('data-background-hue')));
          return $('#wrapper').trigger('sectionChange');
        } else {
          return false;
        }
      },
      backgroundHue: parseFloat(firstSlide.attr('data-background-hue')),
      applyBackgroundHue: function(hue) {
        app.backgroundHue = hue;
        return $(window).trigger($.Event('backgroundHueChange', {
          hue: hue
        }));
      }
      /*colorAnimation:
        current: 0
        end: 50
        isRunning: () ->
          return app.colorAnimation.current < app.colorAnimation.end
        isFirstStep: () ->
          return app.colorAnimation.current == 0
        isLastStep: () ->
          return app.colorAnimation.current == (app.colorAnimation.end - 1)
      */

    };
  });

}).call(this);
