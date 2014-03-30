define(function (require, exports, module) {


	var _ = require('lodash');

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
