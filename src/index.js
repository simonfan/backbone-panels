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

				var $el = $(el),
					data = this.panelDataParser($el.data());

				data.el = $el;

				this.addPanel(index, data);

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
		panelBuilder: require('./__backbone-panels/panel-builder'),
		panelTemplate: '<div></div>',
		panelClass: 'panel',

		/**
		 * Parses the data retrieved from the $el.data() method.
		 *
		 * @methdo panelDataParser
		 * @param data
		 */
		panelDataParser: require('./__backbone-panels/panel-data-parser'),

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
	panels.proto(require('./__backbone-panels/enable-disable'));
});
