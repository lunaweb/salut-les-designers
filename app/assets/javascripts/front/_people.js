//= require_self

(function(){
  'use strict';

  $(document).ready(function(){

    var $peoples = $('.js-people');

    if($peoples.length){

      $peoples.each(function(){
        var $figure = $(this).find('.c-people__figure');
        var $portrait = $(this).find('.c-people__portrait');

        for(var i=0; i<4; i++){
          $figure.append($portrait.clone());
        }
      });

    }

  });

})();
