/**
 *
 * @module backbone-panels
 * @submolude panel-builder
 */
define(function (require, exports, module) {
	'use strict';

	var _ = require('lodash'),
		resizable = require('backbone-ui-resizable');

	var panel = module.exports = resizable.extend({

		initialize: function initialize(options) {
			resizable.prototype.initialize.call(this, options);

			this.initializePanel(options);
		},

		initializePanel: function initializePanel(options) {

			// reference to the panels object
			this.panels = options.panels;

			// set an id for the panel.
			this.id = this.$el.prop('id');

			// set initial data
			var data = this.parseData(this.$el.data());
			this.model.set(data);


			this.$el.addClass(this.panelClass);


			if (options.disabled) {
				this.disablePanel();
			} else {
				this.enablePanel();
			}
		},

		parseData: require('./parse-data'),

		handles: 'w,e',

		handleOptions: {
			clss: 'handle',
			ratio: 0,
			thickness: 25,
		},

		panelClass: 'panel',

		enablePanel: function enablePanel() {

			this.$el
				.addClass(this.panelClass + '-enabled')
				.removeClass(this.panelClass + '-disabled');

			this.model.set(this.__minmax__);

			this.model.set('panelEnabled', true);

			return this;
		},

		disablePanel: function disablePanel() {

			var model = this.model;

			this.__minmax__ = {
				minWidth: model.get('minWidth'),
				maxWidth: model.get('maxWidth')
			};

			model.set({
				minWidth: model.get('width'),
				maxWidth: model.get('width'),
				panelEnabled: false,
			});

			this.$el
				.addClass(this.panelClass + '-disabled')
				.removeClass(this.panelClass + '-enabled');
		},
	});

	panel.proto(require('./animations'));
});
