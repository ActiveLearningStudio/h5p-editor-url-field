/*global H5PEditor, H5P */
H5PEditor.widgets.linkWidget = (function ($) {

  /**
   * Initialize link widget
   *
   * @param parent
   * @param field
   * @param params
   * @param setValue
   */
  function linkWidget(parent, field, params, setValue) {
    var self = this;

    // Tell editor to handle passing readies.
    self.passReadies = false;

    // Create link widget container
    var $container = $('<div>', {
      'class': 'h5p-link-widget'
    });

    // Extend params with default values
    params = $.extend({}, params);
    setValue(field, params);

    // Process semantics and place them in container
    H5PEditor.processSemanticsChunk(field.fields, params, $container, self);

    // Selector element
    var $selector = $container.find('.field.select').addClass('h5p-link-protocol-selector')
      .find('select');

    // Url text element
    var $urlText = $container.find('.field.text').addClass('h5p-link-url')
      .find('.h5peditor-text');

    // Register listener for changes in url field
    $urlText.on('input propertychange paste', function () {
      console.log("got event");
      findUrlProtocol();
    });

    /**
     * Finds url protocol and sets it in selector if found.
     */
    var findUrlProtocol = function () {
      console.log("RUNNING FIND URL PROTOCOL!");
      console.log($selector);
      console.log($('option', $selector));
      var $options = $('option', $selector);
      $options.each(function (idx, option) {
        if ($urlText.val().substr(0, option.value.length) === option.value) {
          $urlText.val($urlText.val().substr(option.value.length));
          $selector.val(option.value);
        }
      });
      if ($urlText.val().substr(0, 7) === 'http:\/\/') {
        $urlText.val($urlText.val().substr(7));
        $selector.val('http://');
      } else if ($urlText.val().substr(0, 8) === 'https:\/\/') {
        $urlText.val($urlText.val().substr(8));
        $selector.val('https://');
      } else if ($urlText.val().substr(0, 1) === '\/') {
        $urlText.val($urlText.val().substr(1));
        $selector.val('/');
      }

      // Make sure params are updated
      params.url = $urlText.val();
      params.protocol = $selector.val();
    };

    /**
     * Validate the url
     */
    self.validate = function () {

      // We only require the URL field to be non-empty
      return $urlText.val().length >= 1;
    };

    /**
     * Remove widget
     */
    self.remove = function () {
      $container.remove();
    };

    /**
     * Append link widget to wrapper
     *
     * @param {H5P.jQuery} $wrapper
     */
    self.appendTo = function ($wrapper) {
      $container.appendTo($wrapper);
    };
  }

  return linkWidget;

})(H5P.jQuery);
