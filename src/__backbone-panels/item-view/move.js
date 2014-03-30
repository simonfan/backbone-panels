define(function (require, exports, module) {
	'use strict';


	var helpers = require('./helpers');


	exports.moveToLeft = function moveToLeft(attemptedDelta) {

		var model = this.model,
			currentLeft = model.get('left');

		var delta = helpers.maxSubtraction({
			subtraction: attemptedDelta,
			currValue: currentLeft,
			minValue: model.get('min-left')
		});

		model.set('left', currentLeft - delta);

		return attemptedDelta - delta;
	};


	exports.moveToRight = function moveToRight(attemptedDelta) {

		var model = this.model,
			currentLeft = model.get('left');

		var delta = helpers.maxAddition({
			addition: attemptedDelta,
			currValue: currentLeft,
			maxValue: model.get('max-left')
		});

		model.set('left', currentLeft + delta);

		return attemptedDelta - delta;
	};
});
