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
		backbone = require('lowercase-backbone');

	// internal
	var itemView = require('./__backbone-panels/item-view'),
		panelCollection = require('./__backbone-panels/collection');



	var panels = module.exports = collectionDock.extend({

		initialize: function initialize(options) {
			backbone.prototype.initialize.apply(this, arguments);

			// collection-dock
			this.initializeCollectionDock.apply(this, arguments);

			// this
			this.initialPanels.apply(this, arguments);
		},


		initializePanels: function initialPanels(options) {

			// set styles for the panel element.
			this.$el.css(this.css);

			// get initial set of panels
			var initialPanels = options.initialPanels || this.initialPanels || [];

			// attach a panelCollection
			this.attach(panelCollection(initialPanels));

		},

		itemHtml: '<div class="panel"></div>',

		// NOT OVERRIDABLE.
		itemView: function (options) {

			options.panels = this;

			return itemView(options);

		},

		css: {
			position: 'relative'
		},

		panel: function getPanelView(index) {

			var model = this.collection.at(index),
				view = this.itemViewInstance(model);

			return view;
		},
	});
});
