//= require_self

(function(){
  'use strict';

  $(document).ready(function(){

    if (window.CSS && CSS.supports('top', 'var(--mouse-y)') && $('html').hasClass('no-touchevents')) {

      var $cursor = $('<div class="cursor"><div class="cursor__tick"></div></div>');

      $('html').addClass('enhanced-cursor');
      $('body').append($cursor);

      $(window).on('mousemove', function(e){
        $cursor.attr('style', '--mouse-x: ' + e.clientX + 'px; --mouse-y: ' + e.clientY + 'px;');
      });

      $('.js-cursor-vanish').on('mouseenter', function(){
        $cursor.addClass('is-hovering');
      }).on('mouseout', function(){
        $cursor.removeClass('is-hovering');
      });

      $(document)
        .delegate('a, button', 'mouseenter', function(){
          $cursor.removeClass('is-ticking');
          $cursor.addClass('is-hovering');
        })
        .delegate('a, button', 'mouseleave', function(){
          $cursor.removeClass('is-hovering');
        })
        .delegate('a, button', 'mouseup', function(){
          $cursor.addClass('is-ticking');
        });

    }

  });

})();
