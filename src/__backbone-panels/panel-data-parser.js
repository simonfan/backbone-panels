define(function (require, exports, module) {
	'use strict';

	var _ = require('lodash');


	// private
	var isPercentage = /[0-9.]+%/,
		measures = {
			x: [
				'minLeft', 'left', 'maxLeft',
				'minWidth', 'width', 'maxWidth'
			],
			y: [
				'minTop', 'top', 'maxTop',
				'minHeight', 'height', 'maxHeight',
			],
		};

	module.exports = function panelDataParser(data) {

		var width = this.$el.width(),
			height = this.$el.height();

		// parse x-axis percentual measures
		_.each(measures.x, function (measure) {
			if (data[measure] && isPercentage.test(data[measure])) {

				var percentual = parseFloat(data[measure]) * 1 / 100;

				data[measure] = percentual * width;
			}
		});

		// parse y-axis percentual measure
		_.each(measures.y, function (measure) {

			if (data[measure] && isPercentage.test(data[measure])) {

				var percentual = parseFloat(data[measure]) * 1 / 100;

				data[measure] = percentual * height;
			}
		});

		return data;
	};

});
