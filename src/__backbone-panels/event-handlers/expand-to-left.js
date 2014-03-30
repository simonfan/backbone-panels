define(function (require, exports, module) {


	var _ = require('lodash');

	module.exports = function expandToLeft(views, delta) {

		while (views.length > 0 && delta !== 0) {

			var view = views.shift(),
				remainder = view.expandToLeft(delta);

			view.moveToLeft(remainder);

			delta = remainder;
		}

	};

});
