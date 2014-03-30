define(function (require, exports, module) {
	'use strict';

	var helpers = require('./helpers');




	exports.expandToLeft = function expandToLeft(attemptedDelta) {
		var model = this.model,
			currentWidth = model.get('width'),
			currentLeft = model.get('left');

		var delta = helpers.maxAddition({
			addition: attemptedDelta,
			currValue: currentWidth,
			maxValue: model.get('max-width')
		});

		model.set({
			width: currentWidth + delta,
			left: currentLeft - delta
		});

		return attemptedDelta - delta;
	};

	exports.expandToRight = function expandToRight(attemptedDelta) {
		var model = this.model,
			currentWidth = model.get('width');

		var delta = helpers.maxAddition({
			addition: attemptedDelta,
			currValue: currentWidth,
			maxValue: model.get('max-width')
		});

		model.set({
			width: currentWidth + delta
		});

		return attemptedDelta - delta;
	};

});
