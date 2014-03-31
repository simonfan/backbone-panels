define(function (require, exports, module) {
	'use strict';


	var helpers = require('./helpers');

	/**
	 * Contracts the view by moving the left handle
	 * towards the right direction while maintaining
	 * the right handle at a fixed position.
	 *   --------
	 * ->|      |
	 * ->|      |
	 * ->|      |
	 *   --------
	 *
	 * @method contractToRight
	 * @param attemptedDelta {+Number}
	 */
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

	/**
	 * Contracts the view by moving the right handle
	 * towards the left direction while maintaing the
	 * left handle at a fixed position.
	 *   --------
	 *   |      |<-
	 *   |      |<-
	 *   |      |<-
	 *   --------
	 *
	 * @method contractToLeft
	 * @param attemptedDelta {+Number}
	 */
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
