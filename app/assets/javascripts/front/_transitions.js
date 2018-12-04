//= require_self

(function(){
  'use strict';

  // CLASS
  var Looney = (function(){
    // Constructor
    function Looney(settings){
      var _ = this;

      _.settings = $.extend(true, {
        circles: 6
      }, settings || {});

      _.elements = {};

      _.init();
    }

    // Methods
    Looney.prototype.init = function(){
      var _ = this;

      _.createCircles();
    };

    Looney.prototype.createCircles = function(){
      var _ = this;

      _.elements.$root = $('<div class="c-looney"></div>');


      var circles = '';

      for(var i=0; i<_.settings.circles; i++){
        circles += '<div class="c-looney__circle"></div>'
      }

      _.elements.$circles = $(circles);
      _.elements.$root.append(_.elements.$circles);

      _.sizeCircles();

      Front.getPermanentRoot().append(_.elements.$root);
    };

    Looney.prototype.sizeCircles = function(){
      var _ = this;

      var diameter = Math.sqrt( Math.pow(parseInt($(window).width()), 2) + Math.pow(parseInt($(window).height()), 2) );

      _.elements.$root.width(diameter);
    };

    Looney.prototype.introducing = function(callback){
      var _ = this;

      _.elements.$root.addClass('is-intro');
      _.elements.$circles.filter(':last-child').one('animationend', function(){
        _.elements.$root.removeClass('is-intro').addClass('is-pending');
        callback();
      });
    };

    Looney.prototype.outroducing = function(){
      var _ = this;

      _.elements.$root.addClass('is-outro');

      _.elements.$circles.filter(':first-child').one('animationend', function(){
        _.elements.$root.removeClass('is-pending is-outro');
      });
    };

    return Looney;
  })();

  // SCRIPTS
  var transitioning = false;
  var looney = null;

  $(document).on('turbolinks:before-visit', function(e){
    if(!transitioning){
      e.preventDefault();

      transitioning = true;

      if(looney === null)
        looney = new Looney();

      looney.introducing(function(){
        Turbolinks.visit(e.originalEvent.data.url);
      });
    }
  });

  $(document).on('turbolinks:load', function(e){
    if(transitioning){
      if(looney !== null)
        looney.outroducing();
    }

    transitioning = false;
  });

})();
