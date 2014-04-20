/**
 * Logic for dealing with panel resizing
 *
 * @module backbone-panels
 * @submolude actions
 */
define(function (require, exports, module) {
	'use strict';

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

			if (panels.length === 0) {
				// this is the last panel,
				// it has to contract all the delta
				delta = panel.contractToLeft(delta, { agent: 'panels-control' });

			} else {

				var dMove = delta / 1.5,
					dContract = delta - dMove;


				// [1] move to the left the amount that
				//     is required
				var moveRemainder = panel.moveToLeft(dMove, { agent: 'panels-control' });


				// [2] contract to the left the amount required
				var contractRemainder = panel.contractToLeft(dContract + moveRemainder, { agent: 'panels-control' });

				// [3] the remainders from the contract operation
				//     should go over to movement
				if (contractRemainder) {
					panel.moveToLeft(contractRemainder, { agent: 'panels-control' });
				}

				// [4] update the global delta
				delta = dMove + contractRemainder;
			}
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

			if (panels.length === 0) {
				// this is the last panel,
				// it has to contract all the delta
				delta = panel.contractToRight(delta, { agent: 'panels-control' });

			} else {

				var dMove = delta / 1.5,
					dContract = delta - dMove;


				// [1] move to the left the amount that
				//     is required
				var moveRemainder = panel.moveToRight(dMove, { agent: 'panels-control' });


				// [2] contract to the left the amount required
				var contractRemainder = panel.contractToRight(dContract + moveRemainder, { agent: 'panels-control' });

				// [3] the remainders from the contract operation
				//     should go over to movement
				if (contractRemainder) {
					panel.moveToRight(contractRemainder, { agent: 'panels-control' });
				}

				// [4] update the global delta
				delta = dMove + contractRemainder;
			}
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

			// get the first panel from the panels to the right
			var panel = panels.shift();

			if (panels.length === 0) {
				// this is the last panel,
				// it has to contract all the delta
				delta = panel.expandToLeft(delta, { agent: 'panels-control' });

			} else {

				var dMove = delta / 1.5,
					dContract = delta - dMove;


				// [1] move to the left the amount that
				//     is required
				var moveRemainder = panel.moveToLeft(dMove, { agent: 'panels-control' });


				// [2] contract to the left the amount required
				var contractRemainder = panel.expandToLeft(dContract + moveRemainder, { agent: 'panels-control' });

				// [3] the remainders from the contract operation
				//     should go over to movement
				if (contractRemainder) {
					panel.moveToLeft(contractRemainder, { agent: 'panels-control' });
				}

				// [4] update the global delta
				delta = dMove + contractRemainder;
			}
		}

	};

	/**
	 * Invoked whenever the panels to the left of a panel
	 * have to be contracted towards the right.
	 * It is a response to left-contraction on a panel.
	 *
	 * @method expandPanelsToRight
	 * @param panels {Array of panel panels}
	 * @param delta {Number}
	 */
	exports.expandPanelsToRight = function expandPanelsToRight(panels, delta) {

		while (panels.length > 0 && delta !== 0) {


			var panel = panels.pop();

			if (panels.length === 0) {
				// this is the last panel,
				// it has to contract all the delta
				delta = panel.expandToRight(delta, { agent: 'panels-control' });

			} else {

				var dMove = delta / 1.5,
					dContract = delta - dMove;


				// [1] move to the left the amount that
				//     is required
				var moveRemainder = panel.moveToRight(dMove, { agent: 'panels-control' });


				// [2] contract to the left the amount required
				var contractRemainder = panel.expandToRight(dContract + moveRemainder, { agent: 'panels-control' });

				// [3] the remainders from the contract operation
				//     should go over to movement
				if (contractRemainder) {
					panel.moveToRight(contractRemainder, { agent: 'panels-control' });
				}

				// [4] update the global delta
				delta = dMove + contractRemainder;
			}
		}
	};
});
