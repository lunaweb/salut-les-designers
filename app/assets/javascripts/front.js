// require picturefill/picturefill.js
// require svg4everybody/svg4everybody.js
//= require vendors/jquery.ba-throttle-debounce.min.js
//= require front/vunit-check.js
//= require turbolinks
//= require fontfaceobserver/fontfaceobserver.js
//= require_self
//= require front/_cursor.js
//= require front/_logo.js
// require front/_footer.js
//= require front/_hero-rotate3d.js
//= require front/_echo.js
//= require front/_tale.js
//= require front/_starwars.js
//= require front/_episode.js
//= require front/_transitions.js

// var $win = $(window),
//     $doc = $(document),
//     $html = $('html'),
//     $body = $('body');

var Front = {
  reduceMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,

  isMobile: function(){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      return true;
    }

    return false;
  },

  getPermanentRoot: function(){
    return $('#turbolinks-permanent').length ? $('#turbolinks-permanent') : $('body');
  },

  getInContext: function(search, $context){
    var $elements;

    if($context === undefined){
      $elements = $(search);
    } else if($context.filter(search).length){
      $elements = $context;
    } else {
      $elements = $(search, $context);
    }

    return $elements;
  },
};

// svg4everybody();
