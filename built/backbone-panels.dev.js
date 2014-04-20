define('__backbone-panels/panel-builder/parse-data',['require','exports','module','lodash'],function (require, exports, module) {
	

	var _ = require('lodash');


	// private
	var measures = {
			x: [
				'minLeft', 'left', 'maxLeft',
				'minWidth', 'width', 'maxWidth', 'defaultWidth'
			],
			y: [
				'minTop', 'top', 'maxTop',
				'minHeight', 'height', 'maxHeight',
			],
		};

	module.exports = function parseData(data) {

		// parse x-axis percentual measures
		_.each(measures.x, function (measure) {
			data[measure] = this.panels.evalMeasureX(data[measure]);
		}, this);

		// parse y-axis percentual measure
		_.each(measures.y, function (measure) {
			data[measure] = this.panels.evalMeasureY(data[measure]);
		}, this);

		return data;
	};

});

define('__backbone-panels/panel-builder/animations',['require','exports','module','lodash'],function (require, exports, module) {
	

	var _ = require('lodash');

	exports.open = function open(direction, options) {

		this.enablePanel();

		var openWidth = parseFloat(this.panels.evalMeasureX(this.model.get('openWidth'))),
			currWidth = parseFloat(this.model.get('width')),
			delta = Math.abs(openWidth - currWidth);

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

/**
 *
 * @module backbone-panels
 * @submolude panel-builder
 */
define('__backbone-panels/panel-builder/index',['require','exports','module','lodash','backbone-ui-resizable','./parse-data','./animations'],function (require, exports, module) {
	

	var _ = require('lodash'),
		resizable = require('backbone-ui-resizable');

	var panel = module.exports = resizable.extend({

		initialize: function initialize(options) {
			resizable.prototype.initialize.call(this, options);

			this.initializePanel(options);
		},

		initializePanel: function initializePanel(options) {

			// reference to the panels object
			this.panels = options.panels;

			// set an id for the panel.
			this.id = this.$el.prop('id');

			// set initial data
			var data = this.parseData(this.$el.data());
			this.model.set(data);


			this.$el.addClass(this.panelClass);


			if (options.disabled) {
				this.disablePanel();
			} else {
				this.enablePanel();
			}
		},

		parseData: require('./parse-data'),

		handles: 'w,e',

		handleOptions: {
			clss: 'handle',
			ratio: 0,
			thickness: 25,
		},

		panelClass: 'panel',

		enablePanel: function enablePanel() {

			this.$el
				.addClass(this.panelClass + '-enabled')
				.removeClass(this.panelClass + '-disabled');

			this.model.set(this.__minmax__);

			this.model.set('panelEnabled', true);

			return this;
		},

		disablePanel: function disablePanel() {

			var model = this.model;

			this.__minmax__ = {
				minWidth: model.get('minWidth'),
				maxWidth: model.get('maxWidth')
			};

			model.set({
				minWidth: model.get('width'),
				maxWidth: model.get('width'),
				panelEnabled: false,
			});

			this.$el
				.addClass(this.panelClass + '-disabled')
				.removeClass(this.panelClass + '-enabled');
		},
	});

	panel.proto(require('./animations'));
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
define('__backbone-panels/panel-config',['require','exports','module'],function (require, exports, module) {
	



	exports.sumBefore = function sumBefore(attr, index) {
		return this.reduceBefore(index, function (value, panel) {
			return value + panel.get(attr);
		}, 0);
	};

	exports.sumAfter = function sumAfter(attr, index) {
		return this.reduceAfter(index, function (value, panel) {
			return value + panel.get(attr);
		}, 0);
	};


	/**
	 * Returns the left position at which a given
	 * panel should be placed.
	 *
	 * @method calculateLeftPos
	 * @param panel {Bakcbone Model}
	 */
	exports.calculateLeftPos = function calculateLeftPos(index) {
		return this.sumBefore('width', index);
	};

	/**
	 * Set the place for the panel.
	 *
	 * @method postitionPanel
	 * @param panel {Backbone Model}
	 */
	exports.postitionPanel = function postitionPanel(panel) {
		var index = this.panelIndex(panel),
			left = this.calculateLeftPos(index);

		panel.model.set({
			left: left,
			top: 0
		});
	};


	exports.setPanelRightBoundaries = function setPanelRightBoundaries(panel) {
		var index = this.panelIndex(panel),
			minWidthAfter = this.sumAfter('minWidth', index),
			maxWidthAfter = this.sumAfter('maxWidth', index);

		var totalWidth = this.sumAfter('width', -1);

		panel.model.set('maxRight', totalWidth - minWidthAfter);

		panel.model.set('minRight', totalWidth - maxWidthAfter);
	};

	exports.setPanelLeftBoundaries = function setPanelLeftBoundaries(panel) {
		var index = this.panelIndex(panel),
			maxWidthBefore = this.sumBefore('maxWidth', index),
			minWidthBefore = this.sumBefore('minWidth', index);

		panel.model.set('maxLeft', maxWidthBefore);

		panel.model.set('minLeft', minWidthBefore);
	};


	/**
	 * Puts all panels in their places
	 * by calculating left positions on them all.
	 *
	 * @method arrange
	 */
	exports.arrange = function arrange() {

		this.each(function (panel, index) {

			// disable limit handles
			if (index === 0) {
				panel.disableHandle('w');
			} else if (index === this.panels.length - 1) {
				panel.disableHandle('e');
			}


			this.postitionPanel(panel);

			this.setPanelRightBoundaries(panel);

			this.setPanelLeftBoundaries(panel);

		}, this);
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


			if (edata.action === 'expand') {
				// contract other guys

				if (edata.handle === 'w') {
					// contract before

					before = this.before(index);

					this.contractPanelsToLeft(before, delta);

				} else if (edata.handle === 'e') {
					// contract after
					after = this.after(index);

					this.contractPanelsToRight(after, delta);

				}

			} else if (edata.action === 'contract') {

				// expand other guys
				if (edata.handle === 'w') {
					// expand before

					before = this.before(index);

					this.expandPanelsToRight(before, delta);

				} else if (edata.handle === 'e') {
					// expand after
					after = this.after(index);

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

/**
 * Logic for dealing with panel resizing
 *
 * @module backbone-panels
 * @submolude actions
 */
define('__backbone-panels/actions',['require','exports','module','lodash'],function (require, exports, module) {
	

	var _ = require('lodash');

	/**
	 * Invoked whenever the panels to the left of a panel
	 * have to be contracted towards the left.
	 * It is a response to left-expansion on a panel.
	 *
	 * @method contractToLeft
	 * @param panels {Array of panels}
	 * @param delta {Number}
	 */
	exports.contractPanelsToLeft = function contractPanelsToLeft(panels, delta) {


		while (panels.length > 0 && delta !== 0) {

			var panel = panels.pop();

			if (panels.length === 0) {
				// this is the last panel,
				// it has to contract all the delta
				delta = panel.contractToLeft(delta, { agent: 'panels-control' });

			} else {

				var dMove = delta / 1.5,
					dContract = delta - dMove;


				// [1] move to the left the amount that
				//     is required
				var moveRemainder = panel.moveToLeft(dMove, { agent: 'panels-control' });


				// [2] contract to the left the amount required
				var contractRemainder = panel.contractToLeft(dContract + moveRemainder, { agent: 'panels-control' });

				// [3] the remainders from the contract operation
				//     should go over to movement
				if (contractRemainder) {
					panel.moveToLeft(contractRemainder, { agent: 'panels-control' });
				}

				// [4] update the global delta
				delta = dMove + contractRemainder;
			}
		}

	};

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
	exports.contractPanelsToRight = function contractPanelsToRight(panels, delta) {
		while (panels.length > 0 && delta > 0) {

			// get the first panel from the panels to the right
			var panel = panels.shift();

			if (panels.length === 0) {
				// this is the last panel,
				// it has to contract all the delta
				delta = panel.contractToRight(delta, { agent: 'panels-control' });

			} else {

				var dMove = delta / 1.5,
					dContract = delta - dMove;


				// [1] move to the left the amount that
				//     is required
				var moveRemainder = panel.moveToRight(dMove, { agent: 'panels-control' });


				// [2] contract to the left the amount required
				var contractRemainder = panel.contractToRight(dContract + moveRemainder, { agent: 'panels-control' });

				// [3] the remainders from the contract operation
				//     should go over to movement
				if (contractRemainder) {
					panel.moveToRight(contractRemainder, { agent: 'panels-control' });
				}

				// [4] update the global delta
				delta = dMove + contractRemainder;
			}
		}
	};

	/**
	 * Invoked whenever the panels to the right of a panel
	 * have to be expanded towards the left.
	 * It is a response to right-contraction on a panel.
	 *
	 * @method expandToLeft
	 * @param panels {Array of panel panels}
	 * @param delta {Number}
	 */
	exports.expandPanelsToLeft = function expandPanelsToLeft(panels, delta) {

		while (panels.length > 0 && delta !== 0) {

			// get the first panel from the panels to the right
			var panel = panels.shift();

			if (panels.length === 0) {
				// this is the last panel,
				// it has to contract all the delta
				delta = panel.expandToLeft(delta, { agent: 'panels-control' });

			} else {

				var dMove = delta / 1.5,
					dContract = delta - dMove;


				// [1] move to the left the amount that
				//     is required
				var moveRemainder = panel.moveToLeft(dMove, { agent: 'panels-control' });


				// [2] contract to the left the amount required
				var contractRemainder = panel.expandToLeft(dContract + moveRemainder, { agent: 'panels-control' });

				// [3] the remainders from the contract operation
				//     should go over to movement
				if (contractRemainder) {
					panel.moveToLeft(contractRemainder, { agent: 'panels-control' });
				}

				// [4] update the global delta
				delta = dMove + contractRemainder;
			}
		}

	};

	/**
	 * Invoked whenever the panels to the left of a panel
	 * have to be contracted towards the right.
	 * It is a response to left-contraction on a panel.
	 *
	 * @method expandPanelsToRight
	 * @param panels {Array of panel panels}
	 * @param delta {Number}
	 */
	exports.expandPanelsToRight = function expandPanelsToRight(panels, delta) {

		while (panels.length > 0 && delta !== 0) {


			var panel = panels.pop();

			if (panels.length === 0) {
				// this is the last panel,
				// it has to contract all the delta
				delta = panel.expandToRight(delta, { agent: 'panels-control' });

			} else {

				var dMove = delta / 1.5,
					dContract = delta - dMove;


				// [1] move to the left the amount that
				//     is required
				var moveRemainder = panel.moveToRight(dMove, { agent: 'panels-control' });


				// [2] contract to the left the amount required
				var contractRemainder = panel.expandToRight(dContract + moveRemainder, { agent: 'panels-control' });

				// [3] the remainders from the contract operation
				//     should go over to movement
				if (contractRemainder) {
					panel.moveToRight(contractRemainder, { agent: 'panels-control' });
				}

				// [4] update the global delta
				delta = dMove + contractRemainder;
			}
		}
	};
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

//     backbone-panels
//     (c) simonfan
//     backbone-panels is licensed under the MIT terms.

/**
 * Provides a responsive panel system.
 *
 * @module backbone-panels
 */
define('backbone-panels',['require','exports','module','jquery','lowercase-backbone','lodash','./__backbone-panels/panel-builder/index','./__backbone-panels/iterators','./__backbone-panels/panel-config','./__backbone-panels/event-handlers','./__backbone-panels/actions','./__backbone-panels/calculators','./__backbone-panels/enable-disable'],function (require, exports, module) {
	

	var $ = require('jquery'),
		backbone = require('lowercase-backbone'),
		_ = require('lodash');

	var panels = module.exports = backbone.view.extend({

		initialize: function initialize(options) {
			backbone.view.prototype.initialize.apply(this, arguments);

			// this
			this.initializePanels.apply(this, arguments);
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
		panelBuilder: require('./__backbone-panels/panel-builder/index'),
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

				$el = $(html);
			}

			// add needed classes
			// and append
			$el.addClass(this.panelClass)
				.appendTo(this.$el);

			var panel = this.panelBuilder(_.extend({}, this.handleOptions, options, {
				el: $el,
				model: backbone.model(options),

				panels: this,
			}));


			// listen to panel resize
			this.listenTo(panel, 'resizestart', this.handlePanelResizeStart)
				.listenTo(panel, 'resize-x', this.handlePanelResize)
				.listenTo(panel, 'resizestop', this.handlePanelResizeStop);

			// listen to changes on minWidth and maxWidth
			this.listenTo(panel.model, 'change:minWidth change:maxWidth', this.arrange);

			// listen to resize events on window
		//	this.listenTo($(window), 'resize', this.arrange);


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
	panels.proto(require('./__backbone-panels/panel-config'));
	panels.proto(require('./__backbone-panels/event-handlers'));
	panels.proto(require('./__backbone-panels/actions'));
	panels.proto(require('./__backbone-panels/calculators'));
	panels.proto(require('./__backbone-panels/enable-disable'));
});

