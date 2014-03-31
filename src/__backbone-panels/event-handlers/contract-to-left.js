define(function (require, exports, module) {


	var _ = require('lodash');

	/**
	 * Invoked whenever the panels to the left of a panel
	 * have to be contracted towards the left.
	 * It is a response to left-expansion on a panel.
	 *
	 * @method contractToLeft
	 * @param views {Array of panel views}
	 * @param delta {Number}
	 */
	module.exports = function contractToLeft(views, delta) {

		while (views.length > 0 && delta !== 0) {

			var view = views.pop();

			// [1] move the left border of the adjacent panel
			var remainder = view.contractToLeft(delta);

			// [2] if there is a remainder,
			// move the panel as a whole in that direction
			view.moveToLeft(remainder);

			delta = remainder;
		}

	};

});
