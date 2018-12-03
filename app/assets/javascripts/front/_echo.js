//= require_self

(function() {
  'use strict';

  // CLASS
  var Echo = (function(){
    // Constructor
    function Echo($element, settings){
      var _ = this;

      _.settings = $.extend(true, {
        teaser: null,
      }, settings || {});

      _.elements = {};
      _.elements.$root = $element;
      _.elements.$audio = _.elements.$root.find('audio');

      _.track = _.elements.$audio.get(0);

      _.init();
    }

    // Methods
    Echo.prototype.init = function(){
      var _ = this;

      _.elements.$root
        .on('mouseenter focus', function(){
          if(!_.elements.$audio.length){
            _.createAudio();
          }

          if(_.track.paused){
            _.track.play();
          }
        })
        .on('mouseleave blur', function(){
          _.track.pause();
        });
    };

    Echo.prototype.createAudio = function(){
      var _ = this;

      _.elements.$audio = $('<audio class="c-echo__audio" loop><source src="' + _.settings.teaser + '" type="audio/' + _.settings.teaser.substr(-3) + '"/></audio>');
      _.elements.$root.append(_.elements.$audio);
      _.track = _.elements.$audio.get(0);
    };

    return Echo;
  })();

  // SCRIPTS
  $(document)
    .ready(function(){ init(); })
    .on('turbolinks:load', function(e){ if(e.originalEvent.data.timing.visitStart) init(); });

  function init(){
    var $echoes = $('.c-echo[data-teaser]');

    if($echoes.length){
      $echoes.each(function(){
        var echo = new Echo($(this), {
          teaser: $(this).data('teaser'),
        });

        $(window).on('blur', function(){
          if(echo.track && !echo.track.paused){
            echo.track.pause();
          }
        });
      });
    }
  }

})();
