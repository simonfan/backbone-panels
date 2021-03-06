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
			this.listenTo(panel.model, 'change:minWidth change:maxWidth', this.arrangeBoundaries);

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
