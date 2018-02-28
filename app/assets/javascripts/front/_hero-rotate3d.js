//= require_self

(function() {
  'use strict';

  $(document).ready(function(){

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      console.log("We respect you 😉");
    } else {
      $(document).on('mousemove', function(e){

        var $logo = $('.hero__logo');

        var base = 180;

        var height = $('.hero').height();
        var width = $('.hero').width();
        var middle = { x: width/2, y: height/2 };
        var distanceFromMiddle = { x: e.clientX - middle.x, y: e.clientY - middle.y, directionX: 'right', directionY: 'bottom' };

        var logoDimensions = { width: $logo.width(), height: $logo.height() };

        if(distanceFromMiddle.x == 0) {
          distanceFromMiddle.directionX = 'center';
        } else if(distanceFromMiddle.x < 0) {
          distanceFromMiddle.x = distanceFromMiddle.x * -1;
          distanceFromMiddle.directionX = 'left';
        }

        if(distanceFromMiddle.y == 0) {
          distanceFromMiddle.directionX = 'center';
        } else if(distanceFromMiddle.y < 0) {
          distanceFromMiddle.y = distanceFromMiddle.y * -1;
          distanceFromMiddle.directionXY= 'top';
        }

        var transformString = 'translate(-50%, -50%) ';


        var cx = middle.x,
            cy = middle.y,
            dx = cx - e.clientX,
            dy = cy - e.clientY,
            tiltx = (dy / cy),
            tilty = - (dx / cx),
            radius = Math.sqrt(Math.pow(tiltx, 2) + Math.pow(tilty, 2)),
            degree = (radius * 1);

        // transformString += 'rotate3d(' + ((e.clientX / width) * 2 - 1) + ', ' + (- (e.clientY / height) * 2 + 1) + ', ' + '0.5' + ', ' + (Math.sqrt(Math.pow(e.client))) + ')';
        transformString += 'translateZ(' + radius * 10 + 'px) ';
        transformString += 'rotate3d(' + tiltx + ', ' + tilty + ', ' + '0' + ', ' + degree + 'deg)';

        $logo.css('transform', transformString);


      });
    }



  });

})();
