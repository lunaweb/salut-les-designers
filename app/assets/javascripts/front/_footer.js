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
        var top = $(window).scrollTop();
        var bottom = $(document).height();

        if(top === 0 || bottom === top + $(window).height()){
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
