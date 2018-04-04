//= require intersection-observer/intersection-observer
//= require_self

/**
 * LOGO MOMENTUM
 * Based on https://codepen.io/nathantaylor/pen/NvOeQr
 ********************************* */

(function(){
  'use strict';

  $(document).ready(function(){

    var syncData = [{
      "end": "0.225",
      "start": "0.125",
      "text": "There"
    }, {
      "end": "0.485",
      "start": "0.225",
      "text": "were"
    }, {
      "end": "1.085",
      "start": "0.485",
      "text": "10 in"
    }, {
      "end": "1.325",
      "start": "1.085",
      "text": "his"
    }, {
      "end": "1.685",
      "start": "1.325",
      "text": "bed"
    }, {
      "end": "1.965",
      "start": "1.685",
      "text": "and the"
    }, {
      "end": "2.245",
      "start": "1.965",
      "text": "little"
    }, {
      "end": "2.565",
      "start": "2.245",
      "text": "one"
    }, {
      "end": "2.985",
      "start": "2.565",
      "text": "said"
    }, {
      "end": "3.485",
      "start": "2.985",
      "text": "Roll"
    }, {
      "end": "3.965",
      "start": "3.485",
      "text": "over!"
    }, {
      "end": "4.805",
      "start": "3.965",
      "text": "Roll"
    }, {
      "end": "5.405",
      "start": "4.805",
      "text": "over"}];

    var $tales = $('.js-tale');

    if($tales.length){
      // Intersection Observer
      var observer = new IntersectionObserver(callback, { threshold: 0.8 });

      function callback(entries, observer){
        entries.forEach(function(entry){
          var audio = $(entry.target).find('.c-tale__audio').get(0);
          console.log(audio.paused);
          if(entry.isIntersecting && audio.currentTime !== audio.duration)
            audio.play();
        });
      }

      // Init
      $tales.each(function(){
        var $audio = $(this).find('.c-tale__audio');
        var audioElement = $audio.get(0);
        var $caption = $(this).find('.c-tale__caption');

        createCaption(syncData, $caption);

        $audio
          .on('playing', function(){
            playback($caption, audioElement);
          })
          .on('seeked textupdate', {$container: $caption}, displayCurrentTexts);

        observer.observe(this);
      });

      // Functions
      function createCaption(data, $container){
        var captionString = '';

        data.forEach(function(text, index){
          captionString += '<span class="c-tale__text" data-start="' + text.start + '" data-end="' + text.end + '">' + text.text + '</span> ';
        });

        $container.html($(captionString));
      }

      function getCurrentTexts($container, audio){
        return $container.find('.c-tale__text')
            .toArray()
            .filter(function(text){ return $(text).data('start') <= audio.currentTime; });
      }

      function getNextText($container, audio){
        var currentTexts = getCurrentTexts($container, audio);
        return $container.find('.c-tale__text').get(currentTexts.length);
      }

      function displayCurrentTexts(e){
        var audio = e.currentTarget;

        var textsToDisplay = e.data.$container.find('.c-tale__text:not(.is-display)')
          .toArray()
          .filter(function(text){ return $(text).data('start') <= audio.currentTime; });

        var textsToHide = e.data.$container.find('.c-tale__text.is-display')
          .toArray()
          .filter(function(text){ return $(text).data('start') > audio.currentTime; });

        $(textsToDisplay).addClass('is-display');
        $(textsToHide).removeClass('is-display');
      }

      function playback($caption, audioElement){
        var timeoutId;
        var nextText = getNextText($caption, audioElement);

        if(audioElement.paused){
          clearTimeout(timeoutId);
        }

        if(nextText && !audioElement.paused){
          var secondsUntilNextText = $(nextText).data('start') - audioElement.currentTime;

          if(typeof audioElement === 'number' && !isNaN(audioElement)){
            secondsUntilNextText *= 1.0 / audioElement.playbackRate;
          }

          clearTimeout(timeoutId);

          timeoutId = setTimeout(function(){
            $(audioElement).trigger('textupdate');
            playback($caption, audioElement);
          }, Math.max(secondsUntilNextText * 1000, 0));
        }
      }

    }
  });

})();
