(function () {

  // CLASS
  var Single = (function () {
    // Constructor
    function Single($element, settings) {
      var _ = this;

      _.settings = $.extend(true, {
        textClones: 4,
      }, settings || {});

      _.elements = {};
      _.elements.$root = $element;
      _.elements.$title = _.elements.$root.find('.js-single-title');
      _.elements.$texts = null;

      _.init();
    }

    // Methods
    Single.prototype.init = function () {
      var _ = this;

      _.elements.$texts = _.elements.$title;

      // Fit Title
      _.fitTexts();

      // Duplicate Title
      for (var i = 0; i < 4; i++) {
        var $clone = _.elements.$title.clone();
        _.elements.$title.after($clone);
        _.elements.$texts = _.elements.$texts.add($clone);
      }

      $(window).resize($.throttle(250, function () {
        _.fitTexts();
      }));
    };

    Single.prototype.fitTexts = function () {
      var _ = this;

      _.elements.$texts.css('white-space', 'nowrap');
      _.elements.$texts.each(function () {
        var $text = $(this);
        var $clone = $text.clone().css({ position: 'absolute', top: '-9999px', left: '-9999px', visibility: 'hidden' }).appendTo($text.parent());
        var $reference = $($text.data('fit-to'));
        var referenceWidth = $reference.width();
        var size = parseInt($text.css('font-size'));

        var newSize = size * (referenceWidth / $clone.width());
        $text.css('font-size', Math.floor(newSize) + 'px');

        $clone.remove();
      });
    };

    return Single;
  })();

  // SCRIPTS
  $(document)
    .ready(function () { init(true); })
    .on('turbolinks:load', function (e) { if (e.originalEvent.data.timing.visitStart) init(); });

  function init(listenLoad) {
    var $single = $('.js-single');

    if ($single.length) {
      var single = new Single($single);

      // Hide Content
      if (!Front.reduceMotion) {
        single.elements.$root.addClass('animate-pending');
      }

      // Reveal content
      var font = new FontFaceObserver('Ace', { weight: 600 });
      font.load().then(function () {
        revealSingle(single);
      });
    }
  }

  function revealSingle(single) {
    single.fitTexts();
    if (!Front.reduceMotion) {
      single.elements.$root.addClass('animate-running');
    }
  }

})();
