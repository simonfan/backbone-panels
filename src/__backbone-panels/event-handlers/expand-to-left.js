define(function (require, exports, module) {


	var _ = require('lodash');

	/**
	 * Invoked whenever the panels to the right of a panel
	 * have to be expanded towards the left.
	 * It is a response to right-contraction on a panel.
	 *
	 * @method expandToLeft
	 * @param views {Array of panel views}
	 * @param delta {Number}
	 */
	module.exports = function expandToLeft(views, delta) {

		while (views.length > 0 && delta !== 0) {

			var view = views.shift(),
				remainder = view.expandToLeft(delta);

			view.moveToLeft(remainder);

			delta = remainder;
		}

	};

});
