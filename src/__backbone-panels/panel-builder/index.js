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

	var panel = module.exports = resizable.extend({

		initialize: function initialize(options) {


			backbone.view.prototype.initialize.call(this, options);

			this.initializeModelDock(options);

			this.initializeUIDraggable(options);

			this.initializePanel(options);


			this.initializeUIResizable(options);

		},

		initializePanel: function initializePanel(options) {

			// reference to the panels object
			this.panels = options.panels;

			// set an id for the panel.
			this.id = this.$el.prop('id');

			// set initial data
			var data = this.parseData(this.$el.data());
			_.defaults(data, {
				panelStatus: 'enabled'
			});
			this.model.set(data);


			// initialize enable-disable system
			this._initializePanelEnableDisable();


			this.$el.addClass(this.panelClass);
		},

		parseData: require('./parse-data'),

		handles: 'w,e',

		handleOptions: {
			clss: 'handle',
			ratio: 0,
			thickness: 25,
		},

		panelClass: 'panel',
	});

	panel
		.proto(require('./animations'))
		.proto(require('./enable-disable'))
		.proto(require('./freeze-unfreeze'));
});
