define(function (require, exports, module) {
	'use strict';

	var resizable = require('backbone-ui-resizable');

	var panel = module.exports = resizable.extend({
		initialize: function initializePanel(options) {
			resizable.prototype.initialize.apply(this, arguments);
		},

		resizableOptions: {
			handles: 'w,e'
		}
	});
});
