/**
 * Logic for dealing with panel resizing
 *
 * @module backbone-panels
 * @submolude event-handlers
 */
define(function (require, exports, module) {
	'use strict';

	var _ = require('lodash');

	/**
	 * Resize event handler.
	 * Invokes all other steps.
	 *
	 * @method handlePanelResize
	 */
	exports.handlePanelResize = function handlePanelResize(panel, edata) {

		if (edata.agent !== 'panels-control') {

			var index = this.panelIndex(panel),
				delta = Math.abs(edata.delta),
				before, after;

			// add panel to edata
			edata.panel = panel;

			if (edata.action === 'expand') {
				// contract other guys

				if (edata.handle === 'w') {
					// contract before

					before = this.before(index);

					this.contractPanelsToLeft(before, delta, edata);

				} else if (edata.handle === 'e') {
					// contract after
					after = this.after(index);

					this.contractPanelsToRight(after, delta, edata);

				}

			} else if (edata.action === 'contract') {

				// expand other guys
				if (edata.handle === 'w') {
					// expand before

					before = this.before(index);

					this.expandPanelsToRight(before, delta, edata);

				} else if (edata.handle === 'e') {
					// expand after
					after = this.after(index);

					this.expandPanelsToLeft(after, delta, edata);
				}
			}

		}

	};

	exports.handlePanelResizeStart = function handlePanelResizeStart(panel, edata) {

	};

	exports.handlePanelResizeStop = function handlePanelResizeStop(panel, edata) {
	//	this.arrange();
	};
});
