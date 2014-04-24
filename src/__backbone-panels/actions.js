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


		var _panels = [];


		while (panels.length > 0 && delta !== 0) {

			var panel = panels.pop();

			if (panels.length === 0) {
				// LAST PANEL

				// this is the last panel,
				// it has to contract all the delta
				var lastRemainder = panel.contractToLeft(delta, { agent: 'panels-control' });

				// IF THERE IS A LAST REMAINDER,
				// it must go back
				if (lastRemainder) {
					while (_panels.length > 0 && lastRemainder !== 0) {
						var panel = _panels.pop();

						lastRemainder = panel.contractToLeft(lastRemainder, { agent: 'panels-control' });
					}
				}

			} else if (panel.panelEnabled()) {
				// ENABLED

				var dMove = delta / 1.5,
					dContract = delta - dMove;



				// [2] contract to the left the amount required
				var contractRemainder = panel.contractToLeft(dContract, { agent: 'panels-control' });

				// [1] move to the left the amount that
				//     is required
				var moveRemainder = panel.moveToLeft(dMove + contractRemainder, { agent: 'panels-control' });

				// [4] update the global delta
				delta -= (dContract - contractRemainder);
			} else {
				// DISABLED

				panel.moveToLeft(delta, { agent: 'panels-control' });

			}

			_panels.push(panel);
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


		var moveoptions = {
			agent: 'panels-control'
		};


		var _panels = [];

		while (panels.length > 0 && delta > 0) {

			// get the first panel from the panels to the right
			var panel = panels.shift();

			_panels.push(panel);

			if (panels.length === 0) {
				// this is the last panel,
				// it has to contract all the delta
				var lastRemainder = panel.contractToRight(delta, moveoptions);

				while (_panels.length > 0 && lastRemainder !== 0) {
					_panels.pop().contractToRight(lastRemainder, moveoptions);
				}

			} else if (panel.panelEnabled()) {

				// PANEL ENABLED

				var dMove = delta / 1.5,
					dContract = delta - dMove;


				// [2] contract to the left the amount required
				var contractRemainder = panel.contractToRight(dContract, moveoptions);

				// [1] move to the left the amount that
				//     is required
  				var moveRemainder = panel.moveToRight(dMove + contractRemainder, moveoptions);

				// [4] update the global delta
				delta -= (dContract - contractRemainder);
			} else {
				// PANEL DISABLED

				panel.moveToRight(delta, moveoptions);

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

		var moveoptions = {
			agent: 'panels-control'
		};

		while (panels.length > 0 && delta !== 0) {

			// get the first panel from the panels to the right
			var panel = panels.shift();

			if (panels.length === 0) {
				// this is the last panel,
				// it has to contract all the delta
				delta = panel.expandToLeft(delta, moveoptions);

			} else if (panel.panelEnabled()) {

				// PANEL ENABLED

				var dMove = delta / 1.5,
					dExpand = delta - dMove;


				// [2] contract to the left the amount required
				var expandRemainder = panel.expandToLeft(dExpand, moveoptions);

				// [1] move to the left the amount that
				//     is required
				var moveRemainder = panel.moveToLeft(dMove + expandRemainder, moveoptions);

				// [4] update the global delta
				delta -= (dExpand - expandRemainder);

			} else {
				// PANEL DISABLED

				panel.moveToLeft(delta, moveoptions);

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

		var moveoptions = {
			agent: 'panels-control'
		};

		var _panels = [];

		while (panels.length > 0 && delta !== 0) {


			var panel = panels.pop();

			_panels.push(panel);

			if (panels.length === 0) {
				// this is the last panel,
				// it has to contract all the delta
				var lastRemainder = panel.expandToRight(delta, { agent: 'panels-control' });

				while (_panels.length > 0 && lastRemainder) {

			//		console.log(lastRemainder);
					lastRemainder = _panels.pop().expandToRight(lastRemainder, {agent: 'panels-control'});
				}

				console.log(lastRemainder);

			} else if (panel.panelEnabled()) {

				var dMove = delta / 1.5,
					dExpand = delta - dMove;


				// [2] contract to the left the amount required
				var expandRemainder = panel.expandToRight(dExpand, { agent: 'panels-control' });


				// [1] move to the left the amount that
				//     is required
				var moveRemainder = panel.moveToRight(dMove + expandRemainder, { agent: 'panels-control' });

				// [4] update the global delta
				delta -= (dExpand - expandRemainder);

			} else {


				panel.moveToRight(delta);
			}
		}
	};
});
