define(function (require, exports, module) {
	'use strict';


	var helpers = require('./helpers');


	exports.contractToRight = function contractToRight(attemptedDelta) {
		var model = this.model,
			currentWidth = model.get('width'),
			currentLeft = model.get('left');

		var delta = helpers.maxSubtraction({
			subtraction: attemptedDelta,
			currValue: currentWidth,
			minValue: model.get('min-width')
		});

		model.set({
			width: currentWidth - delta,
			left: currentLeft + delta
		});

		return attemptedDelta - delta;
	};

	exports.contractToLeft = function contractToLeft(attemptedDelta) {
		var model = this.model,
			currentWidth = model.get('width');

		var delta = helpers.maxSubtraction({
			subtraction: attemptedDelta,
			currValue: currentWidth,
			minValue: model.get('min-width')
		});

		model.set({
			width: currentWidth - delta
		});

		return attemptedDelta - delta;
	};
});
