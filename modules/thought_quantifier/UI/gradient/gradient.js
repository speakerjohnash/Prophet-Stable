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
            leftLabel = rateContainer.select(".left-label"),
            rightLabel = rateContainer.select(".right-label"),
            opacity = fillBar.attr("data-average") / 100,
            inverseOpacity = 1 - opacity,
            rangeScale = ("scaleLinear" in d3) ? d3.scaleLinear() : d3.scale.linear(),
            rangeScale.domain([10, 100]).range([0, 100]);

        // Set Default State
        fillBar.style("width", fillBar.attr("data-average") + "%")
        rightLabel.style("opacity", opacity) 
        leftLabel.style("opacity", inverseOpacity)

        // Hover
        rateContainer.on("mousemove", function(d) {

          var x = d3.mouse(this)[0],
              that = d3.select(this),
              percent = getPercent(x),
              trueVote = Math.round(rangeScale(percent) * 10) / 10,
              opacity = trueVote / 100,
              inverseOpacity = 1 - opacity;

          that.select(".full-gradient").classed("width-transition", false).style("width", percent + "%");
          that.select(".percent-label").text(trueVote + "%")
          that.select(".left-label").style("opacity", inverseOpacity)
          that.select(".right-label").style("opacity", opacity)    

        })

        // Touch Move
        rateContainer.on("touchmove", function(d) {

          d3.event.preventDefault();
          d3.event.stopPropagation();

          var x = d3.touches(this)[0][0],
              that = d3.select(this),
              percent = getPercent(x),
              trueVote = Math.round(rangeScale(percent) * 10) / 10,
              opacity = trueVote / 100,
              inverseOpacity = 1 - opacity;

          that.select(".full-gradient").classed("width-transition", false).style("width", percent + "%");
          that.select(".percent-label").text(trueVote + "%")
          that.select(".left-label").style("opacity", inverseOpacity)
          that.select(".right-label").style("opacity", opacity)  

        }) 

        // Reset Default
        rateContainer.on("mouseout", function(d) {

          var that = d3.select(this),
              fillBar = that.select(".full-gradient"),
              width = rangeScale.invert(fillBar.attr("data-average")),
              opacity = fillBar.attr("data-average") / 100,
              inverseOpacity = 1 - opacity;

          that.select(".full-gradient").classed("width-transition", true).style("width", width + "%")
          that.select(".percent-label").text(fillBar.attr("data-average") + "%")
          that.select(".left-label").style("opacity", inverseOpacity)
          that.select(".right-label").style("opacity", opacity)

        })

        // Vote
        rateContainer.on("click", function(d) {

          var x = d3.mouse(this)[0],
              percent = getPercent(x),
              trueVote = Math.round(rangeScale(percent) * 10) / 10,
              token = "rate-" + data["widget_id"] + "-" + data["content_type"] + "-" + data["content_id"];
          
          data.value = trueVote;

          rateVote(widget, data, token);

        })

        function getPercent(x) {

          var percent = (x / 200) * 100,
              percent = percent < 5 ? 5 : percent > 100 ? 100 : percent,
              percent = Math.round(percent * 10) / 10,
              percent = percent + 5,
              percent = percent > 100 ? 100 : percent;

          return percent
          
        }

        function rateVote(widget, data, token) {

          widget.trigger('eventBeforeRate', [data]);

          var random = Math.floor(Math.random() * 99999);

          var q = (Drupal.settings.rate.basePath.match(/\?/) ? '&' : '?') + 'widget_id=' + data.widget_id + '&content_type=' + data.content_type + '&content_id=' + data.content_id + '&widget_mode=' + data.widget_mode + '&token=' + token + '&destination=' + encodeURIComponent(Drupal.settings.rate.destination) + '&r=' + random;

          if (data.value) {
            q = q + '&value=' + data.value;
          }

          $.get(Drupal.settings.rate.basePath + q, function(response) {

            var newAverage = $(response).find(".full-gradient").attr("data-average"),
                opacity = newAverage / 100,
                inverseOpacity = 1 - opacity,
                d3Widget = d3.select(widget[0]),
                fillBar = d3Widget.select(".full-gradient"),
                newWidth = rangeScale.invert(newAverage);

            fillBar.attr("data-average", newAverage);
            fillBar.style("width", newWidth + "%")
            d3Widget.select(".percent-label").text(newAverage + "%")
            d3Widget.select(".left-label").style("opacity", inverseOpacity)
            d3Widget.select(".right-label").style("opacity", opacity)

            widget.trigger('eventAfterRate', [data]);

          });

        }

      });
    }
  }
})(jQuery);
