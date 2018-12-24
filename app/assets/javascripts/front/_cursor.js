//= require_self

(function(){
  'use strict';

  $(document).ready(function(){
    if (window.CSS && CSS.supports('top', 'var(--mouse-y)') && $('html').hasClass('no-touchevents')) {
      Cursor.init();
    }
  });

  var Cursor = {
    elements: {
      $cursor: false,
    },

    init: function(){
      var _ = this;

      _.elements.$cursor = $('<div class="cursor" id="cursor"><div class="cursor__tick"></div></div>');

      $('html').addClass('enhanced-cursor');
      Front.getPermanentRoot().append(_.elements.$cursor);

      $(window).on('mousemove', function(e){
        _.elements.$cursor.attr('style', '--mouse-x: ' + e.clientX + 'px; --mouse-y: ' + e.clientY + 'px;');
      });

      $('.js-cursor-vanish').on('mouseenter', function(){
        _.elements.$cursor.addClass('is-a-rogue');
      }).on('mouseout', function(){
        _.elements.$cursor.removeClass('is-a-rogue');
      });

      $(document)
        .delegate('a, button', 'mouseenter', function(){
          _.elements.$cursor.removeClass('is-ticking');
          _.elements.$cursor.addClass('is-hovering');
        })
        .delegate('a, button', 'mouseleave', function(){
          _.elements.$cursor.removeClass('is-hovering');
        })
        .delegate('a, button', 'mouseup', function(){
          _.elements.$cursor.addClass('is-ticking');
        });
    }
  };

})();
