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

			// save index
			this.index = options.index;
		},

		handleOptions: {
			directions: 'w,e',
			clss: 'handle',
			ratio: 0,
			thickness: 25,
		},
	});
});
