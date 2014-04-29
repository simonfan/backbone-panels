/**
 * This module controls how data is processed from DOM to the model.
 *
 * @submodule parse-data
 *
 */

define(function (require, exports, module) {
	'use strict';

	var _ = require('lodash');


	// private
	var measures = {
			x: {
				bbpMinLeft:      'minLeft',
				bbpLeft:         'left',
				bbpMaxLeft:      'maxLeft',
				bbpMinWidth:     'minWidth',
				bbpWidth:        'width',
				bbpMaxWidth:     'maxWidth',
				bbpDefaultWidth: 'defaultWidth',

				bbpOpenWidth:    'openWidth',
			},
			y: {
				bbpMinTop:       'minTop',
				bbpTop:          'top',
				bbpMaxTop:       'maxTop',
				bbpMinHeight:    'minHeight',
				bbpHeight:       'height',
				bbpMaxHeight:    'maxHeight',
			},
		};

	module.exports = function parseData(data) {


		var d = {};

		// parse x-axis percentual measures
		_.each(measures.x, function (measure, dataKey) {
			d[measure] = this.panels.evalMeasureX(data[dataKey]);
		}, this);

		// parse y-axis percentual measure
		_.each(measures.y, function (measure, dataKey) {
			d[measure] = this.panels.evalMeasureY(data[dataKey]);
		}, this);

		// elasticity
		d.elasticity = data.bbpElasticity;

		return d;
	};

});
