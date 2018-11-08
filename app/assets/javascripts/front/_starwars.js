//= require jquery-mousewheel/jquery.mousewheel.js
//= require_self

(function(){
  'use strict';

  $(document).ready(function(){
    /**
     * VARIABLES
     */
    // Elements
    var $scene = $('.js-starwars');
    var $list = $scene.find('.c-starwars__list');
    var $group = $scene.find('.c-starwars__group');
    var cloneNumber = 2;

    // Scroll calculation
    var scrollPos = 0; // Position to go
    var lastRequestScrollPos = 0; // Last position when animation requested (autoplay or first scroll)
    var lastScrollPos = 0;  // Last position set
    var scrollDiff = 0; // Difference scrollPos and lastRequestPos

    // Scene states
    var canEnhance = isWideEnough();
    var isHovered = false;

    // RAF variables
    var autoscrollRID;
    var animateRID;
    var autoscrollTick = true;
    var dir = 0; // -1 : scroll down / 1 : scroll up
    var f = 0;
    var NF = 250*60/1000; // Number of frames : equivalent to 250ms at 60fps
    var timing = function(k){ return 1 - Math.pow(1 - k, 1); };

    /**
     * SCRIPTS
     */
    if($scene.length && !isMobile()){

      // Spaceship ignition
      if(canEnhance){
        initScene();
      }

      // Control center
      $(window).resize($.throttle(250, function(){
        var lastStatus = canEnhance;
        canEnhance = isWideEnough();

        if(!lastStatus && isWideEnough()) initScene();
        if(lastStatus && !isWideEnough()) removeScene();
      }));

    }

    /**
     * FUNCTIONS
     */
    function initScene(){
      scrollPos = 0;
      lastScrollPos = 0;
      dir = 0;
      f = 0;

      // Clone groups
      for(var i=0; i<cloneNumber; i++){
        $list.append($group.clone().addClass('is-clone'));
      }

      // Listen scroll
      $scene.mousewheel(listenScroll);

      // Slow down autoscroll on hover
      $list.on('mouseenter', function(){ isHovered = true; })
        .on('mouseleave', function(){ isHovered = false; });

      $scene.addClass('is-initialized');

      // Launch
      autoscrollTick = true;
      autoscrollRID = requestAnimationFrame(autoscroll);
    }

    function removeScene(){
      $scene.unmousewheel(listenScroll);

      stopAutoscroll();
      stopAnimation();
      $list.removeAttr('style');

      $scene.find('.c-starwars__group.is-clone').remove();

      $scene.removeClass('is-initialized');
    }

    function autoscroll() {
      if(autoscrollTick){
        dir = -1;
        scrollPos += -(isHovered ? 0.25 : 0.5);

        if(animateRID) stopAnimation();
        animateRID = requestAnimationFrame(animate);
      }

      autoscrollRID = requestAnimationFrame(autoscroll);
    }

    function stopAutoscroll(){
      cancelAnimationFrame(autoscrollRID);
      autoscrollRID = null;
      autoscrollTick = false;
    }

    function listenScroll(e){
      autoscrollTick = false;

      dir = e.deltaY < 0 ? -1 : 1;
      scrollPos += roundValue(e.deltaY * e.deltaFactor * 0.5);

      if(animateRID) stopAnimation();
      animateRID = requestAnimationFrame(animate);
    }

    function stopAnimation(){
      cancelAnimationFrame(animateRID);
      animateRID = null;

      f = 0;
      lastRequestScrollPos = lastScrollPos;
    }

    function animate(){
      f++;

      var k = f/NF;

      var newPos = getNewPosition(k);

      if(newPos !== lastScrollPos){
        lastScrollPos = newPos;
        $list.css('transform','translate3d(0, ' + lastScrollPos + 'px, 0)');
      }

      if(!(f%NF)){
        autoscrollTick = true;
        lastScrollPos = scrollPos;
        stopAnimation();
        return;
      }
      animateRID = requestAnimationFrame(animate);
    }

    function getNewPosition(k){
      var newPos = 0;

      // Top edge
      if(scrollPos > 0)
        scrollPos = 0;

      if(!lastRequestScrollPos) lastRequestScrollPos = lastScrollPos;

      scrollDiff = scrollPos - lastRequestScrollPos;

      newPos = lastRequestScrollPos + (timing(k) * scrollDiff);
      // Prevent newPos to go further than scrollPos
      if(dir === -1 && newPos < scrollPos) newPos = scrollPos;
      if(dir === 1 && newPos > scrollPos) newPos = scrollPos;

      // Point where infinite begin
      if(newPos * -1 >= ($list.height() / (cloneNumber+1)) * cloneNumber){
        stopAnimation();
        newPos = scrollPos = -1 * $list.height() / (cloneNumber+1);
      }

      return roundValue(newPos);
    }

    function roundValue(value){
      return parseFloat(value.toFixed(2));
    }

    function isWideEnough(){
      if (window.matchMedia("(min-width: 960px)").matches) {
        return true;
      }

      return false;
    }

    function isMobile(){
      if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        return true;
      }

      return false;
    }


  });

})();
