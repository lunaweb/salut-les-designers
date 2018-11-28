//= require_self

(function(){
  'use strict';

  $(document).ready(function(){

    var $episodes = $('.c-episode');

    if($episodes.length){

      $episodes.each(function(){
        var $episode = $(this);
        var $title = $episode.find('.c-episode__title');
        var $textsToFit = $title;

        // Hide content
        $episode.addClass('animate-pending');

        // Fit Title
        fitTexts($textsToFit);

        // Duplicate Title
        for(var i=0; i<4; i++){
          var $clone = $title.clone();
          $title.after($clone);
          $textsToFit = $textsToFit.add($clone);
        }

        $(window).resize($.throttle(250, function(){
          fitTexts($textsToFit);
        }));

        $(window).on('load', function(){
          fitTexts($textsToFit);

          $episode.addClass('animate-running');
        });
      });

      function fitTexts($texts){
        $texts.css('white-space', 'nowrap');
        $texts.each(function(){
          var $text = $(this);
          var $clone = $text.clone().css({ position: 'absolute', top: '-9999px', left: '-9999px', visibility: 'hidden' }).appendTo($text.parent());
          var $reference = $($(this).data('fit-to'));
          var referenceWidth = $reference.width();
          var size = parseInt($text.css('font-size'));

          var newSize = size  * (referenceWidth / $clone.width());
          $text.css('font-size', Math.floor(newSize) + 'px');

          $clone.remove();
        });
      }

    }

  });

})();
