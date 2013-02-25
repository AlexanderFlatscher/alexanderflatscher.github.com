(function() {
  var LissajousCircle;

  LissajousCircle = (function() {

    function LissajousCircle(paper, radius, color, wx, wy, omega, t, speed) {
      var num, path_string, _i, _ref;
      this.paper = paper;
      this.wx = wx;
      this.wy = wy;
      this.omega = omega;
      this.t = t != null ? t : 0;
      this.speed = speed != null ? speed : 0.001;
      path_string = "M";
      for (num = _i = 0, _ref = 2 * Math.PI; 0 <= _ref ? _i < _ref : _i > _ref; num = _i += 0.01) {
        path_string += (Math.sin(this.wx * num + this.omega) + 1) * this.paper.width / 2 + "," + (Math.sin(this.wy * num + this.omega) + 1) * this.paper.height / 2;
        if (num === -1) {
          path_string += "L";
        } else {
          path_string += " ";
        }
      }
      path_string += "z";
      this.path = this.paper.path(path_string);
      this.circle = this.paper.circle(0, 0, radius).attr({
        fill: color,
        stroke: color,
        "fill-opacity": 0.5,
        "stroke-width": 0,
        animationPath: this.path,
        alongAnimationPath: 0
      });
      /*@glow = @circle.glow
        color: color
        opacity: 0.5
        fill: color
      */

      this.circle.animate({
        alongAnimationPath: 1
      }, 2e5);
    }

    return LissajousCircle;

  })();

  $(function() {
    var bg, circles, paper;
    bg = $('#bg-raphael');
    bg.css({
      width: $(window).width() / 2,
      height: $(window).height()
    });
    paper = Raphael(bg[0], $(window).width() / 2, $(window).height());
    paper.customAttributes.animationPath = function() {};
    paper.customAttributes.alongAnimationPath = function(v) {
      var path, point, r;
      path = this.attrs.animationPath;
      point = path.getPointAtLength(v * path.getTotalLength());
      return r = {
        transform: "t" + [point.x, point.y] + "r" + point.alpha
      };
    };
    return circles = [new LissajousCircle(paper, 200, "#00AAFF", 3, 1, 1 / 2 * Math.PI), new LissajousCircle(paper, 400, "#AAFF00", 4, 3, 1 / 3 * 1 / 4 * Math.PI), new LissajousCircle(paper, 200, "#FFAA00", 1, 4, 1 / 2 * 1 / 3 * Math.PI), new LissajousCircle(paper, 300, "#AA00FF", 3, 4, 1 / 3 * 3 / 4 * Math.PI), new LissajousCircle(paper, 100, "#FF00AA", 2, 1, Math.PI)];
    /*
      circles = [
        new LissajousCircle(paper, 100, "#FF00AA", 2, 1, Math.PI)
      ]
    */

  });

}).call(this);
