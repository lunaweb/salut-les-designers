//=require intersection-observer/intersection-observer.js

(function() {

  // CLASS
  var Hero = (function(){
    // Constructor
    function Hero($element, settings){
      var _ = this;

      _.settings = $.extend(true, {

      }, settings || {});

      _.elements = {};
      _.elements.$root = $element;
      _.elements.$logo = _.elements.$root.find('.c-hero__logo');
      _.elements.$echo = _.elements.$root.find('.c-hero__echo');

      _.performTransformation = true;
      _.width = 0; // Hero's width
      _.height = 0; // Hero's height
      _.cx = 0; // Section's center
      _.cy = 0;
      _.moveBy = '';
      _.initialOrientation = {};

      _.init();
    }

    // Methods
    Hero.prototype.init = function(){
      var _ = this;

      // Keep global variables up to date
      _.updateDimensions();
      $(window).resize($.throttle(250, $.proxy(_.updateDimensions, _)));

      // Check if section is in the viewport and so if we need to perform the animation
      var observer = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            _.performTransformation = true;
          } else {
            _.performTransformation = false;
          }
        });
      }, { rootMargin: '0px 0px 0px 0px', threshold: 0 });
      observer.observe(_.elements.$root.get(0));

      // Check on what logic do we transforming the logo
      if(window.DeviceOrientationEvent && Modernizr.touchevents){
        _.moveBy = 'orientation';

        $(window).on('deviceorientation', function(e){
          if(_.performTransformation){
            if(!_.initialOrientation){
              _.initialOrientation = {
                alpha: e.originalEvent.alpha,
                beta: e.originalEvent.beta,
                gamma: e.originalEvent.gamma
              }
            }

            requestAnimationFrame(function(){
              _.updateTransformation(e);
            });
          }
        });
      } else {
        _.moveBy = 'mouse';

        $(window).on('mousemove', function(e){
          if(_.performTransformation){
            requestAnimationFrame(function(){
              _.updateTransformation(e);
            });
          }
        });
      }

      _.elements.$logo.add(_.elements.$echo).hide();
      // Reveal scene
      _.reveal();
    }

    Hero.prototype.reveal = function(){
      var _ = this;

      _.elements.$logo
        .show()
        .addClass('is-animate')
        .on('animationend', function(){
          _.elements.$echo
            .show()
            .addClass('is-animate');
        });
    };

    Hero.prototype.updateDimensions = function(){
      var _ = this;

      _.width = _.elements.$root.width();
      _.height = _.elements.$root.height();
      _.cx = _.width/2;
      _.cy = _.height/2;
    };

    Hero.prototype.updateTransformation = function(e){
      var _ = this;
      var transformString = 'translate(-50%, -50%) ';

      var dx, dy, dz;
      var tiltx, tilty;

      if(_.moveBy === 'mouse'){
        dx = _.cx - e.clientX;
        dy = _.cy - e.clientY;

        var tiltx = (dy / _.cy);
        var tilty = - (dx / _.cx);
      }

      if(_.moveBy === 'orientation'){
        dx = (e.originalEvent.alpha - _.initialOrientation.alpha) / 180;
        dy = (e.originalEvent.beta - _.initialOrientation.beta) / 90;
        dz = (e.originalEvent.gamma - _.initialOrientation.gamma) / 45;

        var tiltx = dy*2;
        var tilty = - (( e.originalEvent.beta / 360) * dx) + ((1 - (e.originalEvent.beta - 180) / 90) * dz);
      }

      var radius = Math.sqrt(Math.pow(tiltx, 2) + Math.pow(tilty, 2));
      var degree = (radius * 1);

      if(_.moveBy === 'mouse')
        transformString += 'translateZ(' + radius * 10 + 'px) ';

      transformString += 'rotate3d(' + tiltx + ', ' + tilty + ', ' + '0' + ', ' + degree + 'deg)';

      _.elements.$logo.css('transform', transformString);
    };

    return Hero;
  })();

  // SCRIPTS
  $(document)
    .ready(function(){ init(); })
    .on('turbolinks:load', function(e){ if(e.originalEvent.data.timing.visitStart) init(); });

  function init(){
    var $hero = $('.c-hero');
    if($hero.length){
      // Hide logo when hero is visible
      if($('.js-logo').length){
        var observer = new IntersectionObserver(function(entries){
          entries.forEach(function(entry){
            if(entry.isIntersecting){
              $('.js-logo').addClass('is-hiding');
            } else {
              $('.js-logo').removeClass('is-hiding');
            }
          });
        }, { rootMargin: '0px 0px 0px 0px', threshold: 0 });
        observer.observe($hero.get(0));
      }

      if(!Front.reduceMotion) {
        new Hero($hero);
      }
    }
  }

})();
