//= require_self

(function() {
  'use strict';

  $(document).ready(function(){
    var $tmp = $('<div></div>').appendTo($('body'));

    $tmp.css({ height: '100vh', width: 0});
    var vhOffset = $tmp.height() - $(window).height();

    $tmp.css({ height: 0, width: '100vw'});
    var vwOffset = $tmp.width() - $(window).width();

    $tmp.remove();

    if(vhOffset > 0){
      $('html').attr('style', '--vh-offset: ' + vhOffset + 'px;');
    }

    if(vwOffset > 0){
      $('html').attr('style', '--vw-offset: ' + vwOffset + 'px;');
    }

  });

})();
