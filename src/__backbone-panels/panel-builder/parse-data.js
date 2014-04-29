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

	/**
	 *
	 *
	 * This method retrieves the configuration data for
	 * a single panel from the DOM element
	 *
	 * All data returned from this method will be directly set to
	 * the model.
	 *
	 * @method parseData
	 */
	module.exports = function parseData() {

		var data = this.$el.data(),
			d = {};

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

		// set defaults
		d.panelStatus = data.bbpStatus;

		return d;
	};

});
