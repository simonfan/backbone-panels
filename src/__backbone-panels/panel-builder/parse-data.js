define(function (require, exports, module) {
	'use strict';

	var _ = require('lodash');


	// private
	var measures = {
			x: [
				'minLeft', 'left', 'maxLeft',
				'minWidth', 'width', 'maxWidth', 'defaultWidth'
			],
			y: [
				'minTop', 'top', 'maxTop',
				'minHeight', 'height', 'maxHeight',
			],
		};

	module.exports = function parseData(data) {

		// parse x-axis percentual measures
		_.each(measures.x, function (measure) {
			data[measure] = this.panels.evalMeasureX(data[measure]);
		}, this);

		// parse y-axis percentual measure
		_.each(measures.y, function (measure) {
			data[measure] = this.panels.evalMeasureY(data[measure]);
		}, this);

		return data;
	};

});
