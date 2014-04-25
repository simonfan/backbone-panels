define(function (require, exports, module) {
	'use strict';

	var _ = require('lodash');

	exports.open = function open(direction, options) {

		this.enablePanel();

		var openWidth = parseInt(this.panels.evalMeasureX(this.model.get('openWidth'))),
			currWidth = parseInt(this.model.get('width')),
			delta = openWidth - currWidth;



		// UNSET TEMPORARY MINWIDTH
		options = options || {};
		var originalCompleteFunc = options.complete;
		options.complete = _.bind(function() {
			if (originalCompleteFunc) {
				originalCompleteFunc.apply(this.$el, arguments);
			}
			// restore min width
			if (_.isNumber(this._real_min_width_before_close_)) {
				this.model.set('minWidth', this._real_min_width_before_close_);

				delete this._real_min_width_before_close_;
			}

		}, this);


		return direction === 'w' ?
			this.aExpandToW(delta, options) :
			this.aExpandToE(delta, options);
	}

	exports.openToE = function openToE(options) {
		return this.open('e', options);
	};

	exports.openToW = function openToW(options) {
		return this.open('w', options);
	};



	exports.close = function close(direction, options) {

				// options
		options = options || {};

		var model = this.model;


		// delta
		var closeWidth = parseFloat(this.panels.evalMeasureX(model.get('closeWidth'))) || 0,
			currWidth = parseFloat(model.get('width')),
			delta = Math.abs(closeWidth - currWidth);



		var originalCompleteFunc = options.complete;

		options.complete = _.bind(function() {
			if (originalCompleteFunc) {
				originalCompleteFunc.apply(this.$el, arguments);
			}


			// disable the panel after the animation is complete
			this.disablePanel();
		}, this);

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
