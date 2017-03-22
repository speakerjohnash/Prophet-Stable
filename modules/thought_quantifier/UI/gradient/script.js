(function ($) {
  Drupal.behaviors.RateGradient = {
    attach: function (context) {
      $('.rate-gradient:not(.rate-gradient-processed)', context).addClass('rate-gradient-processed').each(function() {

        var widget = $(this).parent(),
            ids = widget.attr('id').match(/^rate\-([a-z]+)\-([0-9]+)\-([0-9]+)\-([0-9])$/),
            data = {
              content_type: ids[1],
              content_id: ids[2],
              widget_id: ids[3],
              widget_mode: ids[4]
            };

        var fillBar = $(this).find(".full-gradient")

        fillBar.css("width", fillBar.data("average") + "%")

      });
    }
  }
})(jQuery);
