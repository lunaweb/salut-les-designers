//= require_self

(function() {
  'use strict';

  $(document).ready(function(){

    var $tmp = $('<div style="height: 100vh;"></div>').appendTo($('body'));
    var vhOffset = $tmp.height() - $(window).height();
    $tmp.remove();

    if(vhOffset > 0){
      $('html').attr('style', '--vh-offset: ' + vhOffset + 'px;');
    }

  });

})();
