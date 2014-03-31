/**
 * The view for a single panel.
 *
 * @module backbone-panels
 * @submolude panel-view
 */
define(function (require, exports, module) {
	'use strict';

	var modelDock = require('model-dock'),
		resizable = require('backbone-ui-resizable'),
		backbone = require('lowercase-backbone');

	var panel = module.exports = backbone.view
		.extend(modelDock.prototype)
		.extend(resizable.prototype)
		.extend({

			initialize: function initialize(options) {
				backbone.view.prototype.initialize.apply(this, arguments);

				this.initializeModelDock.apply(this, arguments);
				this.initializeResizableDock.apply(this, arguments);

				this.initializePanel.apply(this, arguments);
			},

			/**
			 * Initialization logic for a single panel view.
			 *
			 * @method initializePanel
			 * @param options
			 */
			initializePanel: function initializePanel(options) {

				this.index = options.index;

				// panelsView, the main view behind this group of panels.
				this.panelsView = options.panelsView;

				// listen to resize events on this
				this.on('resize', this.panelsView.handleResize);

				this.$el.css(this.css);

			},

			css: {
				position: 'absolute',
			},

			resizableOptions: {
				// only horizontal handles.
				handles: 'w,e'
			},
		});

	panel.proto(require('./move'));
	panel.proto(require('./contract'));
	panel.proto(require('./expand'));
});
