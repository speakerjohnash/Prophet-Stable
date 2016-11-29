buildMoodTracker = (function($){

	var globalData = {};

	var beaming = "M 13 21 C 13 43 50 43 50 21",
		happy = "M 17 30 S 28 48 48 30 53 34",
		pleasant = "M 19 34 S 27 41 46 35 50 33",
		neutral = "M 26 35 S 27 36 40 35 41 29",
		unpleasant = "M 19 34 S 29 30 46 35 50 33",
		sad = "M17, 35 C29,18 51,30 51,35",
		depressed = "M17, 35 C23,12 51,22 51,35";
	
	var states = [depressed, sad, unpleasant, neutral, pleasant, happy, beaming];

	/* Find intermediate states between paths */
	function pathTween(d1, precision) {
		return function() {
		    var path0 = d3.select(".mouth").node(),
				path1 = path0.cloneNode(),
				n0 = path0.getTotalLength(),
				n1 = (path1.setAttribute("d", d1), path1).getTotalLength();

			// Uniform sampling of distance based on specified precision.
			var distances = [0], i = 0, dt = precision / Math.max(n0, n1);
			while ((i += dt) < 1) distances.push(i);
			distances.push(1);

			// Compute point-interpolators at each distance.
			var points = distances.map(function(t) {
				var p0 = path0.getPointAtLength(t * n0),
					p1 = path1.getPointAtLength(t * n1);
				return d3.interpolate([p0.x, p0.y], [p1.x, p1.y]);
			});

			return function(t) {
				return t < 1 ? "M" + points.map(function(p) { return p(t); }).join("L") : d1;
			};
		};
	}

	/* Produce all transition functions */
	function stateLookup(states) {

		var path = d3.select(".mouth"),
			tFuncs = [],
			tFunc;

		for (var i = 0; i < states.length; i++) {
			if (i == states.length - 1) break
			path.attr("d", states[i])
			tFunc = pathTween(states[i + 1] , 4)()
			tFuncs.push(tFunc)
		}

		path.attr("d", neutral)

		return tFuncs

	}

	/* Prepare data for visualization */

	function formatData(data) {

		var mood = [],
			format = d3.time.format("%Y-%m-%d");

		data.forEach(function(day) {
			if (parseFloat(day["mood"], 10) != 0) {
				m_row = {
					"value" : parseFloat(day["value"], 10), 
					"key" : "mood", 
					"date" : format.parse(day["date"])
				}
				mood.push(m_row)
			}
				 
		})

		return mood

	}

	movingAvg = function(n) {
		return function (points) {
			points = points.map(function(each, index, array) {
				var to = index + n - 1;
				var subSeq, sum;
				if (to < points.length) {
					subSeq = array.slice(index, to + 1);
					sum = subSeq.reduce(function(a,b) { return [a[0] + b[0], a[1] + b[1]]; });
					return sum.map(function(each) { return each / n; });
				}
				return undefined;
			});
			points = points.filter(function(each) { return typeof each !== 'undefined' });
			pathDesc = d3.svg.line().interpolate("basis")(points)
			return pathDesc.slice(1, pathDesc.length);
		}
	}

	function buildStream(data) {

		globalData = data;

		var margin = 15,
			width = window.innerWidth - margin,
			height = window.innerHeight / 2.5,
			faceSize = 70;
			legendWidth = 100,
			axisHeight = 20;

		var svg = d3.select(".mood-chart").append("svg")
			.attr("class", "main-svg")
			.attr("width", width - legendWidth)
			.attr("height", height + axisHeight);

		var legend = d3.select(".mood-chart").append("svg")
			.attr("class", "legend")
			.attr("height", height)
			.attr("width", faceSize);

		legend.append("circle")
			.attr("class", "face")
			.attr("fill", "#e8e8e8")
			.attr("r", faceSize / 2)
			.attr("cx", faceSize / 2)
			.attr("cy", height / 2);

		// Eyes
		legend.append("circle")
			.attr("class", "eye")
			.attr("cx", (faceSize / 2) - (faceSize / 5))
			.attr("cy", (height / 2) - (faceSize / 6))
			.attr("r", 2.5)
			.attr("fill", "black");

		legend.append("circle")
			.attr("class", "eye")
			.attr("cx", (faceSize / 2) + (faceSize / 5))
			.attr("cy", (height / 2) - (faceSize / 6))
			.attr("r", 2.5)
			.attr("fill", "black");

		// Set base face to neutral
		var mouthPos = (height / 2) - (faceSize / 2) + (faceSize / 4)

		legend.append("path")
			.attr("class", "mouth")
			.attr("transform", "translate(3," + mouthPos + ")scale(1,1)")
			.attr("d", neutral)

		// Get Facial State Map
		var stateMap = stateLookup(states);

		// Data
		var mood = formatData(data);

		// Gradients
		var moodRange = d3.extent(mood, function(d) { return d["value"] }),
			format = d3.time.format("%Y-%m-%d"),
			timeRange = d3.extent(data, function(d) { return format.parse(d["date"])}),
			colorScale = d3.scale.linear().domain([-1, 0, 1]).range(['#694a69', 'steelblue', 'yellow']);

		var x = d3.time.scale().domain(timeRange).range([0, width - legendWidth]),
			y = d3.scale.linear().domain([-1, 1]).range([height, 0])
			mY = d3.scale.linear().domain(moodRange).range([height, 0]);

		// Line 
		var line = d3.svg.line()
			.interpolate(movingAvg(1))
			.x(function(d) { return x(d.date); })
			.y(function(d) { return mY(d.value); });

		// TODO: Load prophet thoughts via brush selection

		// Scatterplot
		svg.selectAll("dot")
			.data(mood)
			.enter().append("circle")
			.attr("r", 2)
			.attr("cx", function(d) { return x(d.date); })
			.attr("cy", function(d) { return mY(d.value); });
		
		// Draw Axes
		var XAxis = d3.svg.axis().scale(x).orient("bottom");

		var field = svg.append("g").attr("height", height);
		
  		var axis = svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0, " + height + ")")
			.call(XAxis);

		field.append("path")
			.datum(mood)
			.attr("class", "fat-line")
			.attr("d", line);

		var path = field.append("path")
			.datum(mood)
			.attr("class", "line")
			.attr("d", line);

		var pathEl = path.node();
		var pathLength = pathEl.getTotalLength();

		// Track Line
		var circle = 
        svg.append("circle")
          .attr("cx", 100)
          .attr("cy", 350)
          .attr("r", 3)
          .attr("fill", "steelblue");

        var funcScale = d3.scale.linear().domain([-1, 1]).range([0, 6]);

		// Interactive Face
		svg.on("mousemove", function() {
			var mouse = d3.mouse(this),
				x = mouse[0],
				beginning = mouse[0], 
				end = pathLength;
				
			var target;
			var pos;

			while (true) {
				target = Math.floor((beginning + end) / 2);
				pos = pathEl.getPointAtLength(target);
				if ((target === end || target === beginning) && pos.x !== x) {
					break;
				}
				if (pos.x > x) end = target;
				else if (pos.x < x) beginning = target;
				else				break; //position found
			}

			circle
				.attr("opacity", 1)
				.attr("cx", pos.x)
				.attr("cy", pos.y);

			var scaledY = y.invert(pos.y),
				color = colorScale(scaledY),
				scaledIndex = funcScale(scaledY),
				funcToUse = Math.floor(scaledIndex),
				t = scaledIndex % 1,
				newMouthLine = stateMap[funcToUse](t);

			d3.select(".mouth")
				.attr("d", newMouthLine)

			d3.select(".legend .face")
				.attr("fill", color);

  		});

		// Baseline
		field.append("line")
			.style("stroke", "black")
			.style("opacity", 0.1)  // colour the line
			.attr("x1", 0)	 // x position of the first end of the line
			.attr("y1", height / 2)	  // y position of the first end of the line
			.attr("x2", width - legendWidth)	 // x position of the second end of the line
			.attr("y2", height / 2);	// y position of the second end of the line

		// Gradient
		svg.append("linearGradient")
			.attr("id", "temperature-gradient")
			.attr("gradientUnits", "userSpaceOnUse")
			.attr("x1", 0).attr("y1", y(-1))
			.attr("x2", 0).attr("y2", y(1))
			.selectAll("stop")
			.data([
				{offset: "0%", color: "#694a69"}, // black, red, purple
				{offset: "50%", color: "steelblue"},
				{offset: "100%", color: "yellow"}
			])
			.enter().append("stop")
			.attr("offset", function(d) { return d.offset; })
			.attr("stop-color", function(d) { return d.color; });

	}

	return buildStream

})(jQuery);