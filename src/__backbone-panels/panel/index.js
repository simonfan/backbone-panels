/**
 *
 * @module backbone-panels
 * @submolude panel-builder
 */
define(function (require, exports, module) {
	'use strict';

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
