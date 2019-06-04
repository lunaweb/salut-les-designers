//=require vendors/jquery.ba-throttle-debounce.min.js
//=require front/_vunit-check.js
//=require turbolinks/dist/turbolinks.js
//=require fontfaceobserver/fontfaceobserver.js

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

//=require front/_cursor.js
//=require front/_logo.js
//=require front/_hero-rotate3d.js
//=require front/_echo.js
//=require front/_tale.js
//=require front/_starwars.js
//=require front/_episode.js
//=require front/_transitions.js
