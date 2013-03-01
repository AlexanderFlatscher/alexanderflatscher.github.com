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
