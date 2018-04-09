//= require_self

(function(){
  'use strict';

  $(window).on('load', function(){

    var $texts = $('.js-text-fit-width');

    if($texts.length){
      $texts.css('white-space', 'nowrap');

      fit();
      $(window).resize($.throttle(250, fit));

      function fit(){
        $texts.each(function(){
          var $text = $(this);
          var $clone = $text.clone().css({ position: 'absolute', top: '-9999px', left: '-9999px', visibility: 'hidden' }).appendTo($text.parent());
          var $reference = $($(this).data('fit-to'));
          var referenceWidth = $reference.width();
          var size = parseInt($text.css('font-size'));

          var newSize = size  * (referenceWidth / $clone.width());
          $text.css('font-size', Math.floor(newSize) + 'px');

          // if($clone.width() > referenceWidth){
          //   console.log('decrease');
          //   // decrease
          //   while($clone.width() > referenceWidth){
          //     $clone.css('font-size', size-- + 'px');
          //   }

          //   $text.css('font-size', (size + 2) + 'px');
          // }

          // if($clone.width() < referenceWidth){
          //   console.log('increase');
          //   // increase
          //   while($clone.width() < referenceWidth){
          //     $clone.css('font-size', size++ + 'px');
          //   }

          //   $text.css('font-size', (size - 2) + 'px');
          // }
          // console.log($clone.width());
          // setTimeout(function(){ console.log($clone.width()); }, 500);

          $clone.remove();
        });
      }
    }

  });

})();
