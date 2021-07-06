(function () {

  // SCRIPTS
  $(document).ready(init)
    .on('turbolinks:load', function (e) {
      if (e.originalEvent.data.timing.visitStart) init();
    });

  function init() {
    var $stayTuned = $('.js-stay-tuned');
    if ($stayTuned.length) {
      updateOffset();

      $(window).resize($.throttle(250, updateOffset));

      function updateOffset() {
        $('html').attr('style', '--stay-tuned-offset: ' + $stayTuned.outerHeight() + 'px;');
      }
    }

  };

})();
