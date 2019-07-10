/**
 * LOGO MOMENTUM
 * Based on https://codepen.io/nathantaylor/pen/NvOeQr
 ********************************* */

(function(){

  // CLASS
  var Logo = (function(){
    // Constructor
    function Logo($element, settings){
      var _ = this;

      _.settings = $.extend(true, {
        momentum: {
          lagAmount: 50,
          maxSpeed: 100,
          frameRate: 20,
        },
      }, settings || {});

      _.elements = {
        $logo: $element,
      };

      _.lastTime = void 0;
      _.position = 0;

      _.init();
    }

    // Methods
    Logo.prototype.init = function(){
      var _ = this;
      // _.elements.$logo.addClass('is-display');
      window.requestAnimationFrame($.proxy(_.updatePosition, _));
    }

    Logo.prototype.updatePosition = function(time){
      var _ = this;

      if(!_.lastTime) _.lastTime = time;

      var delta = time - _.lastTime;

      if(delta >= _.settings.momentum.frameRate){
        var scrollTop = $(window).scrollTop();

        var move = (scrollTop - _.position) * delta / (_.settings.momentum.lagAmount + delta);
        var direction = move === 0 ? 0 : move / Math.abs(move);

        _.position = _.position + Math.min(Math.abs(move), _.settings.momentum.maxSpeed) * direction;
        _.elements.$logo.css('transform', 'translateY(' + -move + 'px)');
        _.lastTime = time;
      }

      window.requestAnimationFrame($.proxy(_.updatePosition, _));
    };

    return Logo;
  })();

  // SCRIPTS
  $(document).ready(function(){
    var $logo = $('.js-logo');
    if($logo.length && !Front.reduceMotion) new Logo($logo);
  });

})();
