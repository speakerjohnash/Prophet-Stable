prophet = (function($){

	$(function() {

		run()
		$(document).ajaxStop(run);   

	});

	function run() {

		$('.rate-widget-2').find("li:first").addClass('first');
		$('.rate-widget-2').find("li:last").addClass('last');

		// Hack to hide trackable regex
		$("#edit-title").val("")
		$("#edit-title").css("color", "black");

		// Truth Rating widget
		$(".rate-fivestar-processed a").hover(
			function() {
				var index = $(this).closest(".rate-fivestar-processed").find("a").index($(this)),
					parentField = $(this).closest(".views-field-value"),
					labels = parentField.find(".views-label-value span"),
					falseLabel = $(labels[0]),
					trueLabel = $(labels[1]),
					opacity = (index + 1) / 10,
					inverseOpacity = 1 - opacity;
			
				trueLabel.css("opacity", opacity)
				falseLabel.css("opacity", inverseOpacity)

			}, function() {

			}
		);

		$(".views-field-value").mouseleave(function() {
			var labels = $(this).find(".views-label-value span"),
				falseLabel = $(labels[0]),
				trueLabel = $(labels[1]);

			trueLabel.css("opacity", 1)
			falseLabel.css("opacity", 1)

		});

	}

})(jQuery);