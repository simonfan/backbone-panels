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
	var panelBuilder = require('./__backbone-panels/panel-builder');

	var panels = module.exports = backbone.view.extend({

		initialize: function initialize(options) {
			backbone.view.prototype.initialize.apply(this, arguments);

			// this
			this.initializePanels.apply(this, arguments);
		},

		/**
		 * The constructor method for the single panel view.
		 *
		 * @property panelBuilder
		 * @type Function
		 */
		panelBuilder: panelBuilder,

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
			this.panels = _.map(this.$el.children(), function (el, index) {

				var $el = $(el),
					data = $el.data();

				var panel = this.panelBuilder(_.extend(data, {
					el: $el,
					model: backbone.model(data),
					index: index,
				}));

				// listen to panel resize
				this.listenTo(panel, 'resizestart', this.handlePanelResizeStart)
					.listenTo(panel, 'resize-x', this.handlePanelResize)
					.listenTo(panel, 'resizestop', this.handlePanelResizeStop);

				return panel;

			}, this);
			// [4] arrange the views.
			this.arrange();

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
});
