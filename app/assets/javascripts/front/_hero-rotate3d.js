//= require_self

(function() {
  'use strict';

  $(document).ready(function(){

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      console.log("We respect you 😉");
    } else {

      var $hero = $('.c-hero');

      $hero.find('.c-hero__logo, .c-hero__echo').hide();

      if($hero.length){

        var perform = false;

        // Initial animation
        $hero.find('.c-hero__logo').show()
          .addClass('is-animate')
          .on('animationend', function(){
            $hero.find('.c-hero__echo').show()
              .addClass('is-animate');
            });

        var $logo = $('.c-hero__logo');

        var base = 180;

        var height; // Hero's height
        var width; // Hero's width
        var middle; // Section's middle [x, y]

        // Keep global variables up to date
        function watchDimensions(){
          height = $hero.height();
          width = $hero.width();
          middle = { x: width/2, y: height/2 };
        }

        watchDimensions();
        $(window).resize($.throttle(250, watchDimensions));

        // Check if section is in the viewport and so if we need to perform the animation
        function watchPosition(){
          perform = $(window).scrollTop() >= $hero.offset().top + height ? false : true;
        }

        watchPosition();
        $(window).scroll($.throttle(250, watchPosition));
        $(window).resize($.throttle(250, watchPosition));

        // Animate
        function updateTransform(e){
          var transformString = 'translate(-50%, -50%) ';

          var cx = middle.x,
              cy = middle.y,
              dx = cx - e.clientX,
              dy = cy - e.clientY,
              tiltx = (dy / cy),
              tilty = - (dx / cx),
              radius = Math.sqrt(Math.pow(tiltx, 2) + Math.pow(tilty, 2)),
              degree = (radius * 1);

          transformString += 'translateZ(' + radius * 10 + 'px) ';
          transformString += 'rotate3d(' + tiltx + ', ' + tilty + ', ' + '0' + ', ' + degree + 'deg)';

          $logo.css('transform', transformString);
        }

        $(window).on('mousemove', function(e){
          window.requestAnimationFrame(function(){
            updateTransform(e);
          });
        });

      }
    }



  });

})();
