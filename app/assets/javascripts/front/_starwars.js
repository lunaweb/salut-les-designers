//=require jquery-mousewheel/jquery.mousewheel.js

(function(){

  // CLASS
  var StarWars = (function(){
    // Constructor
    function StarWars($element, settings){
      var _ = this;

      _.settings = $.extend(true, {
        minimumPos: -240,
        clone: 2,
        autoscrollSpeed: 0.5,
        autoscrollHoverSpeed: 0.25,
        NF: 250*60/1000, // Number of frames : equivalent to 250ms at 60fps
        timing: function(k){ return 1 - Math.pow(1 - k, 1); },
      }, settings || {});

      _.elements = {};
      _.elements.$root = $element;
      _.elements.$list = _.elements.$root.find('.c-starwars__list');
      _.elements.$group = _.elements.$root.find('.c-starwars__group');

      // Scroll calculation
      _.scroll = {
        pos: 0, // Position to go
        lastRequestPos: 0, // Last position when animation requested (autoplay or first scroll)
        lastPos: 0,  // Last position set
        diff: 0, // Difference scrollPos and lastRequestPos
      };

      // RAF variables
      _.autoscrollRID;
      _.animateRID;
      _.autoscrollTick = true;
      _.dir = 0; // -1 : scroll down / 1 : scroll up
      _.f = 0;

      _.hovered = false;

      _.init();
    }

    // Methods
    StarWars.prototype.init = function(){
      var _ = this;

      _.scroll.pos = _.settings.minimumPos;
      _.scroll.lastPos = _.settings.minimumPos;
      _.dir = 0;
      _.f = 0;

      // Clone groups
      for(var i=0; i<_.settings.clone; i++){
        _.elements.$list.append(_.elements.$group.clone().addClass('is-clone'));
      }

      _.elements.$list.css('transform','translate3d(0, ' + _.settings.minimumPos + 'px, 0)');

      // Listen scroll
      _.elements.$root.mousewheel($.proxy(_.listenScroll, _));

      // Slow down autoscroll on hover
      _.elements.$list.on('mouseenter', function(){ _.hovered = true; })
        .on('mouseleave', function(){ _.hovered = false; });

      _.elements.$root.addClass('is-initialized');

      // Launch
      _.autoscrollTick = true;
      _.autoscrollRID = requestAnimationFrame($.proxy(_.autoscroll, _));
    };

    StarWars.prototype.remove = function(){
      var _ = this;

      _.elements.$root.unmousewheel($.proxy(_.listenScroll, _));

      _.stopAutoscroll();
      _.stopAnimation();
      _.elements.$list.removeAttr('style');

      _.elements.$root.find('.c-starwars__group.is-clone').remove();

      _.elements.$root.removeClass('is-initialized');
    };

    StarWars.prototype.autoscroll = function(){
      var _ = this;

      if(_.autoscrollTick){
        _.dir = -1;
        _.scroll.pos += -(_.hovered ? 0.25 : 0.5);

        if(_.animateRID) _.stopAnimation();
        _.animateRID = requestAnimationFrame($.proxy(_.animate, _));
      }

      _.autoscrollRID = requestAnimationFrame($.proxy(_.autoscroll, _));
    };

    StarWars.prototype.stopAutoscroll = function(){
      var _ = this;

      cancelAnimationFrame(_.autoscrollRID);
      _.autoscrollRID = null;
      _.autoscrollTick = false;
    };

    StarWars.prototype.listenScroll = function(e){
      var _ = this;
      e.preventDefault();

      _.autoscrollTick = false;

      _.dir = e.deltaY < 0 ? -1 : 1;
      _.scroll.pos += _.roundValue(e.deltaY * e.deltaFactor * 0.5);

      if(_.animateRID) _.stopAnimation();
      _.animateRID = requestAnimationFrame($.proxy(_.animate, _));
    };

    StarWars.prototype.stopAnimation = function(){
      var _ = this;

      cancelAnimationFrame(_.animateRID);
      _.animateRID = null;

      _.f = 0;
      _.scroll.lastRequestPos = _.scroll.lastPos;
    };

    StarWars.prototype.animate = function(){
      var _ = this;

      _.f++;

      var k = _.f/_.settings.NF;

      var newPos = _.getNewPosition(k);

      if(newPos !== _.scroll.lastPos){
        _.scroll.lastPos = newPos;
        _.elements.$list.css('transform','translate3d(0, ' + _.scroll.lastPos + 'px, 0)');
      }

      if(!(_.f%_.settings.NF)){
        _.autoscrollTick = true;
        _.scroll.lastPos = _.scroll.pos;
        _.stopAnimation();
        return;
      }
      _.animateRID = requestAnimationFrame($.proxy(_.animate, _));
    };

    StarWars.prototype.getNewPosition = function(k){
      var _ = this;
      var newPos = _.settings.minimumPos;

      // Top edge
      if(_.scroll.pos > _.settings.minimumPos)
        _.scroll.pos = _.settings.minimumPos;

      if(!_.scroll.lastRequestPos) _.scroll.lastRequestPos = _.scroll.lastPos;

      _.scrollDiff = _.scroll.pos - _.scroll.lastRequestPos;

      newPos = _.scroll.lastRequestPos + (_.settings.timing(k) * _.scrollDiff);
      // Prevent newPos to go further than scrollPos
      if(_.dir === -1 && newPos < _.scroll.pos) newPos = _.scroll.pos;
      if(_.dir === 1 && newPos > _.scroll.pos) newPos = _.scroll.pos;

      // Point where infinite begin
      if(newPos * -1 >= (_.elements.$list.height() / (_.settings.clone+1)) * _.settings.clone){
        _.stopAnimation();
        newPos = _.scroll.pos = -1 * _.elements.$list.height() / (_.settings.clone+1);
      }

      return _.roundValue(newPos);
    };

    StarWars.prototype.roundValue = function(value){
      return parseFloat(value.toFixed(2));
    };

    return StarWars;
  })();

  // SCRIPTS
  if(!Front.reduceMotion){
    $(document)
      .ready(function(){ init(); })
      .on('turbolinks:load', function(e){ if(e.originalEvent.data.timing.visitStart) init(); });

    function init(){
      var $scene = $('.js-starwars');

      if($scene.length && !Front.isMobile()){
        var canEnhance = isWideEnough();
        var scene;

        // Spaceship ignition
        if(canEnhance){
          scene = new StarWars($scene);
        }

        // Control center
        $(window).resize($.throttle(250, function(){
          var lastStatus = canEnhance;
          canEnhance = isWideEnough();

          if(!lastStatus && isWideEnough()){
            if(scene)
              scene.init();
            else
              scene = new StarWars($scene);
          }
          if(lastStatus && !isWideEnough()){
            if(scene)
              scene.remove();
          }
        }));
      }
    }

    function isWideEnough(){
      if (window.matchMedia("(min-width: 960px)").matches) {
        return true;
      }

      return false;
    }
  }

})();
