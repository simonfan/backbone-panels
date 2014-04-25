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
	 *
	 *
	 * @param data {Object}
	 *     @param index
	 *     @param panel
	 *     @param panels
	 *     @param operation
	 *     @param eventData
	 */
	exports.calcPanelElasticity = function calcPanelElasticity(d) {
		var panelElasticity = parseFloat(d.panel.model.get('elasticity'));

		return !isNaN(panelElasticity) ? panelElasticity : this.controlOptions.elasticity;
	},

	exports.controlOptions = {
		agent: 'panels-control',
		elasticity: 0.3,
	};

	function generateController(_o) {

		/**
		 * _o:
		 *     loopDirection: 'shift' | 'pop'
		 *     move:
		 *     absorb:
		 *
		 */

		return function controller(panels, delta, edata) {

			var coptions = this.controlOptions;

			// [0] variable to hold panels to be looped through
			//     array direction is controlled by loopDirection option
			var loop = _.clone(panels);
			if (_o.loopDirection === -1) {
				loop.reverse();
			}

			// [1] variable to hold panels that were
			//     sized once.
			var _panels = [];

			// [2] loop through panels
			while (loop.length && delta !== 0) {

				// [2.1] get the loop panel to be sized
				var panel = loop.pop();

				// [2.2] check panel status
				if (panel.panelEnabled()) {
					// [2.2-A] panel ENABLED

					// Add the panel to the list of 'sized panels'
					_panels.push(panel);

					if (loop.length === 0) {
						// [A-1] LAST PANEL

						// this is the last panel, it should absorb the rest
						// of the delta by either contracting or expanding

						delta = panel[_o.absorb](delta, coptions);

					} else {




						var elasticity = this.calcPanelElasticity({
							index: panels.length - loop.length - 1,
							panel: panel,
							panels: panels,
							operation: _o.operation,
							eventData: edata,
						});

						// [A-2] NORMAL PANEL

						// [A-2.1] Separate delta into movement and absorption
						var dAbsorb = delta * elasticity,
							dMove = delta - dAbsorb;

						// [A-2.2] Absorb
						var absorbRemainder = panel[_o.absorb](dAbsorb, coptions);

						// [A-2.3] Move
						var moveRemainder = panel[_o.move](dMove + absorbRemainder, coptions);

						// [A-2.4] update the global delta
						//         by subtracting the delta that was absorbed
						delta -= (dAbsorb - absorbRemainder);
					}


				} else {
					// [2.2-B] panel DISABLED
					//     Just move it.
					//     Do not alter the delta at all.
					panel[_o.move](delta, coptions);
				}

			}


			// [3] If there is still delta to be absorbed,
			//     divide it among all panels
			if (delta) {
				while (_panels.length > 0 && delta !== 0) {
					var panel = _panels.pop();

					delta = panel[_o.absorb](delta, coptions);
				}
			}

/*
			console.log('---remaining delta---')
			console.log(delta);
			console.log('---remaining delta---')
*/
		}

	};


	/**
	 * Invoked whenever the panels to the left of a panel
	 * have to be contracted towards the left.
	 * It is a response to left-expansion on a panel.
	 *
	 * @method contractToLeft
	 * @param panels {Array of panels}
	 * @param delta {Number}
	 */
	exports.contractPanelsToLeft = generateController({
		absorb: 'contractToLeft',
		move: 'moveToLeft',
		loopDirection: 1,
		operation: 'contract',
	});

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
	exports.contractPanelsToRight = generateController({
		absorb: 'contractToRight',
		move: 'moveToRight',
		loopDirection: -1,
		operation: 'contract',
	});

	/**
	 * Invoked whenever the panels to the right of a panel
	 * have to be expanded towards the left.
	 * It is a response to right-contraction on a panel.
	 *
	 * @method expandToLeft
	 * @param panels {Array of panel panels}
	 * @param delta {Number}
	 */
	exports.expandPanelsToLeft = generateController({
		absorb: 'expandToLeft',
		move: 'moveToLeft',
		loopDirection: -1,
		operation: 'expand',
	});


	/**
	 * Invoked whenever the panels to the left of a panel
	 * have to be contracted towards the right.
	 * It is a response to left-contraction on a panel.
	 *
	 * @method expandPanelsToRight
	 * @param panels {Array of panel panels}
	 * @param delta {Number}
	 */
	exports.expandPanelsToRight = generateController({
		absorb: 'expandToRight',
		move: 'moveToRight',
		loopDirection: +1,
		operation: 'expand'
	});
});
