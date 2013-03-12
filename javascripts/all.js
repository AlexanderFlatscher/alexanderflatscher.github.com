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
(function() {

  $(function() {
    var adjustMargin, html, icon, links, nav, toggleNav;
    nav = $('nav');
    icon = nav.children('.menu_icon').first();
    html = $('html');
    toggleNav = function() {
      if (html.hasClass('nav_open')) {
        return html.removeClass('nav_open');
      } else {
        return html.addClass('nav_open');
      }
    };
    adjustMargin = function() {
      if ($(window).width() >= 600) {
        return nav.css({
          marginRight: Math.max(($(window).width() - $('#wrapper').width()) / 2, 0)
        });
      }
    };
    adjustMargin();
    icon.click(function(e) {
      return false;
    });
    if (html.hasClass('touch')) {
      icon.bind("click", function(e) {
        toggleNav();
        return false;
      });
    } else {
      nav.hover(function(e) {
        return html.addClass('nav_open');
      }, function(e) {
        return html.removeClass('nav_open');
      });
    }
    $(window).resize(adjustMargin);
    links = $('ul li a', nav);
    return links.click(function(e) {
      var hash;
      if (html.hasClass('touch')) {
        toggleNav();
      }
      hash = $(e.target).attr('href');
      $.scrollTo(hash, 500, {
        onAfter: function() {
          return window.location.hash = hash;
        }
      });
      return false;
    });
  });

}).call(this);
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
(function() {
  var CircleSymbol, LissajousCircle, LissajousCircleManager,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if (!Modernizr.canvas) {
    return;
  }

  LissajousCircleManager = (function() {

    function LissajousCircleManager(canvas, scrollTop) {
      this.canvas = canvas;
      this.scrollTop = scrollTop != null ? scrollTop : 0;
      this.lissajousCircles = [];
      this.circleSymbols = {
        biggest: new CircleSymbol(this.canvas, 0.4, app.backgroundHue, 1, 0.5),
        big: new CircleSymbol(this.canvas, 0.3, app.backgroundHue, 1, 0.82),
        medium: new CircleSymbol(this.canvas, 0.2, app.backgroundHue, 1, 0.64),
        small: new CircleSymbol(this.canvas, 0.1, app.backgroundHue, 0.37, 0.46),
        smallest: new CircleSymbol(this.canvas, 0.05, app.backgroundHue, 0.56, 0.47)
      };
      window.test = this.circleSymbols;
      this.colorAnimation = {
        current: 0,
        end: 5,
        running: false
      };
    }

    LissajousCircleManager.prototype.adjustToSize = function(horizontalFactor, verticalFactor) {
      var cs, lc, size, _i, _len, _ref, _ref1, _results;
      _ref = this.lissajousCircles;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        lc = _ref[_i];
        lc.adjustToSize(horizontalFactor, verticalFactor);
      }
      _ref1 = this.circleSymbols;
      _results = [];
      for (size in _ref1) {
        cs = _ref1[size];
        _results.push(cs.adjustToSize(horizontalFactor, verticalFactor));
      }
      return _results;
    };

    LissajousCircleManager.prototype.applyNextAnimationStep = function(delta) {
      var cs, last, lc, size, _i, _len, _ref, _ref1;
      _ref = this.lissajousCircles;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        lc = _ref[_i];
        lc.circle.position = lc.getNextLocation(delta);
      }
      if (this.colorAnimation.running) {
        last = this.colorAnimation.current >= this.colorAnimation.end;
        _ref1 = this.circleSymbols;
        for (size in _ref1) {
          cs = _ref1[size];
          cs.applyColorAnimationStep(this.colorAnimation.current, this.colorAnimation.end, delta, last);
        }
        if (last) {
          return this.colorAnimation.running = false;
        } else {
          return this.colorAnimation.current += delta;
        }
      }
    };

    LissajousCircleManager.prototype.createLissajousCircle = function(size, lissajousPathData, scrollFactor, relativeVerticalOffset, lissajousPathProgress, speed) {
      return this.lissajousCircles.push(new LissajousCircle(this.circleSymbols[size], lissajousPathData, scrollFactor, relativeVerticalOffset, lissajousPathProgress, speed));
    };

    LissajousCircleManager.prototype.changeHue = function(hue) {
      var cs, size, _ref, _results;
      this.colorAnimation.running = true;
      this.colorAnimation.current = 0;
      _ref = this.circleSymbols;
      _results = [];
      for (size in _ref) {
        cs = _ref[size];
        _results.push(cs.prepareColorAnimation(hue));
      }
      return _results;
    };

    LissajousCircleManager.prototype.mouseRepulsion = function(point) {
      var hitResult, lc, _i, _len, _ref, _results;
      _ref = this.lissajousCircles;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        lc = _ref[_i];
        if (!lc.listenToMouseRepulsion()) {
          continue;
        }
        hitResult = lc.circle.hitTest(point, {
          tolerance: 50,
          fill: true,
          stroke: true
        });
        if (hitResult && hitResult.item) {
          _results.push(lc.setMouseRepulsion(point));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    LissajousCircleManager.prototype.setScrollOffset = function(top) {
      var lc, _i, _len, _ref, _results;
      this.scrollTop = top;
      _ref = this.lissajousCircles;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        lc = _ref[_i];
        _results.push(lc.setScrollOffset(top));
      }
      return _results;
    };

    return LissajousCircleManager;

  })();

  CircleSymbol = (function(_super) {

    __extends(CircleSymbol, _super);

    function CircleSymbol(canvas, size, hue, saturation, lightness) {
      var center, circlePath, color1, color2, radius;
      this.canvas = canvas;
      this.colorAnimation = {
        startColor: new paper.HslColor(hue, saturation, lightness),
        currentColor: new paper.HslColor(hue, saturation, lightness),
        desiredColor: new paper.HslColor(hue, saturation, lightness)
      };
      radius = size * (this.canvas.width > this.canvas.height ? this.canvas.width : this.canvas.height);
      center = new paper.Point(0, 0);
      circlePath = new paper.Path.Circle(center, radius);
      color1 = new paper.HslColor(hue, saturation, lightness, 0.5);
      color2 = new paper.HslColor(hue, saturation, lightness, 0.005);
      circlePath.fillColor = new paper.GradientColor(new paper.Gradient([color1, color2]), center.add([radius, -radius]), center.add([-radius, radius]));
      CircleSymbol.__super__.constructor.call(this, circlePath);
    }

    CircleSymbol.prototype.adjustToSize = function(horizontalFactor, verticalFactor) {
      var f;
      f = this.canvas.width > this.canvas.height ? horizontalFactor : verticalFactor;
      return this.definition.scale(f);
    };

    CircleSymbol.prototype.applyColorAnimationStep = function(current, end, delta, last) {
      var next, s, _i, _len, _ref, _results;
      next = (current + delta) / end;
      this.colorAnimation.redStep = (this.colorAnimation.desiredColor.red - this.colorAnimation.currentColor.red) * next;
      this.colorAnimation.greenStep = (this.colorAnimation.desiredColor.green - this.colorAnimation.currentColor.green) * next;
      this.colorAnimation.blueStep = (this.colorAnimation.desiredColor.blue - this.colorAnimation.currentColor.blue) * next;
      _ref = this.definition.fillColor.gradient.stops;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
        if (last) {
          this.colorAnimation.currentColor.red = s.color.red = this.colorAnimation.desiredColor.red;
          this.colorAnimation.currentColor.green = s.color.green = this.colorAnimation.desiredColor.green;
          _results.push(this.colorAnimation.currentColor.blue = s.color.blue = this.colorAnimation.desiredColor.blue);
        } else {
          this.colorAnimation.currentColor.red = s.color.red += this.colorAnimation.redStep;
          this.colorAnimation.currentColor.green = s.color.green += this.colorAnimation.greenStep;
          _results.push(this.colorAnimation.currentColor.blue = s.color.blue += this.colorAnimation.blueStep);
        }
      }
      return _results;
    };

    CircleSymbol.prototype.prepareColorAnimation = function(hue) {
      return this.colorAnimation.desiredColor.hue = hue;
    };

    return CircleSymbol;

  })(paper.Symbol);

  LissajousCircle = (function() {

    function LissajousCircle(symbol, lissajousPathData, scrollFactor, relativeVerticalOffset, lissajousPathProgress, speed) {
      var s, _i, _len, _ref;
      this.scrollFactor = scrollFactor != null ? scrollFactor : 0;
      this.relativeVerticalOffset = relativeVerticalOffset != null ? relativeVerticalOffset : 0;
      this.lissajousPathProgress = lissajousPathProgress != null ? lissajousPathProgress : 0;
      this.speed = speed != null ? speed : 10;
      this.state = "lissajous";
      this.verticalOffset = this.relativeVerticalOffset * ($('body').height() / 4) * this.scrollFactor;
      this.mouseRepulsionTimer = 0;
      this.mouseRepulsionPathProgress = 0;
      this.returnPathProgress = 0;
      this.returnSpeed = 0;
      this.returnSpeedProgress = 0;
      this.scrollOffset = 0;
      this.lissajousPath = new paper.Path();
      this.lissajousPath.strokeColor = "black";
      this.lissajousPath.visible = false;
      _ref = lissajousPathData.segments;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
        s.point.y += this.verticalOffset;
        this.lissajousPath.add(new paper.Segment(s.point, s.handleIn, s.handleOut));
      }
      this.lissajousPath.closed = true;
      this.lissajousPath.scale($('body').width() / 1000, $('body').height() / 4 / 1000, [0, 0]);
      this.circle = symbol.place(this.lissajousPath.getPointAt(this.lissajousPathProgress));
      this.setScrollOffset($(window).scrollTop());
    }

    LissajousCircle.prototype.adjustToSize = function(horizontalFactor, verticalFactor) {
      var oldVerticalOffset, s, _i, _len, _ref;
      oldVerticalOffset = this.verticalOffset;
      this.verticalOffset = this.relativeVerticalOffset * ($('body').height() / 4) * this.scrollFactor;
      _ref = this.lissajousPath.segments;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
        s.point.x *= horizontalFactor;
        s.point.y = (s.point.y - oldVerticalOffset) * verticalFactor + this.verticalOffset;
        if (s.handleIn != null) {
          s.handleIn.x *= horizontalFactor;
          s.handleIn.y *= verticalFactor;
        }
        if (s.handleOut != null) {
          s.handleOut.x *= horizontalFactor;
          s.handleOut.y *= verticalFactor;
        }
      }
      if (this.state === "return") {
        return this.calculateReturnPath();
      }
    };

    LissajousCircle.prototype.exportLissajousPath = function() {
      return JSON.stringify(this.lissajousPath, ['segments', 'handleIn', 'handleOut', 'point', 'x', 'y']);
    };

    LissajousCircle.prototype.raiseLissajousPathProgress = function(amount) {
      var newProgress;
      newProgress = this.lissajousPathProgress + amount;
      return this.lissajousPathProgress = newProgress < this.lissajousPath.length ? newProgress : 0;
    };

    LissajousCircle.prototype.calculateReturnPath = function(resetReturnPathProgress, setLissajousPathProgress) {
      var lProgress, lStart, lastLissajousPoint, lastReturnPoint, newPoint, sampleRate;
      if (resetReturnPathProgress == null) {
        resetReturnPathProgress = true;
      }
      if (setLissajousPathProgress == null) {
        setLissajousPathProgress = true;
      }
      if (this.returnPath != null) {
        this.returnPath.remove();
      }
      this.returnPath = new paper.Path(this.circle.position.subtract([0, this.scrollOffset]).clone());
      lProgress = this.lissajousPathProgress;
      lStart = this.lissajousPathProgress;
      sampleRate = 2;
      while (true) {
        lProgress += 0.5;
        lastLissajousPoint = this.lissajousPath.getLocationAt(lProgress % this.lissajousPath.length);
        lastLissajousPoint = lastLissajousPoint.point;
        lastReturnPoint = this.returnPath.lastSegment.point;
        newPoint = lastLissajousPoint.subtract(lastReturnPoint).normalize(sampleRate).add(lastReturnPoint);
        this.returnPath.lineTo(newPoint);
        if (newPoint.getDistance(lastLissajousPoint) < 1) {
          break;
        }
      }
      this.returnPath.simplify();
      if (resetReturnPathProgress) {
        this.returnPathProgress = 0;
      }
      if (setLissajousPathProgress) {
        return this.raiseLissajousPathProgress(lProgress - lStart);
      }
    };

    LissajousCircle.prototype.getNextLocation = function(delta) {
      var b, c, d, e, n, t;
      switch (this.state) {
        case "lissajous":
          this.raiseLissajousPathProgress(this.speed * delta);
          return this.lissajousPath.getPointAt(this.lissajousPathProgress).add([0, this.scrollOffset]);
        case "mouseRepulsion":
          t = this.mouseRepulsionPathProgress;
          d = this.mouseRepulsionPath.length;
          b = this.mouseRepulsionPath.getLocationAt(0).point;
          e = this.mouseRepulsionPath.getLocationAt(this.mouseRepulsionPath.length).point;
          c = e.subtract(b);
          this.mouseRepulsionTimer++;
          if (t >= d) {
            n = e;
            this.calculateReturnPath();
            this.state = "return";
            this.mouseRepulsionTimer = 0;
          } else {
            n = (c.multiply((t = t / d - 1) * t * t + 1)).add(b);
            this.mouseRepulsionPathProgress += d * 0.6 * delta;
          }
          return n.add([0, this.scrollOffset]);
        case "return":
          if (this.returnPathProgress >= this.returnPath.length) {
            this.state = "lissajous";
          }
          if (this.returnSpeed < this.speed) {
            this.returnSpeed += 0.1;
          }
          this.returnPathProgress += this.returnSpeed * delta;
          return this.returnPath.getPointAt(Math.min(this.returnPathProgress, this.returnPath.length)).add([0, this.scrollOffset]);
        default:
          return this.lissajousPath.getLocationAt(this.lissajousPathProgress).point.add([0, this.scrollOffset]);
      }
    };

    LissajousCircle.prototype.setMouseRepulsion = function(point) {
      var cPosition, vector, vectorLength;
      if (this.mouseRepulsionPath != null) {
        this.mouseRepulsionPath.remove();
      }
      point = point.subtract([0, this.scrollOffset]);
      cPosition = this.circle.position.subtract([0, this.scrollOffset]);
      vectorLength = 100 - (point.getDistance(cPosition) - this.circle.bounds.width / 2);
      vector = ((cPosition.subtract(point)).normalize(vectorLength)).add(cPosition);
      this.mouseRepulsionPath = new paper.Path.Line(cPosition, vector);
      this.mouseRepulsionPath.strokeColor = "red";
      this.mouseRepulsionPath.visible = false;
      this.mouseRepulsionPathProgress = 0;
      this.mouseRepulsionTimer = 0;
      return this.state = "mouseRepulsion";
    };

    LissajousCircle.prototype.setScrollOffset = function(scrollTop) {
      return this.scrollOffset = -scrollTop * this.scrollFactor;
    };

    LissajousCircle.prototype.listenToMouseRepulsion = function() {
      return this.mouseRepulsionTimer === 0 || this.mouseRepulsionTimer > 15;
    };

    return LissajousCircle;

  })();

  $(function() {
    /*
      stats = new Stats()
      stats.setMode(0)
      stats.domElement.style.position = 'fixed'
      stats.domElement.style.left = '0px'
      stats.domElement.style.top = '0px'
      stats.domElement.style.letterSpacing = '0px'
      document.body.appendChild(stats.domElement)
    */

    var $window, bgPaper, canvas, circles, tool;
    $window = $(window);
    bgPaper = $('#bg_paper');
    bgPaper.attr({
      width: $window.width(),
      height: $window.height()
    });
    canvas = bgPaper[0];
    paper.setup(canvas);
    window.lcm = new LissajousCircleManager(canvas, $window.scrollTop());
    paper.view.draw();
    circles = [];
    $.getJSON('/javascripts/lissajous_paths.json', function(data) {
      circles.push(lcm.createLissajousCircle("biggest", data.lissajousPaths[circles.length], 0.2, 1, 1000, 5));
      circles.push(lcm.createLissajousCircle("biggest", data.lissajousPaths[circles.length], 0.2, 4, 4500, 5));
      circles.push(lcm.createLissajousCircle("big", data.lissajousPaths[circles.length], 0.4, 0.5, 4500, 8));
      circles.push(lcm.createLissajousCircle("big", data.lissajousPaths[circles.length], 0.4, 3, 3500, 8));
      circles.push(lcm.createLissajousCircle("medium", data.lissajousPaths[circles.length], 0.5, 0.5, 500));
      circles.push(lcm.createLissajousCircle("medium", data.lissajousPaths[circles.length], 0.5, 3.3, 2000));
      circles.push(lcm.createLissajousCircle("small", data.lissajousPaths[circles.length], 0.6, 0.4, 4500));
      circles.push(lcm.createLissajousCircle("small", data.lissajousPaths[circles.length], 0.6, 2.8));
      circles.push(lcm.createLissajousCircle("smallest", data.lissajousPaths[circles.length], 0.9, 0.2, 0, 12));
      return circles.push(lcm.createLissajousCircle("smallest", data.lissajousPaths[circles.length], 0.9, 3.8, 5000, 12));
    });
    paper.view.onFrame = function(e) {
      var scrollTop;
      scrollTop = $window.scrollTop();
      if (scrollTop !== lcm.scrollTop) {
        lcm.setScrollOffset(scrollTop);
      }
      return lcm.applyNextAnimationStep(e.delta);
    };
    if (Modernizr.touch) {
      document.addEventListener("touchmove", function(e) {
        return console.log(e);
      }, false);
    } else {
      tool = new paper.Tool();
      tool.onMouseMove = function(e) {
        return lcm.mouseRepulsion(e.point);
      };
    }
    $window.bind("sectionChange", function(e) {
      return lcm.changeHue(e.hue);
    });
    return $window.resize(function(e) {
      var h, horizontalFactor, newSize, oldSize, verticalFactor, w;
      w = $window.width();
      h = $window.height();
      oldSize = [paper.view.viewSize.width, paper.view.viewSize.height];
      newSize = paper.view.viewSize = [w, h];
      horizontalFactor = newSize[0] / oldSize[0];
      verticalFactor = newSize[1] / oldSize[1];
      return lcm.adjustToSize(horizontalFactor, verticalFactor);
    });
  });

  /*
    window.calculateLissajousPaths = (canvasWidth, canvasHeight) ->
      params = [
        {wx: 2, wy: 1, omega: 3/4 * Math.PI},
        {wx: 1, wy: 3, omega: 1/4 * Math.PI}, 
        {wx: 1, wy: 4, omega: 1/2 * 1/3 * Math.PI}, 
        {wx: 4, wy: 3, omega: 1/3 * 1/4 * Math.PI}, 
        {wx: 3, wy: 4, omega: 1/3 * 3/4 * Math.PI}, 
        {wx: 2, wy: 1, omega: Math.PI}, 
        {wx: 3, wy: 4, omega: 1/3 * Math.PI}, 
        {wx: 4, wy: 3, omega: 5/8 * Math.PI}, 
        {wx: 4, wy: 3, omega: 1/3 * 3/4 * Math.PI}, 
        {wx: 2, wy: 3, omega: 1/2 * Math.PI}
      ]
  
      j = '{"lissajousPaths": ['
      for p in params
  
        lissajousPath = new paper.Path();
        lissajousPath.strokeColor = "red"
  
        for num in [0...2*Math.PI] by 0.001 #0.005
          lissajousPath.add new paper.Point((Math.sin(p.wx*num+p.omega) + 1) * canvasWidth / 2, ((Math.sin(p.wy*num+p.omega) + 1) * canvasHeight / 2))
  
        lissajousPath.closed = true
        lissajousPath.simplify()
  
        j += JSON.stringify(lissajousPath, ['segments', 'handleIn', 'handleOut', 'point', 'x', 'y'])
        j += ","
  
      j = j.substring(0, j.length - 1)
      j += "]}"
  
      return j
  */


}).call(this);
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
(function() {



}).call(this);
