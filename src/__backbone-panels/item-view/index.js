define(function (require, exports, module) {
	'use strict';

	var resizable = require('backbone-ui-resizable'),
		collectionDock = require('collection-dock');



	var panel = module.exports = collectionDock.prototype.itemView
		.extend(resizable.prototype)
		.extend({
			initialize: function initializePanel(options) {
				resizable.prototype.initialize.apply(this, arguments);

				// listen to resize events on this
				this.on('resize', options.collectionView.handleResize);

				this.$el.css(this.css);
			},

			css: {
				position: 'absolute'
			},

			resizableOptions: {
				// only horizontal handles.
				handles: 'w,e'
			},
		});

	panel.proto(require('./move'));
});
