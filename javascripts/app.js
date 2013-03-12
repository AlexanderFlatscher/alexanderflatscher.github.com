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
  }, {
    test: Modernizr.mq('only all'),
    nope: "javascripts/respond.min.js"
  });

  /*,
    test: Modernizr.canvas
    yep: "/javascripts/paper.js"
  */


  $(function() {
    var firstSlide, slides;
    slides = $('.slide');
    firstSlide = slides.first();
    return window.app = {
      activeSlide: firstSlide,
      activateSlideWithId: function(id) {
        var s;
        s = $("#" + id);
        if (s) {
          app.activeSlide = s;
          app.applyBackgroundHue(parseFloat(s.attr('data-background-hue')));
          return $(window).trigger($.Event('sectionChange', {
            hue: app.backgroundHue,
            index: slides.index(s)
          }));
        } else {
          return false;
        }
      },
      backgroundHue: parseFloat(firstSlide.attr('data-background-hue')),
      applyBackgroundHue: function(hue) {
        return app.backgroundHue = hue;
      }
    };
  });

}).call(this);
