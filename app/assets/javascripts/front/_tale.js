//= require intersection-observer/intersection-observer
//= require_self

(function(){
  'use strict';

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
    "text": "over"
  }];

  // CLASS
  var Tale = (function(){
    // Constructor
    function Tale($element, settings){
      var _ = this;

      _.settings = $.extend(true, {
        data: [],
      }, settings || {});

      _.elements = {};
      _.elements.$root = $element;
      _.elements.$audio = _.elements.$root.find('.c-tale__audio');
      _.elements.$caption = _.elements.$root.find('.c-tale__caption');

      _.track = _.elements.$audio.get(0);

      _.elements.$root.data('tale', _);

      _.init();
    }

    // Methods
    Tale.prototype.init = function(){
      var _ = this;

      _.createCaption();

      _.elements.$audio
        .on('playing', $.proxy(_.playback, _))
        .on('seeked tale:textupdate', $.proxy(_.displayCurrentTexts, _));
    };

    Tale.prototype.createCaption = function(){
      var _ = this;
      var captionString = '';

      _.settings.data.forEach(function(text){
        if(text.text && text.start && text.end){
          captionString += '<span class="c-tale__text" data-start="' + text.start + '" data-end="' + text.end + '">' + text.text + '</span> ';
        } else {
          console.log('Data is missing : ', text);
        }
      });

      _.elements.$caption.html($(captionString));
    };

    Tale.prototype.getCurrentTexts = function(){
      var _ = this;

      return _.elements.$caption
                .find('.c-tale__text')
                .toArray()
                .filter(function(text){
                  return $(text).data('start') <= _.track.currentTime;
                });

    };

    Tale.prototype.getNextText = function(){
      var _ = this;
      var currentTexts = _.getCurrentTexts();

      return _.elements.$caption
                .find('.c-tale__text')
                .get(currentTexts.length);
    };

    Tale.prototype.displayCurrentTexts = function(){
      var _ = this;
      var currentTexts = _.getCurrentTexts();

      var textsToDisplay = _.elements.$caption.find('.c-tale__text:not(.is-display)')
        .toArray()
        .filter(function(text){ return $(text).data('start') <= _.track.currentTime; });

      var textsToHide = _.elements.$caption.find('.c-tale__text.is-display')
        .toArray()
        .filter(function(text){ return $(text).data('start') > _.track.currentTime; });

      $(textsToDisplay).addClass('is-display');
      $(textsToHide).removeClass('is-display');
    };

    Tale.prototype.playback = function(){
      var _ = this;
      var timeoutId;
      var nextText = _.getNextText();

      if(_.track.paused){
        clearTimeout(timeoutId);
      }

      if(nextText && !_.track.paused){
        var secondsUntilNextText = $(nextText).data('start') - _.track.currentTime;

        if(typeof _.track === 'number' && !isNaN(_.track)){
          secondsUntilNextText *= 1.0 / _.track.playbackRate;
        }

        clearTimeout(timeoutId);

        timeoutId = setTimeout(function(){
          _.elements.$audio.trigger('tale:textupdate');
          _.playback();
        }, Math.max(secondsUntilNextText * 1000, 0));
      }
    };

    Tale.prototype.getTrack = function(){
      var _ = this;

      return _.track;
    }

    return Tale;
  })();

  // SCRIPTS
  $(document)
    .ready(function(){ init(); })
    .on('turbolinks:load', function(e){ if(e.originalEvent.data.timing.visitStart) init(); });

  function init(){
    var $tales = $('.js-tale');

    if($tales.length){
      var observer = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          var track = $(entry.target).data('tale').getTrack();
          if(entry.isIntersecting){
            if(entry.isIntersecting && track.currentTime !== track.duration)
              track.play();
          } else {
            track.pause();
          }
        });
      }, { threshold: 0.8 });

      $tales.each(function(){
        var element = this;
        var tale = new Tale($(element), {data: syncData});

        observer.observe(element);

        $(tale.getTrack()).on('ended', function(){
          observer.unobserve(element);
        });
      });
    }
  }

})();
