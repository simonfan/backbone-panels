define(function (require, exports, module) {


	var _ = require('lodash');

	/**
	 * Resize event handler.
	 * Invokes all other steps.
	 *
	 * @method handleResize
	 */
	exports.handleResize = function handleResize(model, movement) {

		// retrieve movement data.
		movement = movement.data();

		var delta = movement.delta;

		if (movement.action === 'expand') {
			// compress other guys

			if (movement.handle === 'left') {
				// compress before

				var before = this.before(model);

				this.compressLeft(before, delta);

			} else if (movement.handle === 'right') {
				// compress after
				var after = this.after(model);

				this.compressRight(after, delta);

			}

		} else if (movement.action === 'compress') {
			// expand other guys
			if (movement.handle === 'left') {
				// expand before

				var before = this.before(model);

				this.expandLeft(before, delta);

			} else if (movement.handle === 'right') {
				// expand after
				var after = this.after(model);

				this.expandRight(after, delta);

			}
		}

	};




	exports.compressLeft = function compressLeft(models, delta) {

		_.each(models, function (model) {

			var min = model.get('min-width'),
				width = model.get('width');



		}, this);

	};


	exports.compressRight = function compressRight(models, delta) {

	};

	exports.expandRight = function expandRight(models, delta) {
		// body...
	};

	exports.expandLeft = function expandLeft(models, delta) {

	};

});
