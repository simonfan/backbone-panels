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

		initialize: function initializePanel(options) {
			resizable.prototype.initialize.call(this, options);

			this.$el.addClass(this.panelClass);

			// set an id for the panel.
			this.id = this.$el.prop('id');

			if (options.disabled) {
				this.disablePanel();
			} else {
				this.enablePanel();
			}
		},

		handles: 'w,e',

		handleOptions: {
			clss: 'handle',
			ratio: 0,
			thickness: 25,
		},

		panelClass: 'panel',

		enablePanel: function enablePanel() {

			this.panelEnabled = true;

			this.$el
				.addClass(this.panelClass + '-enabled')
				.removeClass(this.panelClass + '-disabled');

			this.model.set(this.__minmax__);

			return this;
		},

		disablePanel: function disablePanel() {

			var model = this.model;

			this.panelEnabled = false;

			this.__minmax__ = {
				minWidth: model.get('minWidth'),
				maxWidth: model.get('maxWidth')
			};

			model.set({
				minWidth: model.get('width'),
				maxWidth: model.get('width')
			});

			this.$el
				.addClass(this.panelClass + '-disabled')
				.removeClass(this.panelClass + '-enabled');
		},
	});
});
