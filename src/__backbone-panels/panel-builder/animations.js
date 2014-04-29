define(function (require, exports, module) {
	'use strict';

	var _ = require('lodash');

	exports.bbpOpen = function bbpOpen(direction, options) {

		this.enablePanel();

		var openWidth = parseInt(this.panels.evalMeasureX(this.model.get('openWidth'))),
			currWidth = parseInt(this.model.get('width')),
			delta = openWidth - currWidth;



		// UNSET TEMPORARY MINWIDTH
		options = options || {};
		var originalCompleteFunc = options.complete;
		options.complete = _.bind(function () {
			if (originalCompleteFunc) {
				originalCompleteFunc.apply(this.$el, arguments);
			}
			// restore min width
			if (_.isNumber(this._real_min_width_before_close_)) {
				this.model.set('minWidth', this._real_min_width_before_close_);

				delete this._real_min_width_before_close_;
			}


			this.panels.arrangePositions();

		}, this);


		return direction === 'w' ?
			this.aExpandToW(delta, options) :
			this.aExpandToE(delta, options);
	};

	exports.bbpOpenToE = function bbpOpenToE(options) {
		return this.open('e', options);
	};

	exports.bbpOpenToW = function bbpOpenToW(options) {
		return this.open('w', options);
	};



	exports.bbpClose = function bbpClose(direction, options) {

				// options
		options = options || {};

		var model = this.model;


		// delta
		var closeWidth = parseFloat(this.panels.evalMeasureX(model.get('closeWidth'))) || 0,
			currWidth = parseFloat(model.get('width')),
			delta = Math.abs(closeWidth - currWidth);



		var originalCompleteFunc = options.complete;

		options.complete = _.bind(function () {
			if (originalCompleteFunc) {
				originalCompleteFunc.apply(this.$el, arguments);
			}


			// disable the panel after the animation is complete
			this.disablePanel();


			this.panels.arrangePositions();
		}, this);

		// set temporary min width
		this._real_min_width_before_close_ = model.get('minWidth');
		model.set('minWidth', closeWidth);

		return direction === 'w' ?
			this.aContractToW(delta, options) :
			this.aContractToE(delta, options);

	};
	exports.bbpCloseToE = function bbpCloseToE(options) {
		return this.close('e', options);
	};

	exports.bbpCloseToW = function bbpCloseToW(options) {
		return this.close('w', options);
	};


	// ALIASES
	exports.open = exports.bbpOpen;
	exports.openToE = exports.bbpOpenToE;
	exports.openToW = exports.bbpOpenToW;

	exports.close = exports.bbpClose;
	exports.closeToE = exports.bbpCloseToE;
	exports.closeToW = exports.bbpCloseToW;
});
