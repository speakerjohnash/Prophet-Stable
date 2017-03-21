gradientVote = function (labels) {

  var width = window.innerWidth,
    widgetWidth = 175,
    radius = 10,
    height = radius * 2,
    margin = 10
    leftLabel = labels[0],
    rightLabel = labels[1];

  var x1 = margin,
    x2 = widgetWidth + margin,
    y = height / 2;

  var container = d3.select("body")
    .append("div")
    .attr("id", "gradient-container")
    .style("width", widgetWidth + (2 * margin) + "px")

  var labelsDiv = container.append("div")
    .attr("class", "labels")
    
  var leftLabel = labelsDiv.append("span")
    .text(labels[0])
    .attr("class", "left-label")

  var percentLabel = labelsDiv.append("span")
    .attr("class", "percent-label")
    .text("50%")

  var rightLabel = labelsDiv.append("span")
    .text(labels[1])
    .attr("class", "right-label")

  var svg = container.append("svg")
    .attr("width", widgetWidth + (2 * margin))
    .attr("height", height)
    .on("mousemove", hoverMove)
    .datum({
      x: (widgetWidth / 2) + margin,
      y: height / 2
    });

  var empty = svg.append("line")
    .attr("x1", x1)
    .attr("x2", x2)
    .attr("y1", y)
    .attr("y2", y)
    .style("stroke", "#f2f2f2")
    .style("stroke-linecap", "round")
    .style("stroke-width", radius * 2);

  var truth = svg.append("line")
    .attr("x1", x1)
    .attr("x2", function(d) { return d.x; })
    .attr("y1", y)
    .attr("y2", y)
    .style("stroke", "#f1e886")
    .style("stroke-linecap", "round")
    .style("stroke-width", radius * 2);

  var rangeScale = d3.scale.linear().domain([5.4, 100]).range([0, 100])

  function hoverMove(d) {

    var x = d3.event.x - (window.innerWidth / 2) + (widgetWidth / 2) + radius;

    // Constrain x to be between x1 and x2 (the ends of the line).
    x = x < x1 ? x1 : x > x2 ? x2 : x;

    truth.attr("x2", x);

    var percent = (x / (widgetWidth + radius)) * 100,
        percent = Math.round(rangeScale(percent) * 10) / 10,
        opacity = percent / 100,
        inverseOpacity = 1 - opacity;;

    rightLabel.style("opacity", opacity)
    leftLabel.style("opacity", inverseOpacity)    
    percentLabel.text(percent + "%")

  }

}(["False", "True"])