//     backbone-panels
//     (c) simonfan
//     backbone-panels is licensed under the MIT terms.

/**
 * Provides a responsive panel system.
 *
 * @module backbone-panels
 */
define(function (require, exports, module) {
	'use strict';

	var backbone = require('lowercase-backbone'),
		_ = require('lodash');

	// internal
	var panelView = require('./__backbone-panels/panel-view/index');

	var panels = module.exports = backbone.view.extend({

		initialize: function initialize(options) {
			backbone.view.prototype.initialize.apply(this, arguments);

			// this
			this.initializePanels.apply(this, arguments);
		},

		/**
		 * The constructor method for the single panel view.
		 *
		 * @property panelView
		 * @type Function
		 */
		panelView: panelView,

		/**
		 * Initialization logic for panels view.
		 *
		 * @method initialPanels
		 * @param options {Object}
		 */
		initializePanels: function initializePanels(options) {

			// [1] bind event handling methods
			_.bindAll(this,
				'handleResize',
				'contractToLeft',
				'contractToRight',
				'expandToLeft',
				'expandToRight');

			// [2] set styles for the panel element.
			this.$el.css(this.css);

			// [3] initialize single panel-views
			/**
			 * Array where the single panel views are stored
			 * in the order they appear (left->right) on the view.
			 *
			 * @property panelViews
			 * @type Array
			 */
			this.panelViews = [];
			_.each(this.$el.children(), function (el, index) {

				var $el = $(el),
					data = $el.data();

				data = this.parsePanelData(data);

				var view = this.panelView({
					index: index,
					panelsView: this,
					el: $el,
					model: backbone.model(data)
				});

				this.panelViews.push(view);
			}, this);

			// [4] arrange the views.
			this.arrange();

		},

		/**
		 * Parse the results from this.$el.data()
		 * and return the data that should be set on the single
		 * panelView's model.
		 *
		 * @method parsePanelData
		 * @param data {Object}
		 */
		parsePanelData: function parsePanelData(data) {

			data['min-width'] = data.minWidth;
			data['max-width'] = data.maxWidth;

			data['min-left'] = data.minLeft;
			data['max-left'] = data.maxLeft;

			return data;
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
	panels.proto(require('./__backbone-panels/positioners'));
	panels.proto(require('./__backbone-panels/event-handlers/index'));
});
