var Selector = (function() {

  var selector; // the selector
  var coordinates = {
    x: 0,
    y: 0
  };

  var snapTo = function(x, y) {
    setupSwipeArea();
    coordinates.x = x;
    coordinates.y = y;
    var cell = $('td[data-x="' + x + '"][data-y="' + y + '"]');
    var borderWidth = 2;
    selector.animate({
      top: cell.offset().top - cell.offsetParent().offset().top + 'px',
      left: cell.offset().left - cell.offsetParent().offset().left + 'px',
      width: cell.outerWidth(),
      height: cell.outerHeight()
    }, 100, function() {
      //todo when complete
    });
  };
  $(window).on("resize", setupSwipeArea);
  var setupSwipeArea = function () {
    var trs = $("#board_body").find("tr");
    var height = $(trs[4]).offset().top - $(trs[1]).offset().top;
    var width = $(trs[4]).width();
    var top = $(trs[1]).offset().top;
    var left = $(trs[1]).offset().left;
    $("#swipeArea").css({
      height: height,
      width: width,
      top: top,
      left: left
    });
  }
  var resnap = function() {
    setupSwipeArea();
    var cell = $('td[data-x="' + coordinates.x + '"][data-y="' + coordinates.y + '"]');
    var borderWidth = 2;
    selector.animate({
      top: cell.offset().top - cell.offsetParent().offset().top + 'px',
      left: cell.offset().left - cell.offsetParent().offset().left + 'px',
      width: cell.outerWidth(),
      height: cell.outerHeight()
    }, 100, function() {
      //todo when complete
    });
    /*
    selector.css('top', $('td[data-x="' + coordinates.x + '"][data-y="' + coordinates.y + '"]').offset().top + 'px');
    selector.css('left', $('td[data-x="' + coordinates.x + '"][data-y="' + coordinates.y + '"]').offset().left + 'px');
    */
  };

  var fadeIn = function() {
    selector.fadeIn(options.fade);
  };

  var fadeOut = function() {
    selector.fadeOut(options.fade);
  };

  var quickHide = function() {
    selector.hide();
  };

  var quickShow = function() {
    selector.show();
  };

  var domReady = function() {
    selector = $("#selector");
  };

  return {
    snapTo: snapTo,
    resnap: resnap,
    fadeIn: fadeIn,
    fadeOut: fadeOut,
    quickHide: quickHide,
    quickShow: quickShow,
    domReady: domReady
  };
}());

// Add the mediator to the module
mediator.installTo(Selector);

Selector.subscribe('selector_snap_to', Selector.snapTo);
Selector.subscribe('window_resized', Selector.resnap);
Selector.subscribe('board_faded_in', Selector.fadeIn);
Selector.subscribe('board_fade_out', Selector.fadeOut);

Selector.subscribe('loader_dom_ready', Selector.domReady);
