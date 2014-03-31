define(function (require, exports, module) {


	var _ = require('lodash');

	/**
	 * Invoked whenever the panels to the left of a panel
	 * have to be contracted towards the right.
	 * It is a response to left-contraction on a panel.
	 *
	 * @method contractToLeft
	 * @param views {Array of panel views}
	 * @param delta {Number}
	 */
	module.exports = function expandToRight(views, delta) {

		while (views.length > 0 && delta !== 0) {

			var view = views.pop(),
				remainder = view.expandToRight(delta);

			view.moveToRight(remainder);

			delta = remainder;
		}

	};
});
