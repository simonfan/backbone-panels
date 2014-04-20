define(function (require, exports, module) {
	'use strict';

	var _ = require('lodash');

	exports.open = function open(direction, options) {

		this.enablePanel();

		var openWidth = parseFloat(this.panels.evalMeasureX(this.model.get('openWidth'))),
			currWidth = parseFloat(this.model.get('width')),
			delta = Math.abs(openWidth - currWidth);

		return direction === 'left' ?
			this.aExpandToLeft(delta, options) :
			this.aExpandToRighr(delta, options);
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

		var originalCompleteFunc = options.complete;

		options.complete = _.bind(function() {
			if (originalCompleteFunc) {
				originalCompleteFunc.apply(this.$el, arguments);
			}

			this.disablePanel();
		}, this);

		// delta
		var closeWidth = parseFloat(this.panels.evalMeasureX(this.model.get('closeWidth'))) || 0,
			currWidth = parseFloat(this.model.get('width')),
			delta = Math.abs(closeWidth - currWidth);

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
