//= require_self

(function() {
  'use strict';

  $(document).ready(function(){
    $(document).on('mousemove', function(e){
      // console.log(e);

      var $logo = $('.hero__logo');

      var base = 180;

      var height = $(document).height();
      var width = $(document).width();
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

      var transformString = 'translateX(-50%) translateY(-50%) ';
// console.log(height / (logoDimensions.height - height));
      // transformString += 'translateZ(' + distanceFromMiddle.x * 0.5 + 'px) ';
      // transformString += 'translateZ(' + (distanceFromMiddle.x + distanceFromMiddle.y) * 0.2 + 'px) ';
      // transformString += 'translateZ(' + distanceFromMiddle.x + 'px) ';
      // transformString += 'rotateX(' + (e.clientY - middle.y) * 22.5 / middle.y + 'deg) ';
      // transformString += 'rotateY(' + (e.clientX - middle.x) * 22.5 / middle.x + 'deg) ';
      transformString += 'rotateX(' + ((e.clientY - middle.y) * 22.5 / middle.y) * (height / (logoDimensions.height - height)) + 'deg) ';
      transformString += 'rotateY(' + ((e.clientX - middle.x) * 22.5 / middle.x) * (width / (logoDimensions.width - width) * 0.1) + 'deg) ';


      $logo.css('transform', transformString);
    });
  });
})();
