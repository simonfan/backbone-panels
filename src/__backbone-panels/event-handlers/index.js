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
	 * @method handleResize
	 */
	exports.handleResize = function handleResize(panel, movement) {
		// retrieve movement data.
		movement = movement.data();

		var index = panel.index,
			delta = Math.abs(movement.delta);

		if (movement.action === 'expand') {
			// contract other guys

			if (movement.handle === 'left') {
				// contract before

				var before = this.before(index);

				this.contractToLeft(before, delta);

			} else if (movement.handle === 'right') {
				// contract after
				var after = this.after(index);

				this.contractToRight(after, delta);

			}

		} else if (movement.action === 'contract') {

			// expand other guys
			if (movement.handle === 'left') {
				// expand before

				var before = this.before(index);

				this.expandToRight(before, delta);

			} else if (movement.handle === 'right') {
				// expand after
				var after = this.after(index);

				this.expandToLeft(after, delta);
			}
		}

	};

	exports.contractToLeft = require('./contract-to-left');
	exports.contractToRight = require('./contract-to-right');
	exports.expandToRight = require('./expand-to-right');
	exports.expandToLeft = require('./expand-to-left');

});
