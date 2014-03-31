define(function (require, exports, module) {
	'use strict';

	var helpers = require('./helpers');

	/**
	 * Expands the view by moving the left handle
	 * towards the left direction while maintaing
	 * the right handle at a fixed position.
	 *   --------
	 *   |<-    |
	 *   |<-    |
	 *   |<-    |
	 *   --------
	 *
	 * @method expandToLeft
	 * @param attemptedDelta {+Number}
	 */
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

	/**
	 * Expands the view by moving the right handle
	 * towards the right direction while maintaing
	 * the left handle at a fixed position.
	 *   --------
	 *   |    ->|
	 *   |    ->|
	 *   |    ->|
	 *   --------
	 *
	 * @method expandToRight
	 * @param attemptedDelta {+Number}
	 */
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
