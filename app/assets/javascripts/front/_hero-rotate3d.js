//= require_self

(function() {
  'use strict';

  $(document).ready(function(){

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // User has ask to reduce the number of animations
    } else {

      var $hero = $('.c-hero');

      $hero.find('.c-hero__logo, .c-hero__echo').hide();

      if($hero.length){

        var perform = true;

        // Initial animation
        $hero.find('.c-hero__logo').show()
          .addClass('is-animate')
          .on('animationend', function(){
            $hero.find('.c-hero__echo').show()
              .addClass('is-animate');
            });

        var $logo = $('.c-hero__logo');

        var height; // Hero's height
        var width; // Hero's width
        var cx, cy; // Section's center
        var moveType;
        var initialOrientation;

        // Keep global variables up to date
        function watchDimensions(){
          height = $hero.height();
          width = $hero.width();
          cx = width/2;
          cy = height/2;
        }

        watchDimensions();
        $(window).resize($.throttle(250, watchDimensions));

        // Check if section is in the viewport and so if we need to perform the animation
        function watchPosition(){
          perform = $(window).scrollTop() >= $hero.offset().top + height ? false : true;

          // Set height to prevent overflow on mobile screen (due to the way mobile browsers handle viewport and address bar)
          $hero.height($(window).height());
        }

        watchPosition();
        $(window).scroll($.throttle(250, watchPosition));
        $(window).resize($.throttle(250, watchPosition));

        // Animate
        function updateTransform(e){
          var transformString = 'translate(-50%, -50%) ';

          var dx, dy, dz;
          var tiltx, tilty;

          if(moveType === 'mouse'){
            dx = cx - e.clientX;
            dy = cy - e.clientY;

            var tiltx = (dy / cy);
            var tilty = - (dx / cx);
          }

          if(moveType === 'orientation'){
            var dx = (e.originalEvent.alpha - initialOrientation.alpha) * 0.1;
            var dy = (e.originalEvent.beta - initialOrientation.beta) * 0.1;
            var dz = (e.originalEvent.gamma - initialOrientation.gamma) * 0.1;

            if(dx < -5)
              dx = -5;
            if(dx > 5)
              dx = 5;

            if(dy < -5)
              dy = -5;
            if(dy > 5)
              dy = 5;

            if(dz < -5)
              dz = -5;
            if(dz > 5)
              dz = 5;

            var tiltx = dy;
            var tilty = - (( e.originalEvent.beta / 90) * dx) + ((1 - (e.originalEvent.beta - 90) / 90) * dz);
          }

          var radius = Math.sqrt(Math.pow(tiltx, 2) + Math.pow(tilty, 2));
          var degree = (radius * 1);

          if(moveType === 'mouse')
            transformString += 'translateZ(' + radius * 10 + 'px) ';

          transformString += 'rotate3d(' + tiltx + ', ' + tilty + ', ' + '0' + ', ' + degree + 'deg)';

          $logo.css('transform', transformString);
        }

        // Move with
        if(window.DeviceOrientationEvent && Modernizr.touchevents){
          moveType = 'orientation';

          $(window).on('deviceorientation', function(e){
            if(perform){
              if(!initialOrientation){
                initialOrientation = {
                  alpha: e.originalEvent.alpha,
                  beta: e.originalEvent.beta,
                  gamma: e.originalEvent.gamma
                }
              }

              window.requestAnimationFrame(function(){
                updateTransform(e);
              });
            }
          });
        } else {
          moveType = 'mouse';

          $(window).on('mousemove', function(e){
            if(perform){
              window.requestAnimationFrame(function(){
                updateTransform(e);
              });
            }
          });
        }

      }
    }



  });

})();
