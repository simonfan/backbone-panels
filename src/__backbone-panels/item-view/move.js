define(function (require, exports, module) {
	'use strict';

	/**
	 * Moves the Left handle
	 * +: compression
	 * -: expansion
	 *
	 * @method moveL
	 * @param delta {Number}
	 */
	exports.moveL = function moveLeftHandle(delta) {

		var model = this.model;

		var min = model.get('min-width'),
			max = model.get('max-width');

		var width = model.get('width');


		var attempted = width + delta;


		if (attempted >= min && attempted <= max) {

			model.set('width', attempted);

		} else {



		}

		return {
			remaining: 'remaining delta value'
		}
	};


	/**
	 * Moves the right handle.
	 * +: expansion
	 * -: compression
	 *
	 * @method moveR
	 * @param delta {Number}
	 */
	exports.moveR = function moveRightHandle(delta) {

	);
});
