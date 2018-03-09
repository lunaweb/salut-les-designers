//= require_self

/**
 * FOOTER
 ********************************* */

(function(){
  'use strict';

  $(document).ready(function(){

    var $footer = $('.footer');

    if($footer.length){

      var ticking = false;

      var spyTopBottom = function spyTopBottom() {
        var offset = 20;
        var top = $(window).scrollTop();
        var bottom = top + window.innerHeight;

        if(top <= offset || bottom >= $(document).height() - offset){
          $footer.removeClass('is-hide');
        } else {
          $footer.addClass('is-hide');
        }
      }

      spyTopBottom();
      $(window).on('scroll', function(e) {
        if (!ticking) {
          window.requestAnimationFrame(function() {
            spyTopBottom();
            ticking = false;
          });
        }
        ticking = true;
      });

    }

  });

})();
