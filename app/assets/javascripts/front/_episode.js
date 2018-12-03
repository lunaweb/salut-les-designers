//= require_self

(function(){
  'use strict';

  // CLASS
  var Episode = (function(){
    // Constructor
    function Episode($element, settings){
      var _ = this;

      _.settings = $.extend(true, {
        textClones: 4,
      }, settings || {});

      _.elements = {};
      _.elements.$root = $element;
      _.elements.$title = _.elements.$root.find('.c-episode__title');
      _.elements.$texts = null;

      _.init();
    }

    // Methods
    Episode.prototype.init = function(){
      var _ = this;

      _.elements.$texts = _.elements.$title;

      // Fit Title
      _.fitTexts();

      // Duplicate Title
      for(var i=0; i<4; i++){
        var $clone = _.elements.$title.clone();
        _.elements.$title.after($clone);
        _.elements.$texts = _.elements.$texts.add($clone);
      }

      $(window).resize($.throttle(250, function(){
        _.fitTexts();
      }));
    };

    Episode.prototype.fitTexts = function(){
      var _ = this;

      _.elements.$texts.css('white-space', 'nowrap');
      _.elements.$texts.each(function(){
        var $text = $(this);
        var $clone = $text.clone().css({ position: 'absolute', top: '-9999px', left: '-9999px', visibility: 'hidden' }).appendTo($text.parent());
        var $reference = $($text.data('fit-to'));
        var referenceWidth = $reference.width();
        var size = parseInt($text.css('font-size'));

        var newSize = size  * (referenceWidth / $clone.width());
        $text.css('font-size', Math.floor(newSize) + 'px');

        $clone.remove();
      });
    };

    return Episode;
  })();

  // SCRIPTS
  $(document)
    .ready(function(){ init(true); })
    .on('turbolinks:load', function(e){ if(e.originalEvent.data.timing.visitStart) init(); });

  function init(listenLoad){
    var $episode = $('.c-episode');

    if($episode.length){
      var episode = new Episode($episode);

      // Hide Content
      episode.elements.$root.addClass('animate-pending');

      // Reveal content
      if(listenLoad === true){
        $(window).on('load', function(){
          revealEpisode(episode);
        });
      } else {
        revealEpisode(episode);
      }
    }
  }

  function revealEpisode(episode){
    episode.fitTexts();
    episode.elements.$root.addClass('animate-running');
  }

})();
