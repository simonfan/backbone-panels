define(function (require, exports, module) {
	'use strict';

	var modelDock = require('model-dock'),
		resizable = require('backbone-ui-resizable'),
		collectionDock = require('collection-dock'),
		backbone = require('lowercase-backbone');

	var itemView = collectionDock.prototype.itemView;


	var panel = module.exports = itemView
		.extend(modelDock.prototype)
		.extend(resizable.prototype)
		.extend({

			html: '<div class="panel"></div>',

			initialize: function initialize(options) {
				backbone.view.prototype.initialize.apply(this, arguments);

				this.initializeItemView.apply(this, arguments);

				this.render();

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
				// collectionView is a property made available by initializeItemView.

				// listen to resize events on this
				this.on('resize', this.collectionView.handleResize);

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
