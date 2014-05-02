/**
 * This module controls how data is processed from DOM to the model.
 *
 * @submodule parse-data
 *
 */

define('__backbone-panels/panel/parse-data',['require','exports','module','lodash'],function (require, exports, module) {
	

	var _ = require('lodash');


	// private
	var measures = {
			x: {
				bbpMinLeft:      'minLeft',
				bbpLeft:         'left',
				bbpMaxLeft:      'maxLeft',
				bbpMinWidth:     'minWidth',
				bbpWidth:        'width',
				bbpMaxWidth:     'maxWidth',
				bbpDefaultWidth: 'defaultWidth',

				bbpOpenWidth:    'openWidth',
			},
			y: {
				bbpMinTop:       'minTop',
				bbpTop:          'top',
				bbpMaxTop:       'maxTop',
				bbpMinHeight:    'minHeight',
				bbpHeight:       'height',
				bbpMaxHeight:    'maxHeight',
			},
		};

	/**
	 *
	 *
	 * This method retrieves the configuration data for
	 * a single panel from the DOM element
	 *
	 * All data returned from this method will be directly set to
	 * the model.
	 *
	 * @method parseData
	 */
	module.exports = function parseData() {

		var data = this.$el.data(),
			d = {};

		// parse x-axis percentual measures
		_.each(measures.x, function (measure, dataKey) {
			d[measure] = this.panels.evalMeasureX(data[dataKey]);
		}, this);

		// parse y-axis percentual measure
		_.each(measures.y, function (measure, dataKey) {
			d[measure] = this.panels.evalMeasureY(data[dataKey]);
		}, this);

		// elasticity
		d.elasticity = data.bbpElasticity;

		// set defaults
		d.panelStatus = data.bbpStatus;

		return d;
	};

});

