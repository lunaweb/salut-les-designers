//= require_self

(function(){
  'use strict';

  $(document).ready(function(){

    var $sources = $('.js-duplicate');

    if($sources.length){

      $sources.each(function(){
        var $source = $(this);
        var times = $(this).data('times') ? $(this).data('times') : 0;

        for(var i=0; i<times; i++){
          $source.after($source.clone());
        }
      });

    }

  });

})();
