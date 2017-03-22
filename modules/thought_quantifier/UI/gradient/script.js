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

        var rateContainer = d3.select(this)
            fillBar = rateContainer.select(".full-gradient"),
            rangeScale = d3.scaleLinear().domain([10, 100]).range([0, 100]);

        // Set Default State
        fillBar.style("width", fillBar.attr("data-average") + "%")

        // Hover
        rateContainer.on("mousemove", function(d) {

          var x = d3.mouse(this)[0],
              percent = (x / 200) * 100,
              percent = percent < 5 ? 5 : percent > 100 ? 100 : percent,
              percent = Math.round(percent * 10) / 10,
              percent = percent + 5,
              percent = percent > 100 ? 100 : percent,
              trueVote = Math.round(rangeScale(percent) * 10) / 10,
              opacity = trueVote / 100,
              inverseOpacity = 1 - opacity;

          d3.select(this).select(".full-gradient").style("width", percent + "%");
          d3.select(this).select(".percent-label").text(trueVote + "%")
          d3.select(this).select(".left-label").style("opacity", inverseOpacity)
          d3.select(this).select(".right-label").style("opacity", opacity)    

        })

        // Reset Default
        rateContainer.on("mouseout", function(d) {
          d3.select(this).select(".full-gradient").style("width", fillBar.attr("data-average") + "%")
          d3.select(this).select(".percent-label").text(fillBar.attr("data-average") + "%")
        })

      });
    }
  }
})(jQuery);
