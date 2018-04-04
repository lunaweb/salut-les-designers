//= require_self

/**
 * LOGO MOMENTUM
 * Based on https://codepen.io/nathantaylor/pen/NvOeQr
 ********************************* */

(function(){
  'use strict';

  $(document).ready(function(){

    var $logo = $('.js-logo');

    if($logo.length){
      var scrollTop = $(window).scrollTop();

      // Momentum
      var lagAmount = 50;
      var maxSpeed = 100;
      var frameRate = 20;

      var logoTop = 0;
      var lastTime = void 0;

      var updateLogoPosition = function updateLogoPosition(time){
        if(!lastTime) lastTime = time;

        var delta = time - lastTime;

        if(delta >= frameRate){
          scrollTop = $(window).scrollTop();

          var move = (scrollTop - logoTop) * delta / (lagAmount + delta);
          var direction = move === 0 ? 0 : move / Math.abs(move);

          logoTop = logoTop + Math.min(Math.abs(move), maxSpeed) * direction;
          $logo.css('transform', 'translateY(' + -move + 'px)');
          lastTime = time;
        }

        window.requestAnimationFrame(updateLogoPosition);
      }

      window.requestAnimationFrame(updateLogoPosition);

      // Hero section exclusion
      var $hero = $('.c-hero');

      if($hero.length){
        var ticking = false;

        var spyHeroBottom = function spyHeroBottom() {
          var heroBottom = $hero.position().top + $hero.height();

          if(heroBottom <= scrollTop){
            $logo.addClass('is-display');
          } else {
            $logo.removeClass('is-display');
          }
        }

        spyHeroBottom();
        $(window).on('scroll', function(e) {
          if (!ticking) {
            window.requestAnimationFrame(function() {
              spyHeroBottom();
              ticking = false;
            });
          }
          ticking = true;
        });
      } else {
        $logo.addClass('is-display');
      }

    }

  });

})();
