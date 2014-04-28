/**
 * Logic for positioning the panels at the right starting place.
 *
 * @module backbone-panels
 * @submodule positioners
 */
define(function (require, exports, module) {
	'use strict';

	var _ = require('lodash');

	/**
	 * Returns the left position at which a given
	 * panel should be placed.
	 *
	 * @method calculateLeftPos
	 * @param panel {Bakcbone Model}
	 */
	function calculateLeftPos(index) {
		return this.reduceBefore(index, function (value, panel) {
			return value + panel.get('width');
		}, 0);
	}





	/**
	 * Set the place for the panel.
	 *
	 * @method postitionPanel
	 * @param panel {Backbone Model}
	 */
	module.exports = _.throttle(function arrangePositions() {

	//	console.log('arrange positions')

		this.each(function (panel, index) {


			var left = calculateLeftPos.call(this, index);

			panel.model.set({
				left: left,
				top: 0
			});

		}, this);


		return this;
	}, 50);
});
