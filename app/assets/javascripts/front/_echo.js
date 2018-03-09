//= require_self

(function() {
  'use strict';

  $(document).ready(function(){

    var $echoes = $('.c-echo[data-teaser]');
    var $currentEcho;

    if($echoes.length){

      $echoes.each(function(){
        var $echo = $(this);
        var $audio = $echo.find('audio');
        var audioElement = $audio.get(0);

        $echo.on('mouseenter focus', function(){
          // Create audio
          if(!$audio.length) {
            var teaser = $echo.data('teaser');
            $audio = $('<audio class="c-echo__audio" loop><source src="' + teaser + '" type="audio/' + teaser.substr(-3) + '"/></audio>')
            $echo.append($audio);
            audioElement = $audio.get(0);
          }

          // Play
          if(audioElement.paused){
            audioElement.play();
            $currentEcho = $echo;
          }
        }).on('mouseleave blur', function(){
          audioElement.pause();
          $currentEcho = false;
        });
      });

      // When user change browser tab, eg : when cliking on link
      $(window).on('blur', function(){
        if($currentEcho){
          $currentEcho.find('audio').get(0).pause();
        }
      });

    }

  });

})();
