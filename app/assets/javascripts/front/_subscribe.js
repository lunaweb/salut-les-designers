//=require a11y-dialog/dist/a11y-dialog.min.js

(function () {

  // CLASS
  var Subscribe = (function () {
    // Constructor
    function Subscribe($element) {
      var _ = this;

      _.elements = {
        $root: $element,
        $toggler: $element.find('.js-subscribe-toggler'),
        $text: $element.find('.js-subscribe-text'),
        $form: $element.find('.js-subscribe-form'),
        $emailInput: $element.find('input[type="email"]'),
        $submit: $element.find('[type="submit"]'),
        $modal: $element.find('.js-subscribe-modal'),
        $modalTitle: $element.find('.js-subscribe-modal-title'),
        $modalContent: $element.find('.js-subscribe-modal-content'),
        $modalCountdown: $('\
          <div class="c-consent-modal__countdown">\
            <div class="c-consent-modal__countdown-count"></div>\
            <div class="c-consent-modal__countdown-left"></div>\
            <div class="c-consent-modal__countdown-right"></div>\
          </div>\
        '),
      };

      _.mode = "small";
      _.modal = null;
      _.isOpenOnSmall = false;
      _.closeTimeoutID = null;

      _.boundedFuncs = {
        toggleOnSmall: $.proxy(_.toggleOnSmall, _),
      };

      _.init();
    }

    // Methods
    Subscribe.prototype.init = function () {
      var _ = this;

      _.elements.$toggler.on('click', _.boundedFuncs.toggleOnSmall);

      _.elements.$emailInput.on('input', function () {
        if (_.elements.$emailInput.get(0).checkValidity()) {
          _.elements.$submit.attr('disabled', false);
        } else {
          _.elements.$submit.attr('disabled', true);
        }
      });

      _.modal = new A11yDialog(_.elements.$modal.get(0));
      _.modal.on('show', function () {
        _.initModalContent();
      });
      _.modal.on('hide', function () {
        if (_.closeTimeoutID) {
          clearTimeout(_.closeTimeoutID);
          _.closeTimeoutID = null;
        }
      });

      _.elements.$form.on('submit', function (e) {
        e.preventDefault();
        _.modal.show();
      });

      $(window).resize($.throttle(250, $.proxy(_.watchResize, _)));
    }

    Subscribe.prototype.watchResize = function () {
      var _ = this;

      if (window.matchMedia('(max-width: 47.99em)').matches) {
        if (_.mode !== 'small') {
          _.elements.$toggler.on('click', _.boundedFuncs.toggleOnSmall);
          _.mode = 'small';
        }
      } else {
        if (_.mode !== 'large') {
          _.elements.$toggler.off('click', _.boundedFuncs.toggleOnSmall);
          _.closeOnSmall();
          _.mode = 'large';
        }
      }
    }

    Subscribe.prototype.toggleOnSmall = function () {
      var _ = this;

      if (_.isOpenOnSmall) {
        _.closeOnSmall();
      } else {
        _.openOnSmall();
      }
    }

    Subscribe.prototype.openOnSmall = function () {
      var _ = this;

      _.elements.$toggler.addClass('is-open');
      _.elements.$text.addClass('is-open');
      _.elements.$form.addClass('is-open');

      _.isOpenOnSmall = true;
    }

    Subscribe.prototype.closeOnSmall = function () {
      var _ = this;

      _.elements.$toggler.removeClass('is-open');
      _.elements.$text.removeClass('is-open');
      _.elements.$form.removeClass('is-open');

      _.isOpenOnSmall = false;
    }

    Subscribe.prototype.initModalContent = function () {
      var _ = this;

      _.closeTimeoutID = null;

      _.elements.$modalTitle.text('Vos données sont importantes');
      _.elements.$modalTitle.removeClass('c-consent-modal__title--success');

      _.elements.$modalCountdown.detach();

      _.elements.$modalContent.html('\
        <p><strong>Autorisez-vous</strong> Salut les Designers à utiliser cet e-mail afin de vous transmettre ses informations ?</p>\
        <div class="c-consent-modal__status">\
          <div class="c-consent-modal__optin">\
            <input type="checkbox" name="" id="subscribe-consent"/>\
            <label for="subscribe-consent"><strong>Oui,</strong> j\'autorise !</label>\
          </div>\
        </div>\
        <a href="/donnees-personnelles.html" target="_blank">Vos données sur ce site</a>\
      ');

      _.elements.$modalContent.find('input').on('change', function (e) {
        if (e.currentTarget.checked === true) {
          _.elements.$modalContent.find('.c-consent-modal__status')
            .addClass('c-consent-modal__status--pending')
            .on('transitionend', function () {
              _.sendForm();
            });
        }
      });
    }

    Subscribe.prototype.updateModalContentWithSuccess = function () {
      var _ = this;

      _.clearForm();

      _.elements.$modalTitle.text('Bienvenu·e chez nous !');
      _.elements.$modalTitle.addClass('c-consent-modal__title--success');

      _.elements.$modalTitle.parent().append(_.elements.$modalCountdown);
      _.elements.$modalCountdown.find('.c-consent-modal__countdown-count')
        .prop('Counter', 6)
        .animate({
          Counter: 0
        }, {
          duration: 6000,
          easing: 'linear',
          step: function (now) {
            $(this).text(Math.ceil(now));
          }
        });

      _.elements.$modalContent.html('\
        <p><strong>Merci de votre inscription,</strong> découvrez dès à présent la newsletter du dernier épisode dans votre boite email.</p>\
        <div class="c-consent-modal__status c-consent-modal__status--success">\
          <img src="/assets/images/front/party.gif" alt="" width="30" height="30" class="c-consent-modal__status-icon"/>\
          <strong>C\'est validé</strong>\
        </div>\
        <a href="/donnees-personnelles.html" target="_blank">Vos données sur ce site</a>\
      ');

      _.closeTimeoutID = setTimeout(function () {
        _.modal.hide();
      }, 6000);
    }

    Subscribe.prototype.updateModalContentWithError = function () {
      var _ = this;

      _.elements.$modalTitle.text('Aïe !');

      _.elements.$modalTitle.parent().append(_.elements.$modalCountdown);
      _.elements.$modalCountdown.find('.c-consent-modal__countdown-count')
        .prop('Counter', 6)
        .animate({
          Counter: 0
        }, {
          duration: 6000,
          easing: 'linear',
          step: function (now) {
            $(this).text(Math.ceil(now));
          }
        });

      _.elements.$modalContent.html('\
        <p><strong>Une erreur est survenue,</strong> veuillez réessayer plus tard ou contactez-nous.</p>\
        <div class="c-consent-modal__status">\
          <img src="/assets/images/front/sad.gif" alt="" width="30" height="30" class="c-consent-modal__status-icon"/>\
          <strong>Désolé</strong>\
        </div>\
        <a href="/donnees-personnelles.html" target="_blank">Vos données sur ce site</a>\
      ');

      _.closeTimeoutID = setTimeout(function () {
        _.modal.hide();
      }, 6000);
    }

    Subscribe.prototype.sendForm = function () {
      var _ = this;

      $.getJSON(_.elements.$form.attr('action') + '?callback=?', _.elements.$form.serialize(), function (data) {
        if (data.Status === 200) {
          _.updateModalContentWithSuccess();
        } else {
          _.updateModalContentWithError();
        }
      });
    }

    Subscribe.prototype.clearForm = function () {
      var _ = this;

      _.elements.$emailInput.val('');
      _.elements.$submit.attr('disabled', true);
    }

    return Subscribe;
  })();

  // SCRIPTS
  $(document).ready(init)
    .on('turbolinks:load', function (e) {
      if (e.originalEvent.data.timing.visitStart) init();
    });

  function init() {
    var $subscribe = $('.js-subscribe');
    if ($subscribe.length) new Subscribe($subscribe);
  };

})();
