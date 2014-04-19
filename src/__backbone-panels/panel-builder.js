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

		handleOptions: {
			directions: 'w,e',
			clss: 'handle',
			ratio: 0,
			thickness: 25,
		},
	});
});
