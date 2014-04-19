/**
 * Logic for dealing with panel resizing
 *
 * @module backbone-panels
 * @submolude event-handlers
 */
define(function (require, exports, module) {


	var _ = require('lodash');

	/**
	 * Resize event handler.
	 * Invokes all other steps.
	 *
	 * @method handlePanelResize
	 */
	exports.handlePanelResize = function handlePanelResize(panel, edata) {
		var index = this.panelIndex(panel),
			delta = Math.abs(edata.delta);

		if (edata.agent !== 'panels-control') {



			if (edata.action === 'expand') {
				// contract other guys

				if (edata.handle === 'w') {
					// contract before

					var before = this.before(index);

					this.contractPanelsToLeft(before, delta);

				} else if (edata.handle === 'e') {
					// contract after
					var after = this.after(index);

					this.contractPanelsToRight(after, delta);

				}

			} else if (edata.action === 'contract') {

				// expand other guys
				if (edata.handle === 'w') {
					// expand before

					var before = this.before(index);

					this.expandPanelsToRight(before, delta);

				} else if (edata.handle === 'e') {
					// expand after
					var after = this.after(index);

					this.expandPanelsToLeft(after, delta);
				}
			}

		}

	};

	exports.handlePanelResizeStart = function handlePanelResizeStart(panel, edata) {

	};

	exports.handlePanelResizeStop = function handlePanelResizeStop(panel, edata) {

	};
});