define('__backbone-panels/panel/animations',['require','exports','module','lodash'],function (require, exports, module) {
	

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

define('__backbone-panels/panel/enable-disable',['require','exports','module'],function (require, exports, module) {
	

	exports._initializePanelEnableDisable = function _initializePanelEnableDisable() {

		this.listenTo(this.modeld, 'change:panelStatus', function (model) {

			if (this.bbpPanelEnabled()) {
				// enabled
				this.enableResizable();

				// [3] set classes
				this.$el
					.addClass(this.panelClass + '-enabled')
					.removeClass(this.panelClass + '-disabled');

			} else {
				// disabled
				this.disableResizable();


				// [4] set classes
				this.$el
					.addClass(this.panelClass + '-disabled')
					.removeClass(this.panelClass + '-enabled');
			}

			this.panels
				.arrangeBoundaries()
				.arrangeHandles();

		});

	};

	exports.bbpPanelEnabled = function bbpPanelEnabled() {
		return this.modeld.get('panelStatus') === 'enabled';
	};

	exports.bbpEnablePanel = function bbpEnablePanel() {
		this.modeld.set('panelStatus', 'enabled');
		return this;
	};

	exports.bbpDisablePanel = function bbpDisablePanel() {
		this.modeld.set('panelStatus', 'disabled');
		return this;
	};

});

/**
 *
 * @module backbone-panels
 * @submolude panel-builder
 */
define('__backbone-panels/panel/index',['require','exports','module','lodash','backbone-ui-resizable','lowercase-backbone','./parse-data','./animations','./enable-disable'],function (require, exports, module) {
	

	var _ = require('lodash'),
		resizable = require('backbone-ui-resizable'),
		backbone = require('lowercase-backbone');

	// internal
	var parseData = require('./parse-data');

	var panel = module.exports = resizable.extend({

		initialize: function initialize(options) {


			backbone.view.prototype.initialize.call(this, options);

			this.initializeModelView(options);

			this.initializeUIDraggable(options);


			this.initializeUIResizable(options);



			this.initializePanel(options);


		},

		initializePanel: function initializePanel(options) {

			// reference to the panels object
			this.panels = options.panels;

			// set an id for the panel.
			this.id = this.$el.prop('id');

			// set initial data
			var data = parseData.call(this);

			// set defaults
			_.defaults(data, this.bbpDefaults);

			this.modeld.set(data);


			// initialize enable-disable system
			this._initializePanelEnableDisable();


			this.$el.addClass(this.panelClass);


			// listen to resizestart and resizestop
			this.on('resizestart', function () {
				this.modeld.set('bbpPanelResizing', true);
			}, this);

			this.on('resizestop', function () {
				this.modeld.set('bbpPanelResizing', false);
			}, this);
		},

		/**
		 *
		 * Returns whether the panel is currently resizing.
		 *
		 */
		bbpPanelResizing: function bbpPanelResizing() {
			return this.modeld.get('bbpPanelResizing');
		},

		/**
		 *
		 * The default values to be set to the panel modeld
		 *
		 */
		bbpDefaults: {
			panelStatus: 'enabled',
			minWidth: '0',
			maxWidth: '100%',
			height: '100%',
		},

		handles: 'w,e',

		panelClass: 'panel',
	});

	panel
		.proto(require('./animations'))
		.proto(require('./enable-disable'));
});

/**
 * Logic for iterating over panel views.
 *
 *
 * @module backbone-panels
 * @submolude iterators
 */
define('__backbone-panels/iterators',['require','exports','module','lodash'],function (require, exports, module) {
	

	var _ = require('lodash');

	// Underscore methods that we want to implement on the Collection.
	// 90% of the core usefulness of Backbone Collections is actually implemented
	// right here:
	var _methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
	'inject', 'reduceRight', 'foldr', 'find', 'findIndex', 'detect', 'filter', 'select',
	'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke',
	'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest',
	'tail', 'drop', 'last', 'without', 'difference', 'indexOf', 'shuffle',
	'lastIndexOf', 'isEmpty', 'chain', 'sample', 'partition'];

	_.each(_methods, function (method) {
		exports[method] = function () {

			var args = Array.prototype.slice.call(arguments);

			// add panels
			args.unshift(this.panels);

			return _[method].apply(_, args);
		};
	});

	/**
	 * Returns an array with only the enabled panels.
	 *
	 *
	 * @method enabledPanels
	 *
	 */
	exports.enabledPanels = function enabledPanels() {
		return this.filter(function (panel) {
			return panel.bbpPanelEnabled();
		});
	};

	/**
	 * Retrieve all models before the given one.
	 *
	 * @method before
	 * @param index {Backbone Model|Number}
	 */
	exports.before = function before(index) {
		return this.first(index);
	};

	/**
	 * Retrieve all models after the given one.
	 *
	 * @method after
	 * @param index {Backbone Model|Number}
	 */
	exports.after = function after(index) {
		return this.rest(index + 1);
	};

	/**
	 *
	 * @method reduceBefore
	 * @param index {Backbone Model|Number}
	 * @param iter {Function}
	 * @param memo {*}
	 * @param [context] {Object}
	 */
	exports.reduceBefore = function reduceBefore(index, iter, memo, context) {
		var before = this.before(index);
		return _.reduce(before, iter, memo, context);
	};

	/**
	 *
	 * @method reduceAfter
	 * @param index {Backbone Model|Number}
	 * @param iter {Function}
	 * @param memo {*}
	 * @param [context] {Object}
	 */
	exports.reduceAfter = function reduceAfter(index, iter, memo, context) {
		var after = this.after(index);
		return _.reduce(after, iter, memo, context);
	};
});

/**
 * Logic for positioning the panels at the right starting place.
 *
 * @module backbone-panels
 * @submodule positioners
 */
define('__backbone-panels/arrange/position',['require','exports','module','lodash'],function (require, exports, module) {
	

	var _ = require('lodash');

	/**
	 * Returns the left position at which a given
	 * panel should be placed.
	 *
	 * @method calculateLeftPos
	 * @param panel {Bakcbone Model}
	 */
	function calculateLeftPos(index) {
		return this.reduceBefore(index, function (value, panel) {
			return value + panel.modeld.get('width');
		}, 0);
	}





	/**
	 * Set the place for the panel.
	 *
	 * @method postitionPanel
	 * @param panel {Backbone Model}
	 */
	module.exports = _.throttle(function arrangePositions() {

	//	console.log('arrange positions')

		this.each(function (panel, index) {


			var left = calculateLeftPos.call(this, index);

			panel.modeld.set({
				left: left,
				top: 0
			});

		}, this);


		return this;
	}, 50);
});

/**
 * Logic for positioning the panels at the right starting place.
 *
 * @module backbone-panels
 * @submodule positioners
 */
define('__backbone-panels/arrange/boundaries',['require','exports','module'],function (require, exports, module) {
	


	// private
	function sumBefore(attr, index) {
		return this.reduceBefore(index, function (value, panel) {
			return panel.bbpPanelEnabled() ? value + panel.modeld.get(attr) : value + panel.modeld.get('width');
		}, 0);
	}




	function setPanelLeftBoundaries(panel, index) {
		var maxWidthBefore = sumBefore.call(this, 'maxWidth', index),
			minWidthBefore = sumBefore.call(this, 'minWidth', index);

		panel.modeld.set('maxLeft', maxWidthBefore);

		panel.modeld.set('minLeft', minWidthBefore);
	}

	// after
	function sumAfter(attr, index) {
		return this.reduceAfter(index, function (value, panel) {
			return panel.bbpPanelEnabled() ? value + panel.modeld.get(attr) : value + panel.modeld.get('width');
		}, 0);
	}

	function setPanelRightBoundaries(panel, index) {

		var minWidthAfter = sumAfter.call(this, 'minWidth', index),
			maxWidthAfter = sumAfter.call(this, 'maxWidth', index);

		var totalWidth = sumAfter.call(this, 'width', -1);

		panel.modeld.set('maxRight', totalWidth - minWidthAfter);

		panel.modeld.set('minRight', totalWidth - maxWidthAfter);
	}








	module.exports = function arrangeBoundaries() {

	//	console.log('arrange boundaries');

		this.each(function (panel, index) {

			setPanelLeftBoundaries.call(this, panel, index);

			setPanelRightBoundaries.call(this, panel, index);

		}, this);

		return this;
	};
});

/**
 * Logic for positioning the panels at the right starting place.
 *
 * @module backbone-panels
 * @submodule positioners
 */
define('__backbone-panels/arrange/index',['require','exports','module','lodash','./position','./boundaries'],function (require, exports, module) {
	


	var _ = require('lodash');

	exports.arrangePositions = require('./position');


	exports.arrangeBoundaries = require('./boundaries');

	exports.arrangeHandles = function arrangeHandles() {

		var enabledPanels = this.filter(function (p) {
			return p.bbpPanelEnabled();
		});

		_.each(enabledPanels, function (panel, index) {

			// disable limit handles
			if (index === 0) {

				panel
					.disableHandle('w')
					.enableHandle('e');

			} else if (index === enabledPanels.length - 1) {

				panel
					.disableHandle('e')
					.enableHandle('w');
			} else {
				panel
					.enableHandle('w')
					.enableHandle('e');
			}

		}, this);

		return this;

	};

	/**
	 * Puts all panels in their places
	 * by calculating left positions on them all.
	 *
	 * @method arrange
	 */
	exports.arrange = function arrange() {


	//	console.log('arrange')

		this.arrangePositions();
		this.arrangeBoundaries();
		this.arrangeHandles();
	};
});

/**
 * Logic for dealing with panel resizing
 *
 * @module backbone-panels
 * @submolude event-handlers
 */
define('__backbone-panels/event-handlers',['require','exports','module','lodash'],function (require, exports, module) {
	

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

/**
 * Logic for dealing with panel resizing
 *
 * @module backbone-panels
 * @submolude actions
 */
define('__backbone-panels/controllers',['require','exports','module','lodash'],function (require, exports, module) {
	

	var _ = require('lodash');


	/**
	 *
	 *
	 * @param data {Object}
	 *     @param index
	 *     @param panel
	 *     @param panels
	 *     @param operation
	 *     @param eventData
	 */
	exports.calcPanelElasticity = function calcPanelElasticity(d) {
		var panelElasticity = parseFloat(d.panel.modeld.get('elasticity'));

		return !isNaN(panelElasticity) ? panelElasticity : this.controlOptions.elasticity;
	};

	exports.controlOptions = {
		agent: 'panels-control',
		elasticity: 0.3,
	};

	function generateController(_o) {

		/**
		 * _o:
		 *     loopDirection: 'shift' | 'pop'
		 *     move:
		 *     absorb:
		 *
		 */

		return function controller(panels, delta, edata) {

			var coptions = this.controlOptions;

			// [0] variable to hold panels to be looped through
			//     array direction is controlled by loopDirection option
			var loop = _.clone(panels);
			if (_o.loopDirection === -1) {
				loop.reverse();
			}

			// [1] variable to hold panels that were
			//     sized once.
			var _panels = [];

			// [2] loop through panels
			while (loop.length && delta !== 0) {

				// [2.1] get the loop panel to be sized
				var panel = loop.pop();

				// [2.2] check panel status
				if (panel.bbpPanelEnabled() && !panel.bbpPanelResizing()) {
					// [2.2-A] panel ENABLED AND NOT RESIZING

					// Add the panel to the list of 'sized panels'
					_panels.push(panel);

					if (loop.length === 0) {
						// [A-1] LAST PANEL

						// this is the last panel, it should absorb the rest
						// of the delta by either contracting or expanding

						delta = panel[_o.absorb](delta, coptions);

					} else {




						var elasticity = this.calcPanelElasticity({
							index: panels.length - loop.length - 1,
							panel: panel,
							panels: panels,
							operation: _o.operation,
							eventData: edata,
						});

						// [A-2] NORMAL PANEL

						// [A-2.1] Separate delta into movement and absorption
						var dAbsorb = delta * elasticity,
							dMove = delta - dAbsorb;

						// [A-2.2] Absorb
						var absorbRemainder = panel[_o.absorb](dAbsorb, coptions);

						// [A-2.3] Move
						var moveRemainder = panel[_o.move](dMove + absorbRemainder, coptions);

						// [A-2.4] update the global delta
						//         by subtracting the delta that was absorbed
						delta -= (dAbsorb - absorbRemainder);
					}


				} else {
					// [2.2-B] panel DISABLED OR RESIZING
					//     Just move it.
					//     Do not alter the delta at all.
					panel[_o.move](delta, coptions);
				}

			}


			// [3] If there is still delta to be absorbed,
			//     divide it among all panels
			if (delta) {
				while (_panels.length > 0 && delta !== 0) {
					delta = _panels.pop()[_o.absorb](delta, coptions);
				}
			}

/*
			console.log('---remaining delta---')
			console.log(delta);
			console.log('---remaining delta---')
*/
		};

	}


	/**
	 * Invoked whenever the panels to the left of a panel
	 * have to be contracted towards the left.
	 * It is a response to left-expansion on a panel.
	 *
	 * @method contractToLeft
	 * @param panels {Array of panels}
	 * @param delta {Number}
	 */
	exports.contractPanelsToLeft = generateController({
		absorb: 'contractToLeft',
		move: 'moveToLeft',
		loopDirection: 1,
		operation: 'contract',
	});

	/**
	 * This method is called whenever a panel
	 * is on expansion towards the Right side,
	 * so that the panels right to it have to contract
	 *
	 *
	 * @method contractToRight
	 * @param panels {Array of panelViews}
	 * @param delta {+Number}
	 */
	exports.contractPanelsToRight = generateController({
		absorb: 'contractToRight',
		move: 'moveToRight',
		loopDirection: -1,
		operation: 'contract',
	});

	/**
	 * Invoked whenever the panels to the right of a panel
	 * have to be expanded towards the left.
	 * It is a response to right-contraction on a panel.
	 *
	 * @method expandToLeft
	 * @param panels {Array of panel panels}
	 * @param delta {Number}
	 */
	exports.expandPanelsToLeft = generateController({
		absorb: 'expandToLeft',
		move: 'moveToLeft',
		loopDirection: -1,
		operation: 'expand',
	});


	/**
	 * Invoked whenever the panels to the left of a panel
	 * have to be contracted towards the right.
	 * It is a response to left-contraction on a panel.
	 *
	 * @method expandPanelsToRight
	 * @param panels {Array of panel panels}
	 * @param delta {Number}
	 */
	exports.expandPanelsToRight = generateController({
		absorb: 'expandToRight',
		move: 'moveToRight',
		loopDirection: +1,
		operation: 'expand'
	});
});

define('__backbone-panels/calculators',['require','exports','module'],function (require, exports, module) {
	

	var isPercentage = /[0-9.]+%/;

	exports.evalMeasureX = function evalMeasureX(measure) {

		if (isPercentage.test(measure)) {

			var percentual = parseFloat(measure) * 1 / 100;

			measure = percentual * this.$el.width();

		}

		return measure;
	};

	exports.evalMeasureY = function evalMeasureY(measure) {

		if (isPercentage.test(measure)) {

			var percentual = parseFloat(measure) * 1 / 100;

			measure = percentual * this.$el.height();

		}

		return measure;
	};
});

/**
 * Logic for enabling and disabling panels
 *
 * @module backbone-panels
 * @submodule enable-disable
 */
define('__backbone-panels/enable-disable',['require','exports','module'],function (require, exports, module) {
	

	exports.enablePanel = function enablePanel(id) {

		this.getPanelById(id).enablePanel();

		return this;
	};

	exports.disablePanel = function disablePanel(id) {

		this.getPanelById(id).disablePanel();

		return this;
	};

	exports.enablePanelAt = function enablePanelAt(index) {

		this.getPanelAt(index).enablePanel();

		return this;

	};

	exports.disablePanelAt = function disablePanelAt(index) {

		this.getPanelAt(index).disablePanel();

		return this;
	};
});

/**

 */
define('__backbone-panels/panel-meta-data',['require','exports','module','lodash'],function (require, exports, module) {
	

	var _ = require('lodash');



	/**
	 * Retrieve the index of a given panel object.
	 *
	 *
	 * @method panelIndex
	 * @param panel {Object}
	 */
	exports.panelIndex = function panelIndex(panel) {
		return this.findIndex(function (p) {
			return p.cid === panel.cid;
		});
	};



	/**
	 * Returns the type of the panel.
	 * Either 'head', 'middle', 'tail'
	 *
	 * @method panelType
	 * @param panel {Panel object}
	 */
	exports.panelType = function panelType(panel) {
		var enabledPanels = this.enabledPanels();

		if (enabledPanels.length === 1) {
			return 'only';
		} else {

			if (panel.id === enabledPanels[0].id) {
				return 'head';
			} else if (panel.id === _.last(enabledPanels).id) {
				return 'tail';
			} else {
				return 'middle';
			}
		}
	};
});

//     backbone-panels
//     (c) simonfan
//     backbone-panels is licensed under the MIT terms.

/**
 * Provides a responsive panel system.
 *
 * @module backbone-panels
 */
define('backbone-panels',['require','exports','module','jquery','lowercase-backbone','lodash','./__backbone-panels/panel/index','./__backbone-panels/iterators','./__backbone-panels/arrange/index','./__backbone-panels/event-handlers','./__backbone-panels/controllers','./__backbone-panels/calculators','./__backbone-panels/enable-disable','./__backbone-panels/panel-meta-data'],function (require, exports, module) {
	

	var $ = require('jquery'),
		backbone = require('lowercase-backbone'),
		_ = require('lodash');

	// internal
	var panelBuilder = require('./__backbone-panels/panel/index');

	var panels = module.exports = backbone.view.extend({

		initialize: function initialize(options) {
			backbone.view.prototype.initialize.call(this, options);

			// this
			this.initializePanels.call(this, options);
		},

		/**
		 * Initialization logic for panels view.
		 *
		 * @method initialPanels
		 * @param options {Object}
		 */
		initializePanels: function initializePanels(options) {

			// [1] bind event handling methods
			_.bindAll(this,
				'handlePanelResize',
				'handlePanelResizeStart',
				'handlePanelResizeStop'
			);

			// [2] set styles for the panel element.
			this.$el.css(this.css);

			// [3] initialize single panel-views
			/**
			 * Array where the single panel views are stored
			 * in the order they appear (left->right) on the view.
			 *
			 * @property panels
			 * @type Array
			 */
			this.panels = [];

			// start panels that already are in the html
			_.each(this.$el.children(), function (el, index) {

				this.addPanel(index, {
					el: $(el)
				});

			}, this);

			// [4] arrange the views.
			this.arrange();

		},

		/**
		 * The constructor method for the single panel view.
		 *
		 * @property panelBuilder
		 * @type Function
		 */
		panelBuilder: panelBuilder,
		panelTemplate: '<div></div>',
		panelClass: 'panel',

		/**
		 * Adds a panel at a given index.
		 *
		 * @method addPanel
		 * @param index {Number}
		 * @param options {Object}
		 */
		addPanel: function addPanel(index, options) {

			var $el;

			if (options.el) {
				$el = options.el;
			} else {
				// build the $el.
				var html = _.isFunction(this.panelTemplate) ? this.panelTemplate(options) : this.panelTemplate;

				$el = $(html).appendTo(this.$el);
			}

			var panel = this.panelBuilder(_.extend({}, this.handleOptions, options, {
				el: $el,
				model: backbone.model(),

				panels: this,
			}));


			// listen to panel resize
			this.listenTo(panel, 'resizestart', this.handlePanelResizeStart)
				.listenTo(panel, 'resize-x', this.handlePanelResize)
				.listenTo(panel, 'resizestop', this.handlePanelResizeStop);

			// listen to changes on minWidth and maxWidth
			this.listenTo(panel.modeld, 'change:minWidth change:maxWidth', this.arrangeBoundaries);

			// listen to resize events on window
		//	$(window).on('resize', _.bind(this.arrange, this));


			// put the panl in the panels array
			this.panels.splice(index, 1, panel);
		},


		getPanelById: function getPanelById(id) {
			return this.find(function (panel) {
				return panel.id === id;
			});
		},

		getPanelAt: function getPanelAt(index) {
			return this.panels[index];
		},

		/**
		 * Css to be set on the main $el.
		 *
		 * @property css
		 * @type Object
		 */
		css: {
			position: 'relative'
		},
	});

	panels.proto(require('./__backbone-panels/iterators'));
	panels.proto(require('./__backbone-panels/arrange/index'));
	panels.proto(require('./__backbone-panels/event-handlers'));
	panels.proto(require('./__backbone-panels/controllers'));
	panels.proto(require('./__backbone-panels/calculators'));
	panels.proto(require('./__backbone-panels/enable-disable'));
	panels.proto(require('./__backbone-panels/panel-meta-data'));


	// static properties
	/**
	 * Make the singlePanelBuilder available as a static prop
	 * for easer extension.
	 *
	 * @property panelBuilder
	 */
	panels.panelBuilder = panelBuilder;
});

