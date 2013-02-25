(function() {
  var LissajousCircle, ProgressBar;

  if (!Modernizr.canvas) {
    return;
  }

  LissajousCircle = (function() {

    function LissajousCircle(canvas, lissajousPathData, size, hue, saturation, lightness, scrollFactor, relativeVerticalOffset, lissajousPathProgress, speed) {
      var center, color1, color2, s, _i, _len, _ref;
      this.canvas = canvas;
      this.scrollFactor = scrollFactor != null ? scrollFactor : 0;
      if (relativeVerticalOffset == null) {
        relativeVerticalOffset = 0;
      }
      this.lissajousPathProgress = lissajousPathProgress != null ? lissajousPathProgress : 0;
      this.speed = speed != null ? speed : 10;
      this.state = "lissajous";
      this.verticalOffset = relativeVerticalOffset * ($('body').height() / 4);
      this.mouseRepulsionTimer = 0;
      this.mouseRepulsionPathProgress = 0;
      this.returnPathProgress = 0;
      this.returnSpeed = 0;
      this.returnSpeedProgress = 0;
      this.scrollOffset = 0;
      this.colorAnimation = {
        initialColor: new paper.HslColor(hue, saturation, lightness),
        currentColor: new paper.HslColor(hue, saturation, lightness),
        desiredColor: new paper.HslColor(hue, saturation, lightness)
      };
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
      center = new paper.Point(0, this.verticalOffset);
      this.radius = size * (this.canvas.width > this.canvas.height ? this.canvas.width : this.canvas.height);
      this.circle = new paper.Path.Circle(center, this.radius);
      color1 = new paper.HslColor(hue, saturation, lightness, 0.5);
      color2 = new paper.HslColor(hue, saturation, lightness, 0.005);
      this.circle.fillColor = new paper.GradientColor(new paper.Gradient([color1, color2]), center.add([this.radius, -this.radius]), center.add([-this.radius, this.radius]));
      this.circle.position = this.lissajousPath.getPointAt(this.lissajousPathProgress);
      this.setScrollOffset($(window).scrollTop());
    }

    LissajousCircle.prototype.exportLissajousPath = function() {
      return JSON.stringify(this.lissajousPath, ['segments', 'handleIn', 'handleOut', 'point', 'x', 'y']);
    };

    LissajousCircle.prototype.adjustToSize = function(horizontalFactor, verticalFactor) {
      var f, s, _i, _len, _ref;
      _ref = this.lissajousPath.segments;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
        s.point.x *= horizontalFactor;
        s.point.y *= verticalFactor;
        if (s.handleIn != null) {
          s.handleIn.x *= horizontalFactor;
          s.handleIn.y *= verticalFactor;
        }
        if (s.handleOut != null) {
          s.handleOut.x *= horizontalFactor;
          s.handleOut.y *= verticalFactor;
        }
      }
      f = this.canvas.width > this.canvas.height ? horizontalFactor : verticalFactor;
      this.circle.scale(f);
      return this.radius *= f;
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

    LissajousCircle.prototype.setHue = function(hue) {
      var s, _i, _len, _ref, _results;
      _ref = this.circle.fillColor.gradient.stops;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
        _results.push(s.color.hue = hue);
      }
      return _results;
    };

    LissajousCircle.prototype.setMouseRepulsion = function(point) {
      var cPosition, vector, vectorLength;
      if (this.mouseRepulsionPath != null) {
        this.mouseRepulsionPath.remove();
      }
      point = point.subtract([0, this.scrollOffset]);
      cPosition = this.circle.position.subtract([0, this.scrollOffset]);
      vectorLength = 100 - (point.getDistance(cPosition) - this.radius);
      vector = ((cPosition.subtract(point)).normalize(vectorLength)).add(cPosition);
      this.mouseRepulsionPath = new paper.Path.Line(cPosition, vector);
      this.mouseRepulsionPathProgress = 0;
      this.mouseRepulsionTimer = 0;
      this.state = "mouseRepulsion";
      this.mouseRepulsionPath.strokeColor = "red";
      return this.mouseRepulsionPath.visible = false;
    };

    LissajousCircle.prototype.setScrollOffset = function(scrollTop) {
      return this.scrollOffset = this.verticalOffset - scrollTop * this.scrollFactor;
    };

    LissajousCircle.prototype.listenToMouseRepulsion = function() {
      return this.mouseRepulsionTimer === 0 || this.mouseRepulsionTimer > 15;
    };

    LissajousCircle.prototype.prepareColorAnimationTo = function(hue) {
      this.colorAnimation.desiredColor.hue = hue;
      this.colorAnimation.redStep = (this.colorAnimation.desiredColor.red - this.colorAnimation.currentColor.red) / (app.colorAnimation.end - app.colorAnimation.current);
      this.colorAnimation.greenStep = (this.colorAnimation.desiredColor.green - this.colorAnimation.currentColor.green) / (app.colorAnimation.end - app.colorAnimation.current);
      return this.colorAnimation.blueStep = (this.colorAnimation.desiredColor.blue - this.colorAnimation.currentColor.blue) / (app.colorAnimation.end - app.colorAnimation.current);
    };

    LissajousCircle.prototype.applyColorAnimationStep = function(last) {
      var s, _i, _len, _ref, _results;
      if (last == null) {
        last = false;
      }
      if (!this.colorAnimation.currentColor.equals(this.colorAnimation.desiredColor)) {
        _ref = this.circle.fillColor.gradient.stops;
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
      }
    };

    return LissajousCircle;

  })();

  ProgressBar = (function() {

    function ProgressBar(canvas, height) {
      var progressBarPoint, progressBarSize;
      this.progress = 0;
      this.currentWidth = 0;
      this.fullWidth = canvas.width;
      this.fullHeight = canvas.height;
      this.expandProgress = 0;
      this.expandEnd = 50;
      progressBarPoint = new paper.Point(0, canvas.height / 2 - height / 2);
      progressBarSize = new paper.Size(0, height);
      this.rectangle = new paper.Path.Rectangle(progressBarPoint, progressBarSize);
      this.rectangle.fillColor = "#00AAFF";
      this.rectangle.fillColor.alpha = 0.5;
    }

    ProgressBar.prototype.setProgress = function(p) {
      this.progress = p;
      return this.setRectangleWidth(this.fullWidth * p / 100);
    };

    ProgressBar.prototype.setRectangleWidth = function(width) {
      return this.rectangle.segments[2].point.x = this.rectangle.segments[3].point.x = width;
    };

    ProgressBar.prototype.adjustToSize = function(hor, ver) {
      var currentWidth;
      currentWidth = this.rectangle.segments[2].point.x;
      this.setRectangleWidth(currentWidth * hor);
      this.fullWidth *= hor;
      this.fullHeight *= ver;
      return this.rectangle.position.y *= ver;
    };

    ProgressBar.prototype.isFinished = function() {
      return this.progress === 100;
    };

    ProgressBar.prototype.expandVertically = function() {
      var stepSize;
      if (!this.isFullyExpanded()) {
        stepSize = (this.fullHeight - 20) / 2 / this.expandEnd;
        this.rectangle.segments[0].point.y += stepSize;
        this.rectangle.segments[3].point.y += stepSize;
        this.rectangle.segments[1].point.y -= stepSize;
        this.rectangle.segments[2].point.y -= stepSize;
        this.rectangle.opacity -= 1 / this.expandEnd;
        return this.expandProgress++;
      } else {
        return console.error("already fully expanded");
      }
    };

    ProgressBar.prototype.isFullyExpanded = function() {
      return this.expandProgress === this.expandEnd;
    };

    ProgressBar.prototype.destroy = function() {
      return this.rectangle.remove();
    };

    return ProgressBar;

  })();

  $(function() {
    /*stats = new Stats()
    stats.setMode(0)
    stats.domElement.style.position = 'fixed'
    stats.domElement.style.left = '0px'
    stats.domElement.style.top = '0px'
    stats.domElement.style.letterSpacing = '0px'
    document.body.appendChild(stats.domElement)
    */

    var background, bgPaper, canvas, circles, onFrameAnimationState, onFrameInstructions, tool;
    bgPaper = $('#bg_paper');
    bgPaper.attr({
      width: $(window).width(),
      height: $(window).height()
    });
    canvas = bgPaper[0];
    paper.setup(canvas);
    background = new paper.Path.Rectangle(paper.view.bounds);
    background.fillColor = new paper.GradientColor(new paper.Gradient(['#fff', '#f8f8f8']), new paper.Point(paper.view.bounds.width / 2, 0), [paper.view.bounds.width / 2, paper.view.bounds.height]);
    window.progressBar = new ProgressBar(canvas, 20);
    paper.view.draw();
    circles = [];
    $.getJSON('/javascripts/lissajous_paths.json', function(data) {
      circles.push(new LissajousCircle(canvas, data.lissajousPaths[circles.length], 0.4, app.backgroundHue, 1, 0.5, 0.2, 0.2, 4000, 5));
      circles.push(new LissajousCircle(canvas, data.lissajousPaths[circles.length], 0.4, app.backgroundHue, 1, 0.5, 0.2, 0.4, 2000, 5));
      circles.push(new LissajousCircle(canvas, data.lissajousPaths[circles.length], 0.3, app.backgroundHue, 1, 0.82, 0.4, 0.2, 4500, 8));
      circles.push(new LissajousCircle(canvas, data.lissajousPaths[circles.length], 0.3, app.backgroundHue, 1, 0.82, 0.4, 0.9, 3500, 8));
      circles.push(new LissajousCircle(canvas, data.lissajousPaths[circles.length], 0.2, app.backgroundHue, 1, 0.64, 0.5, 0, 500));
      circles.push(new LissajousCircle(canvas, data.lissajousPaths[circles.length], 0.2, app.backgroundHue, 1, 0.64, 0.5, 0.9, 2000));
      circles.push(new LissajousCircle(canvas, data.lissajousPaths[circles.length], 0.1, app.backgroundHue, 0.37, 0.46, 0.6, 0.4, 4500));
      circles.push(new LissajousCircle(canvas, data.lissajousPaths[circles.length], 0.1, app.backgroundHue, 0.37, 0.46, 0.6, 1.3));
      circles.push(new LissajousCircle(canvas, data.lissajousPaths[circles.length], 0.05, app.backgroundHue, 0.56, 0.47, 0.9, 0.2, 0, 12));
      return circles.push(new LissajousCircle(canvas, data.lissajousPaths[circles.length], 0.05, app.backgroundHue, 0.56, 0.47, 0.9, 1.5, 5000, 12));
    });
    onFrameAnimationState = "circles";
    onFrameInstructions = {
      circles: function(delta) {
        var c, _i, _len;
        for (_i = 0, _len = circles.length; _i < _len; _i++) {
          c = circles[_i];
          c.circle.position = c.getNextLocation(delta);
          if (app.colorAnimation.isRunning()) {
            if (app.colorAnimation.isFirstStep()) {
              c.prepareColorAnimationTo(app.backgroundHue);
            }
            c.applyColorAnimationStep(app.colorAnimation.isLastStep());
          }
        }
        if (app.colorAnimation.isRunning()) {
          return app.colorAnimation.current++;
        }
      },
      progressBar: function() {
        circlesInstructions[circles.length]();
        progressBar.setProgress(circles.length * 100);
        if (progressBar.isFinished()) {
          return onFrameAnimationState = "removeProgressBar";
        }
      },
      removeProgressBar: function() {
        var c, _i, _len;
        this.circles();
        progressBar.expandVertically();
        for (_i = 0, _len = circles.length; _i < _len; _i++) {
          c = circles[_i];
          c.circle.opacity = 1 - progressBar.rectangle.opacity;
        }
        if (progressBar.isFullyExpanded()) {
          onFrameAnimationState = "circles";
          progressBar.destroy();
          return delete progressBar;
        }
      }
    };
    paper.view.onFrame = function(e) {
      return onFrameInstructions[onFrameAnimationState](e.delta);
    };
    if (!$('html').hasClass('touch')) {
      tool = new paper.Tool();
      tool.onMouseMove = function(e) {
        var c, hitResult, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = circles.length; _i < _len; _i++) {
          c = circles[_i];
          if (!c.listenToMouseRepulsion()) {
            continue;
          }
          hitResult = c.circle.hitTest(e.point, {
            tolerance: 50,
            fill: true,
            stroke: true
          });
          if (hitResult && hitResult.item) {
            _results.push(c.setMouseRepulsion(e.point));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };
    }
    $(window).resize(function(e) {
      var c, h, horizontalFactor, newSize, oldSize, verticalFactor, w, _i, _len;
      w = $(window).width();
      h = $(window).height();
      oldSize = [paper.view.viewSize.width, paper.view.viewSize.height];
      newSize = paper.view.viewSize = [w, h];
      horizontalFactor = newSize[0] / oldSize[0];
      verticalFactor = newSize[1] / oldSize[1];
      background.scale(horizontalFactor, verticalFactor, [0, 0]);
      for (_i = 0, _len = circles.length; _i < _len; _i++) {
        c = circles[_i];
        c.adjustToSize(horizontalFactor, verticalFactor);
      }
      if (typeof progressBar !== "undefined" && progressBar !== null) {
        return progressBar.adjustToSize(horizontalFactor, verticalFactor);
      }
    });
    return $(window).scroll(function(e) {
      var c, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = circles.length; _i < _len; _i++) {
        c = circles[_i];
        _results.push(c.setScrollOffset($(window).scrollTop()));
      }
      return _results;
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
