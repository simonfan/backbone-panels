define(function (require, exports, module) {
	'use strict';

	var isPercentage = /[0-9.]+%/;

	exports.evalMeasureX = function evalMeasureX(measure) {

		if (isPercentage.test(measure)) {

			var percentual = parseFloat(measure) * 1 / 100;

			measure = percentual * this.$el.width();

		}

		return measure;
	};

	exports.evalMeasureY = function evalMeasureY(measure) {

		if (isPercentage.test(measure)) {

			var percentual = parseFloat(measure) * 1 / 100;

			measure = percentual * this.$el.height();

		}

		return measure;
	};
});
