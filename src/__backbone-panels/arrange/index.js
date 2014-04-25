/**
 * Logic for positioning the panels at the right starting place.
 *
 * @module backbone-panels
 * @submodule positioners
 */
define(function (require, exports, module) {
	'use strict';

	exports.arrangePositions = require('./position');


	exports.arrangeBoundaries = require('./boundaries');

	exports.arrangeHandles = function arrangeHandles() {

		var enabledPanels = this.filter(function (p) {
			return p.panelEnabled();
		});

		_.each(enabledPanels, function (panel, index) {

			// disable limit handles
			if (index === 0) {
				panel.disableHandle('w');
			} else if (index === this.panels.length - 1) {
				panel.disableHandle('e');
			} else {
				panel
					.enableHandle('w')
					.enableHandle('e');
			}

		}, this);

	}

	/**
	 * Puts all panels in their places
	 * by calculating left positions on them all.
	 *
	 * @method arrange
	 */
	exports.arrange = function arrange() {


		console.log('arrange')

		this.arrangePositions();
		this.arrangeBoundaries();
		this.arrangeHandles();
	};
});