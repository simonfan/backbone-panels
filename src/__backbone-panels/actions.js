/**
 * Logic for dealing with panel resizing
 *
 * @module backbone-panels
 * @submolude actions
 */
define(function (require, exports, module) {


	var _ = require('lodash');

	/**
	 * Invoked whenever the panels to the left of a panel
	 * have to be contracted towards the left.
	 * It is a response to left-expansion on a panel.
	 *
	 * @method contractToLeft
	 * @param panels {Array of panels}
	 * @param delta {Number}
	 */
	exports.contractPanelsToLeft = function contractPanelsToLeft(panels, delta) {

		while (panels.length > 0 && delta !== 0) {

			var panel = panels.pop();

			// [1] move the left border of the adjacent panel
			var remainder = panel.contractToLeft(delta, { agent: 'panels-control' });

			// [2] if there is a remainder,
			// move the panel as a whole in that direction
			panel.moveToLeft(remainder, { agent: 'panels-control' });

			delta = remainder;
		}

	};

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
	exports.contractPanelsToRight = function contractPanelsToRight(panels, delta) {
		while (panels.length > 0 && delta > 0) {

			// get the first panel from the panels to the right
			var panel = panels.shift();

			var remainder = panel.contractToRight(delta, { agent: 'panels-control' });

			panel.moveToRight(remainder, { agent: 'panels-control' });

			delta = remainder;
		}
	};

	/**
	 * Invoked whenever the panels to the right of a panel
	 * have to be expanded towards the left.
	 * It is a response to right-contraction on a panel.
	 *
	 * @method expandToLeft
	 * @param panels {Array of panel panels}
	 * @param delta {Number}
	 */
	exports.expandPanelsToLeft = function expandPanelsToLeft(panels, delta) {

		while (panels.length > 0 && delta !== 0) {

			var panel = panels.shift(),
				remainder = panel.expandToLeft(delta, { agent: 'panels-control' });

			panel.moveToLeft(remainder, { agent: 'panels-control' });

			delta = remainder;
		}

	};

	/**
	 * Invoked whenever the panels to the left of a panel
	 * have to be contracted towards the right.
	 * It is a response to left-contraction on a panel.
	 *
	 * @method contractToLeft
	 * @param panels {Array of panel panels}
	 * @param delta {Number}
	 */
	exports.expandPanelsToRight = function expandPanelsToRight(panels, delta) {

		while (panels.length > 0 && delta !== 0) {

			var panel = panels.pop(),
				remainder = panel.expandToRight(delta, { agent: 'panels-control' });

			panel.moveToRight(remainder, { agent: 'panels-control' });

			delta = remainder;
		}
	};
});
