define(function (require, exports, module) {


	var _ = require('lodash');


	/**
	 * This method is called whenever a panel
	 * is on expansion towards the Right side,
	 * so that the panels right to it have to contract
	 *
	 *
	 * @method contractToRight
	 * @param panels {Array of panelViews}
	 * @param delta {+Number}
	 */
	module.exports = function contractToRight(panels, delta) {

		while (panels.length > 0 && delta > 0) {

			// get the first panel from the panels to the right
			var view = panels.shift();

			var remainder = view.contractToRight(delta);

			view.moveToRight(remainder);

			delta = remainder;
		}

	};

});
