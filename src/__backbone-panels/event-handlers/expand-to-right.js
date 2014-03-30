define(function (require, exports, module) {


	var _ = require('lodash');

	module.exports = function expandToRight(views, delta) {

		while (views.length > 0 && delta !== 0) {

			var view = views.pop(),
				remainder = view.expandToRight(delta);

			view.moveToRight(remainder);

			delta = remainder;
		}

	};
});
