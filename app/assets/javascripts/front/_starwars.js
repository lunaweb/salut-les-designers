//= require jquery-mousewheel/jquery.mousewheel.js
//= require_self

(function(){
  'use strict';

  $(document).ready(function(){

    var $scene = $('.js-starwars');

    if($scene.length && !isMobile()){

      var $list = $scene.find('.c-starwars__list');

      var canEnhance = isWideEnough();
      var scrollTop = 0;
      var maxScroll = $list.outerHeight();

      if(canEnhance){
        initScene();
      }

      function initScene(){
        scrollTop = 0;
        maxScroll = $list.outerHeight();

        $scene.mousewheel(listenScroll)
          .addClass('is-initialized');
      }

      function removeScene(){
        $scene.unmousewheel(listenScroll)
          .removeClass('is-initialized');
        $list.attr('style', '');
      }

      function listenScroll(e){
        scrollTop -= e.deltaY * e.deltaFactor;

        if(scrollTop >= maxScroll){
          scrollTop = maxScroll;
        } else if(scrollTop <= 0){
          scrollTop = 0;
        }

        $list.css('transform','translate3d(0, -' + scrollTop + 'px, 0)');
      }

      $(window).resize($.throttle(250, function(){
        var lastStatus = canEnhance;
        canEnhance = isWideEnough();

        if(!lastStatus && isWideEnough()) initScene();
        if(lastStatus && !isWideEnough()) removeScene();
      }));

      function isWideEnough(){
        if (window.matchMedia("(min-width: 960px)").matches) {
          return true;
        }

        return false;
      }

    }

    function isMobile(){
      if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        return true;
      }

      return false;
    }

  });

})();
