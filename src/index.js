//     backbone-panels
//     (c) simonfan
//     backbone-panels is licensed under the MIT terms.

/**
 * AMD module.
 *
 * @module backbone-panels
 */

define(function (require, exports, module) {
	'use strict';

	var collectionDock = require('collection-dock'),
		backbone = require('lowercase-backbone'),
		_ = require('lodash');

	// internal
	var itemView = require('./__backbone-panels/item-view/index');

	var panels = module.exports = collectionDock.extend({

		initialize: function initialize(options) {
			backbone.view.prototype.initialize.apply(this, arguments);

			// collection-dock
			this.initializeCollectionDock.apply(this, arguments);

			// this
			this.initializePanels.apply(this, arguments);
		},

		itemView: itemView,

		/**
		 * Initialization logic for panels view.
		 *
		 *
		 * @method initialPanels
		 * @param options {Object}
		 */
		initializePanels: function initializePanels(options) {

			// bind methods
			_.bindAll(this, 'handleResize');

			// set styles for the panel element.
			this.$el.css(this.css);

			this.arrange();

		},

		/**
		 * Css to be set on the main $el.
		 *
		 * @property css
		 *
		 */
		css: {
			position: 'relative'
		},
	});

	panels.proto(require('./__backbone-panels/helpers'));
	panels.proto(require('./__backbone-panels/event-handlers/index'));
});
