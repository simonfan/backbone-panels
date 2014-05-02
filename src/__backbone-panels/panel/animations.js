define(function (require, exports, module) {
	'use strict';

	var _ = require('lodash');

	/**
	 *
	 *
	 * @method bbpOpen
	 * @param direction {String} Direction to which move
	 * @param options {Object} Animation options
	 */
	exports.bbpOpen = function bbpOpen(direction, options) {

		this.bbpEnablePanel();

		var openWidth = parseInt(this.panels.evalMeasureX(this.modeld.get('openWidth'))),
			currWidth = parseInt(this.modeld.get('width')),
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
				this.modeld.set('minWidth', this._real_min_width_before_close_);

				delete this._real_min_width_before_close_;
			}


			this.panels.arrangePositions();

		}, this);


		return direction === 'w' ?
			this.aExpandToW(delta, options) :
			this.aExpandToE(delta, options);
	};

	/**
	 * Partial to 'e'
	 *
	 * @method bbpOpenToE
	 * @param options
	 */
	exports.bbpOpenToE = _.partial(exports.bbpOpen, 'e');


	/**
	 * Partial to 'w'
	 *
	 * @method bbpOpenToW
	 * @param options
	 */
	exports.bbpOpenToW = _.partial(exports.bbpOpen, 'w');

	// ALIASES
	exports.openToE = exports.bbpOpenToE;
	exports.openToW = exports.bbpOpenToW;


	/**
	 *
	 *
	 * @method bbpClose
	 * @param direction {String}
	 * @param options {Object}
	 */
	exports.bbpClose = function bbpClose(direction, options) {

				// options
		options = options || {};

		var modeld = this.modeld;


		// delta
		var closeWidth = parseFloat(this.panels.evalMeasureX(modeld.get('closeWidth'))) || 0,
			currWidth = parseFloat(modeld.get('width')),
			delta = Math.abs(closeWidth - currWidth);



		var originalCompleteFunc = options.complete;

		options.complete = _.bind(function () {
			if (originalCompleteFunc) {
				originalCompleteFunc.apply(this.$el, arguments);
			}


			// disable the panel after the animation is complete
	//		this.bbpDisablePanel();


			this.panels.arrangePositions();
		}, this);

		// set temporary min width
		this._real_min_width_before_close_ = modeld.get('minWidth');
		modeld.set('minWidth', closeWidth);

		return direction === 'w' ?
			this.aContractToW(delta, options) :
			this.aContractToE(delta, options);

	};

	/**
	 * Partial.
	 * @method bbpCloseToE
	 */
	exports.bbpCloseToE = _.partial(exports.bbpClose, 'e');

	/**
	 * Partial
	 * @method bbpCloseToW
	 */
	exports.bbpCloseToW = _.partial(exports.bbpClose, 'w');

	// ALIASES
	exports.closeToE = exports.bbpCloseToE;
	exports.closeToW = exports.bbpCloseToW;





	/**
	 * Calculates the opening direction based on the index of the panel
	 *
	 * @method calcOpenDirection
	 *
	 */
	function calcOpenDirection() {

		var type = this.panels.panelType(this);

		if (type === 'only') {
			return false;
		} else {
			return type === 'tail' ? 'w' : 'e';
		}
	}

	/**
	 * Calculates the closing direction based on the index of the panel.
	 *
	 * @method calcCloseDirection
	 */
	function calcCloseDirection() {

		var type = this.panels.panelType(this);


		if (type === 'only') {
			return false;
		} else {
			return type === 'tail' ? 'e' : 'w';
		}
	}

	/**
	 * Intelligent open
	 * Returns false if not able to open.
	 *
	 * @method open
	 *
	 */
	exports.open = function open(options) {

		var direction = this.modeld.get('openDirection') || calcOpenDirection.call(this);

		return direction ? this.bbpOpen(direction, options) : direction;
	};

	/**
	 *
	 * Intelligent close.
	 * Returns false if not able to close
	 *
	 * @method close
	 */
	exports.close = function close(options) {

		var direction = this.modeld.get('closeDirection') || calcCloseDirection.call(this);

		return direction ? this.bbpClose(direction, options) : direction;
	};
});
