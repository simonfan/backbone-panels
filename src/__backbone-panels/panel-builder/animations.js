define(function (require, exports, module) {
	'use strict';

	var _ = require('lodash');

	exports.open = function open(direction, options) {


	//	console.log(this.model.get('minWidth'));
		this.unfreeze();

		var openWidth = parseFloat(this.panels.evalMeasureX(this.model.get('openWidth'))),
			currWidth = parseFloat(this.model.get('width')),
			delta = Math.abs(openWidth - currWidth);


		// UNSET TEMPORARY MINWIDTH
		options = options || {};

	//	console.log(this.model.get('minWidth'));

		var originalCompleteFunc = options.complete;
		options.complete = _.bind(function() {
			if (originalCompleteFunc) {
				originalCompleteFunc.apply(this.$el, arguments);
			}

			if (!_.isUndefined(this.__before_close_minwidth__)) {
				this.model.set('minWidth', this.__before_close_minwidth__);
			}
		}, this);



		return direction === 'left' ?
			this.aExpandToLeft(delta, options) :
			this.aExpandToRight(delta, options);
	}

	exports.openToRight = function openToRight(options) {
		return this.open('right', options);
	};

	exports.openToLeft = function openToLeft(options) {
		return this.open('left', options);
	};



	exports.close = function close(direction, options) {

				// options
		options = options || {};

		var model = this.model;

		var originalCompleteFunc = options.complete;

		options.complete = _.bind(function() {
			if (originalCompleteFunc) {
				originalCompleteFunc.apply(this.$el, arguments);
			}

			console.log(this.model.get('width'))
			this.freeze();
		}, this);

		// delta
		var closeWidth = parseFloat(this.panels.evalMeasureX(model.get('closeWidth'))) || 0,
			currWidth = parseFloat(model.get('width')),
			delta = Math.abs(closeWidth - currWidth);

		// SET TEMPORARY MINWIDTH
		this.__before_close_minwidth__ = model.get('minWidth');
		model.set('minWidth', closeWidth);

		return direction === 'left' ?
			this.aContractToLeft(delta, options) :
			this.aContractToRight(delta, options);

	};
	exports.closeToRight = function closeToRight(options) {
		return this.close('right', options);
	};

	exports.closeToLeft = function closeToLeft(options) {
		return this.close('left', options);
	};
});
