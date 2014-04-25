define(function (require, exports, module) {
	'use strict';

	var _ = require('lodash');

	exports.open = function open(direction, options) {


		var openWidth = parseFloat(this.panels.evalMeasureX(this.model.get('openWidth'))),
			currWidth = parseFloat(this.model.get('width')),
			delta = openWidth - currWidth;


		// UNSET TEMPORARY MINWIDTH
		options = options || {};

		return direction === 'w' ?
			this.aExpandToW(delta, options) :
			this.aExpandToE(delta, options);
	}

	exports.openToRight = function openToRight(options) {
		return this.open('e', options);
	};

	exports.openToLeft = function openToLeft(options) {
		return this.open('w', options);
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
		}, this);

		// delta
		var closeWidth = parseFloat(this.panels.evalMeasureX(model.get('closeWidth'))) || 0,
			currWidth = parseFloat(model.get('width')),
			delta = closeWidth - currWidth;

		// set temporary min width
		this._real_min_width_before_close_ = model.get('minWidth');
		model.set('minWidth', closeWidth);

		return direction === 'w' ?
			this.aContractToW(delta, options) :
			this.aContractToE(delta, options);

	};
	exports.closeToRight = function closeToRight(options) {
		return this.close('e', options);
	};

	exports.closeToLeft = function closeToLeft(options) {
		return this.close('w', options);
	};
});
